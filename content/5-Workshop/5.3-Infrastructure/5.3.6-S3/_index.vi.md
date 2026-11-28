---
title: "5.3.6 Amazon S3"
weight: 6
draft: false
---

Mục tiêu: Tạo bucket S3 để lưu frontend theo cấu hình private; kiểm tra loại bucket, tên, Object Ownership, Block Public Access và lựa chọn mã hóa SSE-S3.

Điều kiện: Hoàn thành [5.2 Chuẩn bị]({{< relref "/5-Workshop/5.2-Prerequisite/" >}}) và các mục 5.3 đứng trước. Biết Account ID của tài khoản đang thực hành để đặt tên bucket.

Cách đọc: Khung xanh chỉ nút, lựa chọn hoặc giá trị cần kiểm tra. Vòng tròn xanh, số trắng dùng bước toàn cục 1–7. Mỗi hình walkthrough nằm trên một trang ngang.

Giá trị cấu hình cần dùng

Region: us-east-1. Bucket type: General purpose. Namespace đang chọn trong ảnh: Global namespace.

Tên bucket: flashrush-manual-web-YOUR_AWS_ACCOUNT_ID-us-east-1. Thay YOUR_AWS_ACCOUNT_ID bằng Account ID của bạn. Nếu tên đã tồn tại, xác minh owner trước khi dùng.

Object Ownership: Bucket owner enforced; ACLs disabled. Block all public access: bật, cả bốn tùy chọn con có dấu tích.

Default encryption: Server-side encryption with Amazon S3 managed keys (SSE-S3).

Cấu hình cần giữ cho luồng CloudFront: Static website hosting = Disabled; dùng S3 REST origin với OAC ở mục 5.3.7.

### 5.3.6.1 Mở màn hình tạo bucket

**Bước 1.** Mở Amazon S3 tại us-east-1 → nhấn Create bucket.

![Nút Create bucket trên trang Amazon S3](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-01.png)

*Hình 5.3.6.1. Nút Create bucket trên trang Amazon S3.*

### 5.3.6.1 Chọn region và loại bucket

**Bước 2.** Kiểm tra AWS Region = US East (N. Virginia) us-east-1 → chọn Bucket type = General purpose.

![Region us-east-1 và lựa chọn General purpose](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-02.png)

*Hình 5.3.6.2. Region us-east-1 và lựa chọn General purpose.*

### 5.3.6.1 Đặt tên bucket

**Bước 3.** Giữ Global namespace → nhập flashrush-manual-web-YOUR_AWS_ACCOUNT_ID-us-east-1. Thay YOUR_AWS_ACCOUNT_ID bằng Account ID của bạn; ảnh dùng ID của tài khoản chụp.

![Global namespace và ô tên bucket đầy đủ](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-03.png)

*Hình 5.3.6.3. Global namespace và ô tên bucket đầy đủ.*

### 5.3.6.1 Giữ ACLs disabled

**Bước 4.** Tại Object Ownership → giữ ACLs disabled (recommended) → kiểm tra giá trị Bucket owner enforced.

![ACLs disabled và Object Ownership = Bucket owner enforced](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-04.png)

*Hình 5.3.6.4. ACLs disabled và Object Ownership = Bucket owner enforced.*

### 5.3.6.1 Chặn truy cập công khai

**Bước 5.** Giữ Block all public access được chọn → kiểm tra cả bốn tùy chọn con đều có dấu tích.

![Block all public access và bốn tùy chọn con trước khi tạo bucket](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-05.png)

*Hình 5.3.6.5. Block all public access và bốn tùy chọn con trước khi tạo bucket.*

### 5.3.6.1 Chọn mã hóa và tạo bucket

**Bước 6.** Tại Default encryption → giữ Server-side encryption with Amazon S3 managed keys (SSE-S3). Rà soát cấu hình ở các bước trước → nhấn Create bucket.

![Lựa chọn SSE-S3 và nút Create bucket](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-06.png)

*Hình 5.3.6.6. Lựa chọn SSE-S3 và nút Create bucket.*

### 5.3.6.2 Kiểm tra bucket sau khi tạo

**Bước 7.** Mở bucket vừa tạo → Permissions → kiểm tra đúng tên bucket và Block all public access = On. Ảnh đang thu gọn Individual Block Public Access settings.

![Bucket đã tồn tại; tab Permissions hiển thị Block all public access = On](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-07.png)

*Hình 5.3.6.7. Bucket đã tồn tại; tab Permissions hiển thị Block all public access = On.*

### Cognito mapping

Giữ bucket website private sau CloudFront OAC. Login Cognito không cần public S3, Identity Pool hay AWS credentials trên browser. Không upload .env hoặc session artifacts. [Mapping Cognito]({{< relref "/5-Workshop/5.7-Baseline-and-evidence/" >}})
