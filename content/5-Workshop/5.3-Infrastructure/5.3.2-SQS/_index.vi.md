---
title: "5.3.2 Amazon SQS"
weight: 2
draft: false
---

**Mục tiêu:** Standard Queue, DLQ, redrive policy.

> **Hình thức:** Tạo thủ công bằng **AWS Management Console**. Các thao tác dưới đây tạo hoặc cập nhật tài nguyên AWS thật và có thể phát sinh phí. Chỉ làm trên bộ `flashrush-manual-*`, không đụng tới `flashrush-lab` của CloudFormation. Ảnh thực hành được trình bày bên dưới; các điểm chưa đủ bằng chứng cần kiểm tra lại trên AWS.

**Điều kiện đầu vào:** Hoàn thành [5.2 Chuẩn bị]({{< relref "/5-Workshop/5.2-Prerequisite/" >}}) và các mục 5.3 đứng trước trang này. Region `us-east-1`; thay `YOUR_AWS_ACCOUNT_ID` bằng Account ID đúng của người thực hành.

### 5.3.2.1 Tạo DLQ trước

**Bước 1.** Console → SQS → Create queue.

![Mở Create queue](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-01.png)

*Hình 5.3.2.1. Mở Create queue.*

**Bước 2.** Type: **Standard**; tên `flashrush-manual-dlq`.

![Chọn Standard và tên DLQ](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-02.png)

*Hình 5.3.2.2. Chọn Standard và tên DLQ.*

**Bước 3.** Message retention: **14 days**, tức 1.209.600 giây.

![Thiết lập thời gian lưu message DLQ](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-03.png)

*Hình 5.3.2.3. Thiết lập thời gian lưu message DLQ.*

**Bước 4.** Encryption: SQS managed keys, SSE-SQS.

![Chọn mã hóa SSE-SQS](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-04.png)

*Hình 5.3.2.4. Chọn mã hóa SSE-SQS.*

**Bước 5.** Access policy giữ riêng tư cho tài khoản; không mở Principal public.

![Kiểm tra access policy riêng tư](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-05.png)

*Hình 5.3.2.5. Kiểm tra access policy riêng tư.*

**Bước 6.** Create queue, sao chép ARN và URL.

![Tạo DLQ và xem thông tin queue](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-06.png)

*Hình 5.3.2.6. Tạo DLQ và xem thông tin queue.*

![Tạo DLQ và xem thông tin queue](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-07.png)

*Hình 5.3.2.7. Tạo DLQ và xem thông tin queue.*

### 5.3.2.2 Tạo queue chính

**Bước 1.** Create queue → Standard → tên `flashrush-manual-orders`.

![Đặt tên main queue](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-08.png)

*Hình 5.3.2.8. Đặt tên main queue.*

**Bước 2.** Visibility timeout: **90 seconds**.

**Bước 3.** Message retention: **4 days**, tức 345.600 giây.

**Bước 4.** Receive message wait time: **20 seconds**.

![Receive message wait time 20 giây, visibility timeout 90 giây và retention 4 ngày](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/update-001.png)

*Receive message wait time 20 giây, visibility timeout 90 giây và retention 4 ngày.*

![Cấu hình DLQ và maxReceiveCount 5; kiểm tra lại sau Save](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/update-002.png)

*Cấu hình DLQ và maxReceiveCount 5; kiểm tra lại sau Save.*

**Bước 5.** Delivery delay: 0.

![Thiết lập visibility timeout, retention và long polling](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-09.png)

*Hình 5.3.2.9. Thiết lập visibility timeout, retention và long polling.*

**Bước 6.** Encryption: SSE-SQS.

![Mã hóa main queue](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-10.png)

*Hình 5.3.2.10. Mã hóa main queue.*

**Bước 7.** Bật Dead-letter queue, chọn DLQ vừa tạo, Maximum receives: **5**.

![Chọn DLQ và maximum receives](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-11.png)

*Hình 5.3.2.11. Chọn DLQ và maximum receives.*

**Bước 8.** Tạo queue. Ghi lại Queue URL và ARN.

![Tạo main queue và kiểm tra DLQ đã bật](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-12.png)

*Hình 5.3.2.12. Tạo main queue và kiểm tra DLQ đã bật.*

![Tạo main queue và kiểm tra DLQ đã bật](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-13.png)

*Hình 5.3.2.13. Tạo main queue và kiểm tra DLQ đã bật.*

**Bước 9.** Vào DLQ → Edit → Redrive allow policy → By queue, chỉ cho queue chính vừa tạo dùng DLQ.

![Giới hạn redrive allow policy theo main queue](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-14.png)

*Hình 5.3.2.14. Giới hạn redrive allow policy theo main queue.*

![Giới hạn redrive allow policy theo main queue](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-15.png)

*Hình 5.3.2.15. Giới hạn redrive allow policy theo main queue.*

![Giới hạn redrive allow policy theo main queue](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-16.png)

*Hình 5.3.2.16. Giới hạn redrive allow policy theo main queue.*

Visibility timeout 90 giây tương ứng 6 × timeout Worker 15 giây; nếu tăng timeout hoặc batching window phải tính lại. Đây là khuyến nghị cấu hình tích hợp Lambda/SQS của AWS. [Nguồn cấu hình event source mapping](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-configure.html).

Standard queue có thể giao message nhiều lần. Chống trùng nằm trong logic Worker và điều kiện transaction; không được suy luận "một message chỉ chạy một lần" từ queue.

**Điểm kiểm tra:** queue chính trỏ đúng DLQ, maxReceiveCount=5. Không bấm Send message với chuỗi tùy ý vào queue đang dùng để demo đơn; Worker cần payload hợp lệ và order đã được API tạo.

### Cognito mapping

Không đưa access/refresh token vào message. Worker dùng execution role và tham chiếu đơn/khách đã lưu; không gắn JWT authorizer trình duyệt vào SQS. [Mapping Cognito]({{< relref "/5-Workshop/5.7-Baseline-and-evidence/" >}})
