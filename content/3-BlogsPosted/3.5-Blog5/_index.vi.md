---
title: "Blog 5"
date: 2026-11-23
weight: 5
chapter: false
pre: " <b> 3.5. </b> "
---

## Chống tạo đơn trùng và kiểm soát tồn kho với Amazon DynamoDB

Người dùng bấm đặt hàng, màn hình chờ vài giây rồi báo timeout. Yêu cầu có thể chưa tới máy chủ, đang được xử lý hoặc đã thành công nhưng phản hồi chưa quay lại. Nếu mỗi lần bấm lại đều tạo một đơn mới, hệ thống có thể ghi nhiều đơn và trừ kho nhiều lần cho cùng ý định mua hàng.

Bài toán này cần cơ chế idempotency: thực hiện lại cùng một yêu cầu hợp lệ mà không tạo thêm tác động nghiệp vụ ngoài ý định ban đầu. DynamoDB cung cấp conditional write và transaction để xây dựng cơ chế đó. Bài viết dùng luồng FLASHRUSH làm tình huống phân tích thiết kế và cách kiểm chứng.

---

### 1. Tổng quan các thành phần trong kiến trúc

Client giữ khóa cho cùng ý định mua. Backend đối chiếu khóa và payload; conditional write và transaction bảo vệ thay đổi trạng thái đơn cùng tồn kho. Sơ đồ minh họa, không phải ảnh triển khai thực tế.

![Sơ đồ kiến trúc minh họa Blog 5](/images/3-BlogsPosted/blog5-dynamodb-idempotency.png)


* **Client + Idempotency-Key**: giữ nguyên khóa và payload khi thử lại.
* **API / Lambda**: kiểm tra dữ liệu và quyền truy cập.
* **Bản ghi yêu cầu**: liên kết khóa với payload và orderId.
* **DynamoDB transaction**: gộp các thay đổi phải thành công cùng nhau.
* **Đơn hàng + tồn kho**: dữ liệu được bảo vệ bằng điều kiện nghiệp vụ.

---

### 2. Luồng hoạt động của hệ thống

**Xác định “cùng một yêu cầu”**

Một `Idempotency-Key` đại diện cho một ý định đặt hàng. Client tạo khóa trước lần gửi đầu tiên và giữ nguyên khi thử lại sau lỗi mạng. Máy chủ liên kết khóa với chủ thể đã xác thực hoặc phạm vi phiên phù hợp, cùng dấu vân tay của payload đã chuẩn hóa.

* **Cùng khóa, cùng payload:** Trả lại đơn hoặc kết quả đã ghi nhận

* **Cùng khóa, payload khác:** Từ chối xung đột, không âm thầm đổi đơn

* **Khóa mới, ý định mua mới:** Tạo yêu cầu độc lập theo quy tắc nghiệp vụ

* **Khóa của người khác:** Không cho truy cập dữ liệu chỉ vì biết khóa


Không nên dùng toàn bộ payload làm khóa, vì hai lần mua độc lập có thể cùng sản phẩm và số lượng. Ngược lại, tạo UUID mới sau mỗi timeout sẽ làm mất ý nghĩa của idempotency.

**Vì sao đọc rồi ghi chưa đủ?**

Xét cách xử lý đơn giản: đọc tồn kho, nếu còn hàng thì ghi giá trị mới. Hai worker có thể cùng đọc tồn kho bằng `1`, cùng quyết định cho mua và cùng ghi về `0`. Dữ liệu cuối nhìn có vẻ hợp lệ nhưng thực tế đã xác nhận hai đơn cho một sản phẩm.

Đọc nhất quán mạnh không tự gộp hai bước đọc và ghi thành một thao tác nguyên tử. Cần đặt điều kiện ngay trong thao tác cập nhật để DynamoDB đánh giá khi ghi.

Với Boto3 Table resource, ví dụ thiết kế là chỉ cập nhật sản phẩm đã tồn tại và giảm stock khi stock lớn hơn hoặc bằng quantity. Điều kiện phải nằm ngay trong thao tác UpdateItem để DynamoDB kiểm tra tại thời điểm ghi.

Trước đó, ứng dụng phải kiểm tra `quantity` là số nguyên dương trong giới hạn cho phép. Đây chỉ là cập nhật tồn kho có điều kiện; đoạn mã riêng lẻ chưa bảo đảm đơn và tồn kho thay đổi cùng nhau.

**Dùng transaction cho những thay đổi phải đi cùng nhau**

Nếu trừ kho thành công rồi tiến trình dừng trước khi ghi trạng thái đơn, dữ liệu có thể thiếu nhất quán. Với DynamoDB transaction, có thể nhóm các thao tác cần thành công hoặc thất bại cùng nhau.

Một transaction xác nhận đơn có thể gồm:

- Cập nhật sản phẩm: giảm `stock`, điều kiện `stock >= quantity`.
- Cập nhật đơn: chuyển từ `PENDING` sang `CONFIRMED`, điều kiện trạng thái hiện tại vẫn là `PENDING`.

Nếu cùng thông điệp được nhận lại sau khi transaction đã thành công, điều kiện trên đơn sẽ ngăn xác nhận thêm lần nữa. Worker cần đọc lại kết quả và nhận diện đây là đơn đã hoàn thành, thay vì coi mọi conditional failure đều là hết hàng.

Thiếu tồn kho, sai trạng thái, xung đột transaction và throttling là những nguyên nhân khác nhau. Cần phân loại lỗi để quyết định ghi kết quả nghiệp vụ, kiểm tra lại hay thử lại có backoff.


---

### 3. Những điểm cần chú ý khi triển khai

**Ghi nhận khóa trước khi xử lý tác vụ**

Conditional put với `attribute_not_exists` có thể dùng để giành quyền tạo bản ghi idempotency. Trong phạm vi thiết kế, bản ghi có thể chứa khóa, payload fingerprint, `orderId`, trạng thái và thời hạn lưu.

Chỉ tiến trình tạo được bản ghi theo điều kiện mới được xem là chủ sở hữu lần xử lý ban đầu. Tiến trình khác đọc lại bản ghi để trả về đơn cũ hoặc báo xung đột payload. Cần xác định hành vi khi bản ghi còn đang xử lý, đã hoàn tất hoặc bị bỏ dở do tiến trình lỗi.

Không được dùng một cờ `processed=true` độc lập sau khi đã trừ kho mà không phân tích khoảng lỗi ở giữa. Đánh dấu quá sớm có thể làm mất việc; đánh dấu quá muộn có thể tạo tác động lặp. Những thay đổi cần tính nguyên tử phải nằm trong cùng ranh giới transaction hoặc có cơ chế phục hồi rõ ràng.

**Khoảng lỗi giữa DynamoDB và SQS**

Ghi đơn vào DynamoDB và gửi thông điệp tới SQS là hai thao tác ở hai dịch vụ. DynamoDB transaction không bao gồm `SendMessage`.

Nếu ghi `PENDING` thành công nhưng gửi SQS thất bại, đơn có thể bị kẹt. Nếu gửi thành công nhưng máy chủ mất phản hồi, lần thử lại có thể tạo thêm thông điệp. Idempotency giúp worker chịu được trường hợp thứ hai; trường hợp thứ nhất vẫn cần cơ chế bảo đảm giao việc hoặc đối soát.

Một hướng thiết kế là transactional outbox: ghi đơn và bản ghi outbox trong cùng transaction, rồi dùng tiến trình hoặc DynamoDB Streams để chuyển sự kiện sang hàng đợi. Bộ chuyển tiếp vẫn phải chịu được sự kiện trùng, có theo dõi lỗi và khả năng phục hồi. Đây là phương án mở rộng để xem xét, không phải mô tả tính năng đã hoàn thành của FLASHRUSH.

**TTL không phải đồng hồ xóa chính xác**

DynamoDB TTL hỗ trợ dọn bản ghi hết hạn theo cơ chế bất đồng bộ. Bản ghi hết hạn có thể vẫn tồn tại một thời gian trước khi bị xóa, nên không dựa vào việc “đã tới giờ” để giả định bản ghi biến mất ngay.

Ứng dụng cần tự kiểm tra thời hạn trong logic phù hợp. Đồng thời, thời gian giữ khóa phải bao phủ cửa sổ thử lại và xử lý lại dự kiến. Nếu xóa bản ghi idempotency quá sớm, một yêu cầu cũ có thể được nhận như yêu cầu mới.

`ClientRequestToken` của `TransactWriteItems` cũng có cửa sổ idempotency giới hạn theo dịch vụ; không thay thế hoàn toàn bản ghi nghiệp vụ cần giữ lâu hơn. Cần kiểm tra tài liệu hiện hành và quy định rõ thời hạn trong hợp đồng API.


---

### 4. Khi nào nên dùng conditional write và transaction?

**Conditional write phù hợp khi:** cần bảo vệ điều kiện trên một bản ghi, chẳng hạn chỉ tạo khóa chưa tồn tại hoặc chỉ cập nhật trạng thái hợp lệ.

**Transaction phù hợp khi:** nhiều thay đổi phải thành công hoặc thất bại cùng nhau, chẳng hạn xác nhận đơn và giảm tồn kho. Cần cân nhắc chi phí, xung đột và giới hạn dịch vụ theo workload.

**Các tình huống cần kiểm chứng:**

Một phép thử chỉ nhìn HTTP `200` hoặc `202` chưa đủ để kết luận hệ thống chống trùng đúng. Cần đối chiếu tác động cuối lên dữ liệu.

* **Gửi đồng thời cùng khóa và payload:** Cùng `orderId`, chỉ một tác động tồn kho

* **Gửi cùng khóa nhưng đổi số lượng:** Bị từ chối theo hợp đồng, dữ liệu cũ giữ nguyên

* **Nhiều đơn tranh lượng tồn kho nhỏ:** Số lượng xác nhận không vượt kho ban đầu

* **Nhận lại thông điệp của đơn đã xác nhận:** Kho không giảm thêm

* **Lỗi sau khi ghi đơn, trước khi gửi SQS:** Phát hiện và phục hồi đơn kẹt

* **Retry sau timeout không rõ kết quả:** Tra cứu được đơn cũ, không tự tạo ý định mới


Tính đúng nên được kiểm tra bằng bất biến: tồn kho không âm; tổng số lượng đã xác nhận không vượt giới hạn; một ý định mua hợp lệ không tạo nhiều tác động. Khi chạy tải, cần ghi cấu hình concurrency, số lượng yêu cầu và thời gian đo; không gọi tổng thời gian chạy là p95 latency.


---

### 5. Tổng kết

Giao diện nên lưu ý định gửi trước khi gọi API để giữ khóa và payload khi thử lại. Request timeout chỉ kết thúc việc chờ của client; không chứng minh đơn đã thất bại phía máy chủ.

Trạng thái lưu trên trình duyệt là ảnh chụp lịch sử, cần đối chiếu API khi muốn biết trạng thái hiện tại. Khóa idempotency cũng không thay thế token tra cứu đơn hoặc kiểm tra quyền sở hữu. Cả client và backend phải thống nhất cách xử lý retry, xung đột và trạng thái đang chờ.


---

**Tài liệu tham khảo**

- [DynamoDB conditional expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html)
- [DynamoDB transaction APIs](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html)
- [DynamoDB TTL](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html)
- [Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)

---

*#AWS #DynamoDB #Idempotency #Serverless #FLASHRUSH #AWSStudyGroup*

---

### Minh chứng bài viết đã đăng

Bài viết “Chống tạo đơn trùng và kiểm soát tồn kho với Amazon DynamoDB” được chia sẻ trong nhóm AWS Study Group VN.

![Minh chứng bài viết Chống tạo đơn trùng và kiểm soát tồn kho với Amazon DynamoDB trên AWS Study Group VN.](/images/3-BlogsPosted/evidence/blog5-dynamodb-idempotency-published.png)
