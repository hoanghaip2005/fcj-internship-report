---
title: "Blog 4"
date: 2026-11-23
weight: 4
chapter: false
pre: " <b> 3.4. </b> "
---

## Xử lý đơn hàng bất đồng bộ với Amazon SQS và AWS Lambda

Trong một đợt flash sale, số yêu cầu đặt hàng có thể tăng nhanh hơn tốc độ xử lý của hệ thống. Nếu mọi thao tác đều chạy trong cùng một HTTP request, người dùng phải chờ kiểm tra tồn kho, ghi đơn và xử lý các bước tiếp theo. Khi một thành phần chậm, thời gian chờ lan sang toàn bộ luồng.

Amazon SQS tạo bộ đệm giữa bước tiếp nhận và bước xử lý. AWS Lambda đọc thông điệp từ hàng đợi qua event source mapping để thực thi nghiệp vụ. Kiến trúc này giúp kiểm soát tốc độ xử lý, nhưng yêu cầu thiết kế rõ trạng thái, cơ chế thử lại và cách đối phó thông điệp trùng.

Bài viết sử dụng tình huống FLASHRUSH để phân tích kiến trúc và đề xuất các bước kiểm chứng.

---

### 1. Tổng quan các thành phần trong kiến trúc

API tiếp nhận yêu cầu; SQS giữ thông điệp; Lambda worker thực thi nghiệp vụ; DynamoDB lưu trạng thái và tồn kho. DLQ cô lập thông điệp lỗi để điều tra.

![Sơ đồ kiến trúc minh họa Blog 4](/images/3-BlogsPosted/blog4-sqs-lambda.png)


* **Client / API Gateway**: gửi và tiếp nhận yêu cầu HTTP.
* **Lambda tiếp nhận**: kiểm tra dữ liệu, ghi nhận đơn và chuyển tác vụ.
* **SQS + DLQ**: đệm công việc, cô lập thông điệp vượt ngưỡng thử lại.
* **Lambda worker**: xử lý thông điệp và kết quả nghiệp vụ.
* **DynamoDB**: lưu đơn, tồn kho và trạng thái.

---

### 2. Luồng hoạt động của hệ thống

Luồng xử lý có thể tổ chức như sau:

1. Client gọi `POST /orders` qua API Gateway.
2. Lambda tiếp nhận kiểm tra dữ liệu, nhận diện yêu cầu và ghi đơn ở trạng thái `PENDING`.
3. Thông điệp chứa `orderId` được gửi đến SQS.
4. Lambda worker nhận thông điệp, kiểm tra trạng thái rồi thực hiện cập nhật nghiệp vụ có điều kiện trong DynamoDB.
5. Client gọi API tra cứu để nhận trạng thái `CONFIRMED` hoặc `OUT_OF_STOCK`.

HTTP `202 Accepted` chỉ thể hiện yêu cầu đã được tiếp nhận theo hợp đồng API. Nó không có nghĩa đơn hàng đã thành công. Giao diện cần hiển thị trạng thái đang xử lý và tiếp tục kiểm tra cho đến khi có kết quả cuối hoặc hết thời gian chờ phía client.

Nếu giao diện dừng polling, worker vẫn có thể tiếp tục xử lý. Vì vậy, thông báo “chờ quá lâu” cần cho phép người dùng tra cứu lại đơn cũ, tránh khuyến khích tạo một đơn mới ngay lập tức.


---

### 3. Những điểm cần chú ý khi triển khai

**Hàng đợi là bộ đệm, không tạo thêm tồn kho**

SQS giúp hấp thụ một phần tải đột biến trong giới hạn dịch vụ và cấu hình. Nó không bảo đảm mọi đơn đều mua được hàng, cũng không tự tăng năng lực DynamoDB hay dịch vụ phía sau.

Khi tốc độ tạo thông điệp lớn hơn tốc độ hoàn thành, backlog tăng. Hệ thống cần theo dõi cả số thông điệp chờ lẫn tuổi của thông điệp cũ nhất. Một hàng đợi dài nhưng được xử lý nhanh có ý nghĩa khác với hàng đợi nhỏ chứa tác vụ bị kẹt nhiều phút.

Với flash sale, mục tiêu là bảo toàn tính đúng của đơn và tồn kho. Tăng concurrency vô hạn có thể khiến thành phần phía sau bị throttling, làm số lần thử lại và chi phí tăng thêm.

**Visibility timeout và khả năng nhận lại thông điệp**

Khi thông điệp được nhận để xử lý, SQS tạm ẩn nó trong thời gian visibility timeout. Nếu xử lý thành công, event source mapping sẽ xóa thông điệp. Nếu xử lý thất bại hoặc hết thời gian ẩn mà chưa xóa, thông điệp có thể được nhận lại.

Standard queue có cơ chế giao ít nhất một lần và thứ tự tốt nhất có thể. Worker phải chịu được việc cùng thông điệp xuất hiện nhiều lần; không được coi mỗi lần gọi Lambda là một giao dịch mới.

Theo hướng dẫn tích hợp Lambda/SQS, visibility timeout nên ít nhất bằng sáu lần function timeout, cộng thời gian batching window nếu có. Đây là điểm khởi đầu để cấu hình; vẫn cần kiểm tra thời gian xử lý thực tế và khả năng phục hồi khi bị throttling.

Đặt timeout quá ngắn có thể làm tác vụ đang chạy bị nhận lại. Đặt quá dài có thể trì hoãn lần thử tiếp theo sau lỗi. Cần chọn theo đặc điểm nghiệp vụ và yêu cầu phục hồi.

**Batch và phản hồi lỗi từng thông điệp**

Lambda có thể nhận nhiều thông điệp trong một batch. Nếu cả lần gọi bị đánh dấu thất bại, các thông điệp đã xử lý thành công trong batch cũng có thể được nhận lại.

Có thể bật `ReportBatchItemFailures` để worker trả lại danh sách `messageId` bị lỗi. Những thông điệp khác trong batch được xem là đã xử lý thành công. Cấu hình này chỉ hoạt động đúng khi worker trả về danh sách `batchItemFailures`, trong đó mỗi `itemIdentifier` là `messageId` của thông điệp xử lý thất bại.

Với FIFO queue, phải chú ý thứ tự trong message group; hướng dẫn AWS khuyến nghị dừng xử lý sau lỗi đầu tiên và trả cả các thông điệp chưa xử lý để giữ thứ tự. Không áp dụng máy móc cách xử lý song song của Standard queue.

**Phân biệt kết quả nghiệp vụ với lỗi kỹ thuật**

`OUT_OF_STOCK` là kết quả nghiệp vụ hợp lệ. Worker nên ghi nhận trạng thái cuối này rồi hoàn thành thông điệp, thay vì liên tục ném lỗi để SQS thử lại một đơn không thể đáp ứng.

Ngược lại, lỗi kết nối tạm thời, throttling hoặc lỗi dịch vụ có thể cần thử lại. Dữ liệu thông điệp sai định dạng cần được ghi nhận có kiểm soát và xử lý theo chính sách của hệ thống.

Worker cũng cần đọc trạng thái hiện tại. Nếu đơn đã `CONFIRMED`, lần nhận lại thông điệp phải kết thúc an toàn mà không tiếp tục trừ tồn kho. Cơ chế này cần kết hợp conditional write hoặc transaction, không chỉ kiểm tra bằng một câu lệnh đọc riêng.

**DLQ và quy trình xử lý lại**

Redrive policy có thể chuyển thông điệp vượt ngưỡng `maxReceiveCount` sang dead-letter queue. DLQ giúp cô lập lỗi để điều tra; nó không tự sửa nguyên nhân.

Quy trình vận hành nên gồm: phát hiện cảnh báo, đối chiếu `orderId`, kiểm tra trạng thái dữ liệu, sửa lỗi, rồi mới cân nhắc redrive. Đẩy lại toàn bộ DLQ khi chưa hiểu nguyên nhân có thể tạo vòng lặp lỗi hoặc gây tải đột biến lần nữa.

Cần đặt thời gian lưu giữ đủ cho việc điều tra. Với Standard queue, tuổi và thời gian hết hạn liên quan đến thời điểm gửi ban đầu, nên retention của DLQ cần dài hơn queue nguồn theo khuyến nghị AWS.


---

### 4. Trường hợp áp dụng và kịch bản kiểm chứng

* **Gửi lại cùng thông điệp:** Một đơn không bị trừ kho nhiều lần

* **Một thông điệp lỗi trong batch:** Chỉ thông điệp lỗi cần thử lại khi bật phản hồi từng phần

* **Worker dừng giữa chừng:** Tác vụ được nhận lại và phục hồi an toàn

* **Hết tồn kho:** Đơn chuyển `OUT_OF_STOCK`, không lặp thử lại vô ích

* **Lỗi kéo dài:** Thông điệp đến DLQ theo chính sách, có cảnh báo

* **Client ngừng polling:** Đơn vẫn có thể hoàn thành, tra cứu lại được


Khi vận hành, cần kết hợp CloudWatch metrics của SQS, Lambda và DynamoDB: tuổi thông điệp, backlog, lỗi, throttling, thời gian xử lý và số thông điệp trong DLQ. Nhật ký nên có `orderId` để liên kết luồng, tránh ghi token hoặc dữ liệu nhạy cảm.

**Phù hợp khi:** tác vụ chấp nhận độ trễ bất đồng bộ, cần đệm tải và xử lý lại an toàn.

**Cần cân nhắc khi:** người dùng cần kết quả tức thời hoặc tác vụ không thể thiết kế idempotent; hàng đợi làm tăng yêu cầu theo dõi trạng thái và vận hành.

---

### 5. Tổng kết

Kiến trúc bất đồng bộ giúp tách tốc độ tiếp nhận khỏi tốc độ xử lý. Để giao dịch đúng, hệ thống vẫn cần trạng thái rõ ràng, thao tác có điều kiện và khả năng xử lý lại an toàn. Hàng đợi giải quyết việc điều phối công việc; logic nghiệp vụ quyết định đơn hàng có hợp lệ hay không.


---

**Tài liệu tham khảo**

- [Sử dụng Lambda với SQS](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html)
- [Cấu hình event source mapping cho SQS](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-configure.html)
- [Xử lý lỗi với Lambda và SQS](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html)
- [SQS dead-letter queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)

---

*#AWS #AmazonSQS #AWSLambda #Serverless #FLASHRUSH #AWSStudyGroup*

---

### Minh chứng bài viết đã đăng

Bài viết “Xử lý đơn hàng bất đồng bộ với Amazon SQS và AWS Lambda” được chia sẻ trong nhóm AWS Study Group VN.

![Minh chứng bài viết Xử lý đơn hàng bất đồng bộ với Amazon SQS và AWS Lambda trên AWS Study Group VN.](/images/3-BlogsPosted/evidence/blog4-sqs-lambda-published.png)
