---
title: "5.3.8 Amazon SNS"
weight: 8
draft: false
---




**Mục tiêu:** Topic và email subscription.

> **Hình thức:** Tạo thủ công bằng **AWS Management Console**. Các thao tác dưới đây tạo hoặc cập nhật tài nguyên AWS thật và có thể phát sinh phí. Chỉ làm trên bộ `flashrush-manual-*`, không đụng tới `flashrush-lab` của CloudFormation. Ảnh thực hành được trình bày bên dưới; các điểm chưa đủ bằng chứng cần kiểm tra lại trên AWS.

**Điều kiện đầu vào:** Hoàn thành [5.2 Chuẩn bị]({{< relref "/5-Workshop/5.2-Prerequisite/" >}}) và các mục 5.3 đứng trước trang này. Region `us-east-1`; thay `YOUR_AWS_ACCOUNT_ID` bằng Account ID đúng của người thực hành.

### 5.3.8.1 Tạo topic


**Bước 1.** Console → SNS → Topics → Create topic.

![Mở SNS trong Region thực hành](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-01.png)

*Hình 5.3.8.1. Mở SNS trong Region thực hành.*

![Mở SNS trong Region thực hành](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-02.png)

*Hình 5.3.8.2. Mở SNS trong Region thực hành.*

![Mở SNS trong Region thực hành](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-03.png)

*Hình 5.3.8.3. Mở SNS trong Region thực hành.*


**Bước 2.** Type: Standard.


**Bước 3.** Name: `flashrush-manual-alerts`.

![Chọn Standard và đặt tên topic](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-04.png)

*Hình 5.3.8.4. Chọn Standard và đặt tên topic.*


**Bước 4.** Tạo topic và ghi ARN.

![Tạo topic và kiểm tra thông tin](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-05.png)

*Hình 5.3.8.5. Tạo topic và kiểm tra thông tin.*

![Tạo topic và kiểm tra thông tin](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-06.png)

*Hình 5.3.8.6. Tạo topic và kiểm tra thông tin.*

### 5.3.8.2 Cho phép CloudWatch publish có giới hạn

Topic → Edit → Access policy. Giữ các statement quản trị cần thiết đang có, bổ sung statement sau vào mảng Statement, không dán thành policy JSON độc lập thiếu Version/Statement:

![Chỉnh access policy cho CloudWatch publish](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-07.png)

*Hình 5.3.8.7. Chỉnh access policy cho CloudWatch publish.*

![Chỉnh access policy cho CloudWatch publish](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-08.png)

*Hình 5.3.8.8. Chỉnh access policy cho CloudWatch publish.*

![Chỉnh access policy cho CloudWatch publish](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-09.png)

*Hình 5.3.8.9. Chỉnh access policy cho CloudWatch publish.*

![Chỉnh access policy cho CloudWatch publish](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-10.png)

*Hình 5.3.8.10. Chỉnh access policy cho CloudWatch publish.*

```json
{
  "Effect": "Allow",
  "Principal": {"Service": "cloudwatch.amazonaws.com"},
  "Action": "sns:Publish",
  "Resource": "arn:aws:sns:us-east-1:YOUR_AWS_ACCOUNT_ID:flashrush-manual-alerts",
  "Condition": {
    "StringEquals": {"aws:SourceAccount": "YOUR_AWS_ACCOUNT_ID"},
    "ArnLike": {"aws:SourceArn": "arn:aws:cloudwatch:us-east-1:YOUR_AWS_ACCOUNT_ID:alarm:flashrush-manual-*"}
  }
}
```

### 5.3.8.3 Đăng ký và xác nhận email


**Bước 1.** Topic → Create subscription.

![Chọn topic và mở Create subscription](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-11.png)

*Hình 5.3.8.11. Chọn topic và mở Create subscription.*

![Chọn topic và mở Create subscription](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-12.png)

*Hình 5.3.8.12. Chọn topic và mở Create subscription.*


**Bước 2.** Protocol: Email. Endpoint: email người nhận cảnh báo do bạn chọn.


**Bước 3.** Create subscription.

![Tạo email subscription; trạng thái ban đầu pending](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-13.png)

*Hình 5.3.8.13. Tạo email subscription; trạng thái ban đầu pending.*

![Tạo email subscription; trạng thái ban đầu pending](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-14.png)

*Hình 5.3.8.14. Tạo email subscription; trạng thái ban đầu pending.*


**Bước 4.** Mở email AWS Notifications, bấm Confirm subscription.

![Email yêu cầu xác nhận subscription](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-15.png)

*Hình 5.3.8.15. Email yêu cầu xác nhận subscription.*


**Bước 5.** Refresh Console; status không còn Pending confirmation và có subscription ARN.

![Subscription đã Confirmed](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-16.png)

*Hình 5.3.8.16. Subscription đã Confirmed.*


**Bước 6.** Topic → Publish message, gửi một thông báo ghi rõ TEST LAB, tự kiểm tra thư đến và spam.

![Gửi thông báo thử trực tiếp SNS và kiểm tra email nhận được](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-17.png)

*Hình 5.3.8.17. Gửi thông báo thử trực tiếp SNS và kiểm tra email nhận được.*

![Gửi thông báo thử trực tiếp SNS và kiểm tra email nhận được](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-18.png)

*Hình 5.3.8.18. Gửi thông báo thử trực tiếp SNS và kiểm tra email nhận được.*

![Gửi thông báo thử trực tiếp SNS và kiểm tra email nhận được](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-19.png)

*Hình 5.3.8.19. Gửi thông báo thử trực tiếp SNS và kiểm tra email nhận được.*

![Gửi thông báo thử trực tiếp SNS và kiểm tra email nhận được](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-20.png)

*Hình 5.3.8.20. Gửi thông báo thử trực tiếp SNS và kiểm tra email nhận được.*

![Gửi thông báo thử trực tiếp SNS và kiểm tra email nhận được](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-21.png)

*Hình 5.3.8.21. Gửi thông báo thử trực tiếp SNS và kiểm tra email nhận được.*

Việc xác nhận subscription là bước riêng cần người nhận thực hiện; tạo topic/subscription thành công chưa chứng minh email đã tới inbox. [Nguồn xác nhận email SNS](https://docs.aws.amazon.com/sns/latest/dg/sns-email-notifications.html).

