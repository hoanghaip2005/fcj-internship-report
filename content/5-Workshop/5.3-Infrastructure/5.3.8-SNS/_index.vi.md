---
title: "5.3.8 Amazon SNS"
weight: 8
draft: false
---

### Mục tiêu thực hành

Trong phần này, người thực hành sẽ triển khai Amazon Simple Notification Service (Amazon SNS) trên AWS Management Console để xây dựng cơ chế gửi thông báo qua email cho hệ thống FLASHRUSH.

Sau khi hoàn thành, người thực hành có thể:

- Tạo Amazon SNS Topic thuộc loại Standard.
- Cấu hình Access Policy cho phép Amazon CloudWatch gửi cảnh báo đến SNS Topic.
- Tạo Email Subscription và xác nhận đăng ký qua Gmail.
- Gửi thông báo thử nghiệm để kiểm tra khả năng gửi email.
- Chuẩn bị SNS Topic để tích hợp với CloudWatch Alarm trong phần tiếp theo.

Lưu ý: Hướng dẫn sử dụng namespace flashrush-manual trong Region us-east-1. Các thao tác được thực hiện thủ công trên AWS Management Console, có thể phát sinh chi phí. Tách biệt tài nguyên flashrush-manual khỏi các môi trường lab khác.

### Điều kiện tiên quyết

Trước khi thực hiện, cần bảo đảm:

- Có tài khoản AWS và quyền truy cập Amazon SNS.
- Đã đăng nhập AWS Management Console.
- Chọn Region US East (N. Virginia) us-east-1.
- Có địa chỉ email hợp lệ để nhận thông báo.
- Đã hoàn thành các bước chuẩn bị của workshop FLASHRUSH.

Thông tin cấu hình sử dụng trong bài:

| Thành phần | Giá trị |
|---|---|
| AWS Region | us-east-1 |
| AWS Service | Amazon SNS |
| Topic type | Standard |
| Topic name | flashrush-manual-alerts |
| AWS Account ID | YOUR_AWS_ACCOUNT_ID |
| Subscription protocol | Email-JSON |
| Notification service | Amazon CloudWatch |

Khi thực hành, thay YOUR_AWS_ACCOUNT_ID bằng AWS Account ID thực tế.

### Quy trình triển khai

### 5.3.8.1 Truy cập Amazon SNS

**Bước 1.** Đăng nhập AWS Management Console tại https://console.aws.amazon.com/.

![Mở AWS Console](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-001.png)

*Hình 5.3.8.1. Mở AWS Console.*

**Bước 2.** Tại thanh tìm kiếm AWS, nhập từ khóa SNS hoặc Simple Notification Service.

![Tìm dịch vụ SNS](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-002.png)

*Hình 5.3.8.2. Tìm dịch vụ SNS.*

**Bước 3.** Chọn dịch vụ Simple Notification Service trong kết quả tìm kiếm.

**Bước 4.** Kiểm tra Region tại góc trên bên phải và bảo đảm đang sử dụng us-east-1.

**Bước 5.** Trong giao diện Amazon SNS, chọn Topics. Một số giao diện có thể hiển thị tên mục là Sections hoặc Rubriques.

![Trang Amazon SNS và menu Topics](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-003.png)

*Hình 5.3.8.3. Trang Amazon SNS và menu Topics.*

### 5.3.8.2 Tạo Amazon SNS Topic

**Bước 1.** Trong trang Amazon SNS, chọn Create topic. Trên một số giao diện, thao tác này được hiển thị là Create the section.

**Bước 2.** Tại phần Details, cấu hình:

| Thông số | Giá trị |
|---|---|
| Type / Kind | Standard |
| Name | flashrush-manual-alerts |
| Display name / Full name | Để trống |
| Maximum message size | 256 KiB |

![Chọn Standard và tên topic](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-004.png)

*Hình 5.3.8.4. Chọn Standard và tên topic.*

**Bước 3.** Giữ mặc định các phần cấu hình chưa cần sử dụng:

Encryption

Access policy / Access strategy

Delivery policy / Distribution strategy

Delivery status logging

Tags

Active tracing

Access Policy sẽ được cập nhật sau khi tạo Topic.

**Bước 4.** Chọn Create topic hoặc Create section để hoàn tất.

![Tạo SNS topic](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-005.png)

*Hình 5.3.8.5. Tạo SNS topic.*

**Bước 5.** Kiểm tra thông tin Topic vừa tạo.

Topic ARN có cấu trúc:

arn:aws:sns:us-east-1:YOUR_AWS_ACCOUNT_ID:flashrush-manual-alerts

Topic phải có loại Standard và tên chính xác là flashrush-manual-alerts.

![Thông tin topic flashrush-manual-alerts](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-006.png)

*Hình 5.3.8.6. Thông tin topic flashrush-manual-alerts.*

### 5.3.8.3 Cấu hình Access Policy cho Amazon CloudWatch

Amazon SNS sử dụng Access Policy để xác định những đối tượng được phép thực hiện các hành động trên Topic.

Trong hệ thống FLASHRUSH, cần cho phép Amazon CloudWatch gửi thông báo đến SNS Topic khi các CloudWatch Alarm liên quan đến hệ thống được kích hoạt.

**Bước 1.** Truy cập:

Amazon SNS → Topics / Sections → flashrush-manual-alerts.

**Bước 2.** Chọn Edit hoặc To modify.

![Mở Edit topic](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-007.png)

*Hình 5.3.8.7. Mở Edit topic.*

**Bước 3.** Mở phần Access policy / Access strategy.

![Mở Access policy](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-008.png)

*Hình 5.3.8.8. Mở Access policy.*

**Bước 4.** Chọn JSON editor và kiểm tra chính sách mặc định đang được áp dụng.

Không xóa các statement quản trị có sẵn.

**Bước 5.** Bổ sung statement cho CloudWatch vào mảng Statement:

```json
{
"Sid": "AllowCloudWatchFlashrushAlarmsPublish",
"Effect": "Allow",
"Principal": {
"Service": "cloudwatch.amazonaws.com"
},
"Action": "sns:Publish",
"Resource": "arn:aws:sns:us-east-1:YOUR_AWS_ACCOUNT_ID:flashrush-manual-alerts",
"Condition": {
"StringEquals": {
"aws:SourceAccount": "YOUR_AWS_ACCOUNT_ID"
},
"ArnLike": {
"aws:SourceArn": "arn:aws:cloudwatch:us-east-1:YOUR_AWS_ACCOUNT_ID:alarm:flashrush-manual-*"
}
}
}
```

Giải thích các thành phần:

| Thành phần | Ý nghĩa |
|---|---|
| Effect: Allow | Cho phép hành động được chỉ định |
| Principal | Xác định dịch vụ CloudWatch |
| Action: sns:Publish | Cho phép gửi thông báo vào SNS Topic |
| Resource | Xác định SNS Topic được cấp quyền |
| aws:SourceAccount | Giới hạn nguồn theo AWS Account ID |
| aws:SourceArn | Giới hạn quyền cho các CloudWatch Alarm có tên bắt đầu bằng flashrush-manual- |

Statement trên chỉ là một phần của policy. JSON hoàn chỉnh phải có Version và mảng Statement, đồng thời giữ lại các statement mặc định.

**Bước 6.** Chọn Save changes.

![Thêm quyền CloudWatch publish](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-009.png)

*Hình 5.3.8.9. Thêm quyền CloudWatch publish.*

**Bước 7.** Kiểm tra AWS Console hiển thị thông báo lưu cấu hình thành công.

Nếu xuất hiện lỗi InvalidParameter: Policy Error, cần kiểm tra cấu trúc JSON, dấu phẩy giữa các statement, ARN và các điều kiện đã cấu hình.

![Thông báo lưu topic policy](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-010.png)

*Hình 5.3.8.10. Thông báo lưu topic policy.*

### 5.3.8.4 Tạo Email Subscription

Mở topic flashrush-manual-alerts và kiểm tra tab Subscriptions. Nếu endpoint dự kiến đã có trạng thái Confirmed với protocol Email-JSON, dùng subscription hiện có và chuyển sang bước kiểm tra. Chỉ tạo mới khi chưa có endpoint.

**Bước 1.** Truy cập Topic flashrush-manual-alerts.

![Kiểm tra subscription hiện có](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-011.png)

*Hình 5.3.8.11. Kiểm tra subscription hiện có.*

**Bước 2.** Chọn tab Subscriptions.

**Bước 3.** Nhấn Create subscription hoặc Create a subscription.

![Mở Create subscription](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-012.png)

*Hình 5.3.8.12. Mở Create subscription.*

**Bước 4.** Nhập các thông tin:

| Thông số | Giá trị |
|---|---|
| Topic ARN | ARN của flashrush-manual-alerts |
| Protocol | Email-JSON |
| Endpoint | Địa chỉ email nhận cảnh báo |
|  |  |

![Nhập Email-JSON và endpoint](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-013.png)

*Hình 5.3.8.13. Nhập Email-JSON và endpoint.*

**Bước 5.** Giữ nguyên các tùy chọn khác và chọn Create subscription.

Sau khi tạo, subscription có thể hiển thị trạng thái Pending confirmation.

Đây là trạng thái chờ xác nhận từ người sở hữu địa chỉ email, không phải lỗi tạo subscription.

![Subscription chờ xác nhận](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-014.png)

*Hình 5.3.8.14. Subscription chờ xác nhận.*

### 5.3.8.5 Xác nhận đăng ký qua Gmail

Amazon SNS yêu cầu chủ sở hữu email xác nhận trước khi bắt đầu nhận thông báo.

**Bước 1.** Mở hộp thư Gmail đã sử dụng ở bước tạo subscription.

**Bước 2.** Tìm email có tiêu đề:

AWS Notification - Subscription Confirmation

Email thường được gửi từ:

AWS Notifications no-reply@sns.amazonaws.com

**Bước 3.** Mở email và tìm trường SubscribeURL hoặc nút Confirm subscription.

**Bước 4.** Nhấn vào liên kết xác nhận do AWS cung cấp.

**Bước 5.** Kiểm tra kết quả xác nhận.

**Bước 6.** Quay lại AWS Console, mở Topic và làm mới danh sách Subscriptions.

Kiểm tra dòng subscription của đúng topic hiển thị Status = Confirmed và Protocol = Email-JSON.

Lưu ý bảo mật: Không công khai đường dẫn SubscribeURL hoặc token xác nhận. Khi chụp ảnh hướng dẫn, phải che các giá trị token, chữ ký và thông tin cá nhân không cần thiết.

![Email xác nhận subscription, token và URL đã được che](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-015.png)

*Hình 5.3.8.15. Email xác nhận subscription, token và URL đã được che.*

![Subscription Confirmed và Email-JSON, địa chỉ nhận đã được che](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-016.png)

*Hình 5.3.8.16. Subscription Confirmed và Email-JSON, địa chỉ nhận đã được che.*

Subscription của flashrush-manual-alerts sau xác nhận. Ảnh hiển thị Confirmed và EMAIL-JSON.

### 5.3.8.6 Kiểm tra gửi thông báo thử nghiệm

Sau khi email subscription được xác nhận, thực hiện kiểm tra tính năng Publish của SNS.

**Bước 1.** Mở Topic flashrush-manual-alerts.

**Bước 2.** Chọn Publish message hoặc Publish the message.

![Mở Publish message](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-017.png)

*Hình 5.3.8.17. Mở Publish message.*

**Bước 3.** Nhập Subject:

TEST LAB - FLASHRUSH SNS

**Bước 4.** Nhập Message body:

TEST LAB - FLASHRUSH

This is a test notification from Amazon SNS.

Project: FLASHRUSH

Topic: flashrush-manual-alerts

Region: us-east-1

Status: SNS email notification test.

![Nhập nội dung TEST LAB](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-018.png)

*Hình 5.3.8.18. Nhập nội dung TEST LAB.*

**Bước 5.** Chọn Publish message.

![Gửi thông báo thử nghiệm](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-19.png)

*Hình 5.3.8.19. Gửi thông báo thử nghiệm.*

**Bước 6.** Kiểm tra thông báo kết quả trên AWS Console.

**Bước 7.** Mở hộp thư Gmail để xác minh email thử nghiệm đã được gửi đến.

Nếu email không xuất hiện trong Inbox, kiểm tra thêm mục Spam/Junk và trạng thái xác nhận subscription.

![SNS chấp nhận yêu cầu Publish](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-020.png)

*Hình 5.3.8.20. SNS chấp nhận yêu cầu Publish.*

![Email TEST LAB nhận được, thông tin nhạy cảm đã được che](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-021.png)

*Hình 5.3.8.21. Email TEST LAB nhận được, thông tin nhạy cảm đã được che.*

### Kiểm tra kết quả

Các tiêu chí nghiệm thu của phần thực hành:

| STT | Tiêu chí | Kết quả mong đợi |
|---|---|---|
| 1 | Tạo SNS Topic | Topic tồn tại với tên flashrush-manual-alerts |
| 2 | Topic type | Standard |
| 3 | Access Policy | Có statement cấp quyền sns:Publish cho CloudWatch |
| 4 | Tạo Email Subscription | Subscription sử dụng protocol Email-JSON |
| 5 | Xác nhận subscription | Không còn Pending confirmation |
| 6 | Publish message | AWS chấp nhận thông báo thử nghiệm |
| 7 | Kiểm tra Gmail | Nhận được email TEST LAB |

Kết quả thực hành: Topic Standard và thao tác lưu Access Policy đã được ghi nhận. Ảnh Subscriptions của flashrush-manual-alerts cho thấy Confirmed với protocol Email-JSON. Gmail đã nhận email TEST LAB từ lần Publish trực tiếp trên SNS. Kiểm thử đường CloudWatch Alarm → SNS → email còn chờ thực hiện theo kịch bản đã thống nhất.

### Các lỗi thường gặp

Lỗi 1 Không tìm thấy Amazon SNS

Nguyên nhân có thể do tìm từ khóa Topics trong thanh tìm kiếm dịch vụ AWS, hoặc giao diện Console sử dụng ngôn ngữ khác.

Cách xử lý: Tìm Simple Notification Service, sau đó chọn Topics, Sections hoặc Rubriques ở menu dịch vụ.

Lỗi 2 Không tìm thấy nút Edit

Giao diện có thể hiển thị To modify thay cho Edit.

Cách xử lý: Truy cập trang chi tiết Topic và tìm nút chỉnh sửa ở góc trên bên phải.

Lỗi 3 InvalidParameter: Policy Error

Nguyên nhân thường là JSON không hợp lệ hoặc policy thiếu cấu trúc bắt buộc.

Cách xử lý: Giữ nguyên policy mặc định và bổ sung statement CloudWatch vào mảng Statement, không thay toàn bộ policy bằng một statement đơn lẻ.

Lỗi 4 Subscription ở trạng thái Pending confirmation

Nguyên nhân là người nhận chưa xác nhận qua email.

Cách xử lý: Mở email từ AWS Notifications, truy cập SubscribeURL và làm mới AWS Console.

Lỗi 5 Publish thành công nhưng không nhận email

Cần kiểm tra trạng thái subscription, địa chỉ email, thư Spam/Junk và thông tin gửi thông báo. SNS chấp nhận yêu cầu Publish không đồng nghĩa email chắc chắn đã vào Inbox.

### Kết luận

Amazon SNS được sử dụng trong FLASHRUSH để cung cấp kênh gửi cảnh báo qua email.

Quá trình thực hành bao gồm tạo Standard Topic, thiết lập Access Policy cho CloudWatch, đăng ký Email Subscription, xác nhận địa chỉ nhận và kiểm tra gửi thông báo thử nghiệm.

Cơ chế này hỗ trợ công tác giám sát vận hành, cho phép hệ thống gửi thông báo khi CloudWatch Alarm phát hiện các điều kiện bất thường.

Tuy nhiên, thử nghiệm Publish trực tiếp từ SNS chỉ xác nhận đường gửi thông báo SNS đến email. Việc kiểm tra CloudWatch Alarm thực sự kích hoạt SNS sẽ được thực hiện trong phần tiếp theo.

### Tài liệu tham khảo

AWS Documentation Amazon SNS: https://docs.aws.amazon.com/sns/

AWS Documentation Sending Amazon SNS messages to an email address: https://docs.aws.amazon.com/sns/latest/dg/sns-email-notifications.html

AWS Documentation Amazon CloudWatch alarm notifications: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/US_SetupSNS.html

### Cognito mapping

Xác nhận email SNS alarm khác xác minh email Cognito. Xác nhận một loại không thay thế loại kia hoặc cấp role ứng dụng. [Mapping Cognito]({{< relref "/5-Workshop/5.7-Baseline-and-evidence/" >}})
