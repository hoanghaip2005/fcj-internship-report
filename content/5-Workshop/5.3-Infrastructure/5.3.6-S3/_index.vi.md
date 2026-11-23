---
title: "5.3.6 Amazon S3"
weight: 6
draft: false
---




**Mục tiêu:** Private bucket lưu trữ frontend.

> **Hình thức:** Tạo thủ công bằng **AWS Management Console**. Các thao tác dưới đây tạo hoặc cập nhật tài nguyên AWS thật và có thể phát sinh phí. Chỉ làm trên bộ `flashrush-manual-*`, không đụng tới `flashrush-lab` của CloudFormation. Ảnh thực hành được trình bày bên dưới; các điểm chưa đủ bằng chứng cần kiểm tra lại trên AWS.

**Điều kiện đầu vào:** Hoàn thành [5.2 Chuẩn bị]({{< relref "/5-Workshop/5.2-Prerequisite/" >}}) và các mục 5.3 đứng trước trang này. Region `us-east-1`; thay `YOUR_AWS_ACCOUNT_ID` bằng Account ID đúng của người thực hành.


**Bước 1.** S3 → Create bucket → General purpose.

![Mở Create bucket, chọn Region và General purpose](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-01.png)

*Hình 5.3.6.1. Mở Create bucket, chọn Region và General purpose.*

![Mở Create bucket, chọn Region và General purpose](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-02.png)

*Hình 5.3.6.2. Mở Create bucket, chọn Region và General purpose.*


**Bước 2.** Tên: `flashrush-manual-web-YOUR_AWS_ACCOUNT_ID-us-east-1`.


**Bước 3.** Region us-east-1. Tên bucket phải duy nhất; nếu đã tồn tại, xác minh owner trước khi dùng. Không chọn bucket không rõ nguồn gốc.

![Nhập tên bucket theo tài khoản và Region](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-03.png)

*Hình 5.3.6.3. Nhập tên bucket theo tài khoản và Region.*


**Bước 4.** Object Ownership: Bucket owner enforced, ACLs disabled.

![Giữ ACLs disabled và Bucket owner enforced](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-04.png)

*Hình 5.3.6.4. Giữ ACLs disabled và Bucket owner enforced.*


**Bước 5.** Giữ cả bốn **Block Public Access** bật.

![Bật Block all public access](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-05.png)

*Hình 5.3.6.5. Bật Block all public access.*


**Bước 6.** Default encryption: SSE-S3.

![Chọn SSE-S3; nút Create bucket nằm cuối form](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-06.png)

*Hình 5.3.6.6. Chọn SSE-S3; nút Create bucket nằm cuối form.*


**Bước 7.** Không bật Static website hosting; CloudFront sẽ đọc REST origin private.


**Bước 8.** Create bucket.

![Bucket đã tạo và Block all public access ở trạng thái On](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-07.png)

*Hình 5.3.6.7. Bucket đã tạo và Block all public access ở trạng thái On.*

AWS cho phép kết hợp S3 private và CloudFront OAC để phân phối website mà không mở bucket public. [Nguồn S3 và Block Public Access](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingBucket.html).

