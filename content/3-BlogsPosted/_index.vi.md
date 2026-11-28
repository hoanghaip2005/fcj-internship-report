---
title: "Các bài blogs đã đăng"
weight: 3
chapter: false
pre: " <b> 3. </b> "
---

Dưới đây là năm bài viết kỹ thuật đã đăng tải và chia sẻ trên cộng đồng [AWS Study Group](https://www.facebook.com/groups/awsstudygroupfcj), kèm ảnh minh chứng ở cuối từng bài.

### 3.1. [Blog 1 Tự động mở rộng hạ tầng Kubernetes trên AWS với Karpenter và Amazon EKS](3.1-Blog1/)
Cách Karpenter tạo đúng loại EC2 node cho các pod đang chờ theo ràng buộc tài nguyên và khả năng cung ứng, tự dọn dẹp node dư thừa để giảm chi phí, và những điểm cần chú ý khi triển khai trên Amazon EKS.

### 3.2. [Blog 2 Lưu trữ tốc độ cao trên AWS với Amazon S3 Express One Zone](3.2-Blog2/)
Tìm hiểu lớp lưu trữ hiệu năng cao của S3: Độ trễ single-digit millisecond nhờ co-location cùng AZ, Directory Bucket với namespace phân cấp, và mô hình Two-Tier Storage kết hợp S3 Express One Zone (hot tier) + S3 Standard (dữ liệu nguồn và kết quả) cho AI/ML và real-time analytics.

### 3.3. [Blog 3 Xác thực và phân quyền ứng dụng trên AWS với Amazon Cognito](3.3-Blog3/)
Tìm hiểu mô hình kết hợp các dịch vụ Serverless trên AWS để xây dựng hệ thống định danh toàn diện: Cognito User Pool quản lý người dùng, Identity Pool cấp quyền tạm thời qua STS, API Gateway tự động xác thực token và Amazon S3 cho phép upload file trực tiếp an toàn.


Phân tích hàng đợi, visibility timeout, batch, thử lại, DLQ và giới hạn concurrency trong luồng đặt hàng FLASHRUSH.

Tìm hiểu idempotency key, conditional write, transaction, TTL và khoảng lỗi giữa DynamoDB với SQS; liên hệ cơ chế thử lại của giao diện.
