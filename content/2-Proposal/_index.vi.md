---
title: "Proposal (Đề xuất giải pháp Workshop)"
weight: 2
chapter: false
pre: "<b>2. </b> "
---

## Đề xuất Workshop FLASHRUSH trên AWS

### 1. Tổng quan bài toán và giải pháp

FLASHRUSH là Workshop thực hành xây dựng ứng dụng Flash Sale bằng các dịch vụ AWS Serverless. Bài toán đặt ra là nhiều người cùng gửi yêu cầu mua trong khi số lượng sản phẩm có hạn; hệ thống cần tiếp nhận yêu cầu, xử lý đơn và bảo vệ tồn kho khi có thao tác thử lại hoặc thông điệp trùng.

Giải pháp đề xuất dùng React làm giao diện, API Gateway và Lambda tiếp nhận yêu cầu, SQS điều phối xử lý, DynamoDB lưu sản phẩm và đơn hàng. S3/CloudFront phân phối website; IAM, CloudWatch và SNS hỗ trợ phân quyền, theo dõi lỗi và cảnh báo. Người học cấu hình các thành phần qua AWS Management Console để hiểu vai trò và cách kết nối dịch vụ.

Giá trị của Workshop là một luồng ứng dụng nhỏ, có thể giải thích và kiểm tra từng bước: từ truy cập website đến tiếp nhận yêu cầu, xác nhận đơn và quan sát dữ liệu sau xử lý.

### 2. Mục tiêu và phạm vi

#### Mục tiêu

- Hiểu kiến trúc xử lý bất đồng bộ và phân biệt HTTP `202 Accepted` với đơn `CONFIRMED`.
- Cấu hình và kết nối chín dịch vụ AWS theo quan hệ phụ thuộc.
- Áp dụng quyền tối thiểu, S3 private và CloudFront OAC.
- Kiểm tra yêu cầu lặp, cập nhật tồn kho có điều kiện và xử lý message lỗi.
- Ghi lại cấu hình, kết quả kiểm thử và cách dọn tài nguyên để người khác thực hành lại.

#### Phạm vi Workshop

| Trong phạm vi | Sản phẩm dự kiến |
|---|---|
| Danh mục và chi tiết sản phẩm | API đọc dữ liệu sản phẩm từ DynamoDB |
| Đặt một sản phẩm mỗi yêu cầu | Kiểm tra dữ liệu đầu vào, `quantity = 1` |
| Xử lý đơn bất đồng bộ | Lambda API, SQS và Lambda Worker |
| Bảo vệ dữ liệu | Idempotency key, token tra cứu đơn và transaction tồn kho |
| Phân phối giao diện | React build trên S3 private, truy cập HTTPS qua CloudFront |
| Theo dõi và cảnh báo | Logs, metrics, alarms CloudWatch và thông báo SNS |
| Tài liệu thực hành | Hướng dẫn Console, ảnh theo bước, kịch bản kiểm tra và cleanup |

Không đưa vào Workshop này: thanh toán thật, giao hàng, vận hành thương mại, backend quản trị đầy đủ và tài khoản khách hàng production. Chức năng mô phỏng trong mã nguồn tham chiếu cần được ghi rõ khi sử dụng.

**Đối tượng:** sinh viên hoặc người mới có kiến thức cơ bản về AWS, HTTP, Python và JavaScript. **Điều kiện:** tài khoản AWS được phép sử dụng, quyền tạo tài nguyên phù hợp, Node.js để build giao diện và mã nguồn FLASHRUSH đã chọn phiên bản.

Workshop sử dụng một môi trường riêng tại `us-east-1`, prefix `flashrush-manual-*`. Các môi trường `flashrush-lab` hoặc bản mở rộng của dự án không được coi là cùng phạm vi thực hành.

### 3. Vấn đề cần giải quyết

| Vấn đề | Tác động | Hướng giải quyết đề xuất |
|---|---|---|
| Yêu cầu tăng nhanh hơn khả năng xử lý | Request chậm, dễ quá tải thành phần phía sau | SQS đệm công việc; giới hạn concurrency của Worker theo năng lực xử lý |
| Nhiều đơn cùng tranh sản phẩm ít hàng | Có thể xác nhận vượt tồn kho nếu đọc/ghi rời rạc | DynamoDB transaction và điều kiện stock khi ghi |
| Người dùng thử lại sau timeout | Tạo đơn hoặc giảm tồn kho nhiều lần | Giữ cùng idempotency key/payload; Worker xử lý thông điệp lặp an toàn |
| Lỗi kỹ thuật trong quá trình xử lý | Đơn chờ kéo dài, khó tìm nguyên nhân | Logs theo order ID, retry có kiểm soát, DLQ và quy trình đối soát |
| Giao diện báo thành công quá sớm | Người dùng hiểu nhầm kết quả mua hàng | Hiển thị trạng thái chờ sau HTTP 202; tra cứu trạng thái cuối bằng token |
| Tài liệu không khớp mã nguồn/cấu hình | Người học khó tái hiện bài lab | Chốt phiên bản nguồn, checklist cấu hình và ảnh kết quả tương ứng |

### 4. Kiến trúc giải pháp sơ bộ

![Kiến trúc sơ bộ Workshop FLASHRUSH](/images/5-Workshop/FLASHRUSH/flashrush-architecture-v1.1.png)

*Sơ đồ kiến trúc tham chiếu cho thiết kế Workshop; không phải bằng chứng nghiệm thu hệ thống.*

| Nhóm thành phần | Dịch vụ | Trách nhiệm |
|---|---|---|
| Giao diện | S3, CloudFront | Lưu bản build, phân phối HTTPS; giữ S3 private bằng OAC |
| Tiếp nhận | API Gateway, Lambda API | Kiểm tra request, ghi nhận đơn và gửi message |
| Xử lý | SQS, Lambda Worker | Đệm tác vụ, xử lý đơn, retry và cô lập lỗi bằng DLQ |
| Dữ liệu | DynamoDB | Lưu Products/Orders; kiểm soát thay đổi trạng thái và tồn kho |
| Phân quyền | IAM | Tách quyền API và Worker theo actions/resources cần thiết |
| Quan sát | CloudWatch, SNS | Logs, metrics, alarms và email cảnh báo đã xác nhận |

**Luồng chính:** người dùng mở website qua CloudFront, đọc sản phẩm qua API rồi gửi yêu cầu mua kèm idempotency key. API tiếp nhận, ghi đơn `PENDING` và gửi SQS. Worker xử lý transaction, ghi `CONFIRMED` hoặc `OUT_OF_STOCK`. Frontend tra cứu đơn bằng order ID và token để hiển thị kết quả.

**Điểm cần thiết kế rõ:** ghi DynamoDB và gửi SQS không nằm trong cùng một transaction; phải có cách phát hiện/đối soát đơn chưa được đưa vào hàng đợi. DLQ cũng không tự đổi trạng thái đơn. Các giới hạn này được đưa vào bài kiểm tra và hướng dẫn xử lý lỗi.

### 5. Kế hoạch và timeline thực hiện

Kế hoạch Workshop tập trung trong **tuần 8–10** của lộ trình thực tập. Đây là phân bổ công việc dự kiến; kết quả thực hiện được theo dõi riêng trong nhật ký.

| Giai đoạn | Thời lượng dự kiến | Công việc | Đầu ra cần có |
|---|---|---|---|
| Tuần 8: xác định yêu cầu | 1 buổi, 3 giờ | Chốt bài toán, phạm vi, phiên bản mã nguồn, sơ đồ và giả định chi phí | Đề xuất, kiến trúc sơ bộ và checklist chuẩn bị |
| Tuần 9: hạ tầng và backend | 2 buổi, 8 giờ | Tạo DynamoDB, SQS/DLQ, IAM, Lambda và API Gateway | API/Worker kết nối đúng, kiểm tra từng thành phần |
| Tuần 9: giao diện | 1 buổi, 4 giờ | Build React, cấu hình API URL, S3 private, OAC và CloudFront | Website gọi được API; kiểm tra CORS và route |
| Tuần 10: kiểm thử và giám sát | 2 buổi, 4 giờ | SNS/CloudWatch, đặt hàng, thử lại, hết hàng và lỗi message | Bảng expected/actual, logs và ảnh minh chứng |
| Tuần 10: hoàn thiện và bàn giao | 1 buổi, 3 giờ | Rà soát hướng dẫn Việt/Anh, tổng hợp giới hạn và cleanup | Tài liệu thực hành, kết quả kiểm tra và inventory sau cleanup |
| **Tổng** | **7 buổi, 22 giờ** | Điều chỉnh theo kinh nghiệm và lỗi phát sinh | Một bộ Workshop có thể thực hiện lại |

**Điều kiện hoàn thành:** đọc được sản phẩm, tạo và tra cứu đơn, không giảm kho lặp trong các ca đã kiểm tra, giữ S3 private, có log/cảnh báo được kiểm chứng và danh sách tài nguyên sau cleanup. Ca chưa chạy không đánh dấu đạt.

### 6. Dự toán ngân sách và chi phí

#### Giả định tính ngân sách

Một môi trường lab, tối đa **1 tháng**, khoảng **10.000 API request**, **1.000 yêu cầu đặt hàng**, frontend khoảng **100 MB**, truyền dữ liệu website khoảng **1 GB**, logs tối đa **0,5 GB**, **3 alarm tiêu chuẩn** và tối đa **100 email cảnh báo**. Lambda dự kiến **256 MB**, trung bình **200 ms/lần gọi**; lượng thử lại được theo dõi và giới hạn. Không dùng EC2, NAT Gateway, tên miền riêng hoặc dịch vụ trả phí ngoài danh sách.

Bảng dưới đây là **kết quả ước tính theo cùng bộ đầu vào dùng cho AWS Pricing Calculator**, chưa phải hóa đơn. Mức tham chiếu trước Free Tier khoảng **0,73 USD/tháng**; sau Free Tier có thể khoảng **0,00–0,48 USD/tháng** tùy điều kiện tài khoản. Cần nhập lại bộ đầu vào, lưu share URL và đối chiếu giá hiện hành trước khi nghiệm thu COST.

| Dịch vụ | Cơ sở dự toán | Phân bổ USD/tháng |
|---|---|---:|
| S3 | Frontend 100 MB, lưu object và request build/upload/đọc | 0,10 |
| CloudFront | Khoảng 1 GB truyền website và request HTTPS | 0,20 |
| API Gateway HTTP API | Khoảng 10.000 request | 0,05 |
| Lambda | API/Worker, 256 MB, trung bình 200 ms, có dư địa retry | 0,10 |
| DynamoDB | Hai bảng nhỏ, đọc/ghi theo yêu cầu và transaction | 0,15 |
| SQS | Gửi/nhận/xóa message và polling trong giới hạn lab | 0,05 |
| SNS | Tối đa 100 email cảnh báo và request liên quan | 0,05 |
| CloudWatch | Tối đa 0,5 GB logs, lưu log ngắn hạn, 3 alarm tiêu chuẩn | 0,60 |
| **Tổng phân bổ** | | **1,30** |
| **Dự phòng 50%** | Thử lại, sửa cấu hình và chênh lệch khối lượng | **0,65** |
| **Dự toán có dự phòng** | | **1,95** |
| **Ngân sách đề xuất** | Làm tròn để quản lý một môi trường lab | **5,00** |

Ngân sách **5 USD** là mức theo dõi, không phải trần tự động. Mở [AWS Pricing Calculator](https://calculator.aws/), nhập đúng các giả định, lưu share URL và đặt AWS Budgets trước khi chạy. Giới hạn khối lượng test, đặt log retention và dọn tài nguyên sau khi lưu minh chứng. IAM không có khoản phí riêng trong bảng này.

Chi phí nhân công và thiết bị cá nhân không tính vào ngân sách hạ tầng. Không suy ra lợi nhuận hoặc thời gian hoàn vốn từ một Workshop học tập.

### 7. Rủi ro và phương án giảm thiểu

| Rủi ro | Mức ảnh hưởng | Phương án giảm thiểu | Cách kiểm tra |
|---|---|---|---|
| Sai tồn kho hoặc đơn trùng | Cao | Điều kiện ghi/transaction và idempotency ở API/Worker | Gửi cùng key, message trùng và nhiều đơn tranh tồn kho nhỏ |
| Đơn PENDING kéo dài | Cao | Theo dõi enqueue state, queue, logs và quy trình đối soát | Thử lỗi giữa ghi đơn và gửi queue; kiểm tra khả năng phục hồi |
| Message lỗi lặp liên tục | Trung bình | Retry giới hạn, DLQ và điều tra trước redrive | Theo dõi số lần nhận, DLQ và kết quả sau xử lý lỗi |
| Quyền quá rộng hoặc lộ dữ liệu | Cao | IAM tối thiểu, S3 private/OAC, bảo vệ token và che thông tin nhạy cảm | Kiểm tra quyền bị từ chối và truy cập S3 trực tiếp |
| Website lỗi CORS/route | Trung bình | Kiểm tra origin, endpoint, cấu hình CloudFront và build | Gọi API trên trình duyệt, refresh trang chi tiết |
| Phát sinh phí ngoài dự kiến | Trung bình | Budget, giới hạn tải, retention và inventory | Đối chiếu chi phí/tài nguyên trong và sau lab |
| Nguồn, ảnh và hướng dẫn lệch phiên bản | Trung bình | Chốt source snapshot và rà cấu hình đã lưu | Người khác thực hiện lại theo tài liệu và báo điểm sai lệch |

Khi gặp lỗi ảnh hưởng tính đúng của đơn hoặc bảo mật, dừng kịch bản thử, giữ logs và dữ liệu cần điều tra, sửa nguyên nhân rồi kiểm tra lại trước khi tiếp tục. Việc xóa tài nguyên và redrive message thực hiện theo phạm vi lab đã thống nhất.
