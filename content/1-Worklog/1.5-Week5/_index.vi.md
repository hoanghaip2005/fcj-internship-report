---
title: "Worklog Tuần 5"
date: 2026-09-21
weight: 5
chapter: false
pre: " <b> 1.5. </b> "
---

# Tuần 5: Phân tích DropIt và đề xuất kiến trúc FitJoy

**Thời gian:** 19/10/2026–24/10/2026.

### Mục tiêu

Phân tích DropIt và đề xuất kiến trúc FitJoy.

### Nội dung công việc

| Ngày | Công việc và nội dung ghi nhận |
|---|---|
| 19/10/2026 | Tìm hiểu EC2 Auto Scaling và khả năng mở rộng ứng dụng; dùng DropIt làm tình huống phân tích backend Node.js, Socket.IO và PostgreSQL.<br>Phác thảo phương án chạy DropIt trên Lightsail; xem xét tải phiên học đồng thời, kết nối WebSocket và giới hạn của kiến trúc một máy. |
| 20/10/2026 | Phân tích xác thực DropIt bằng Amazon Cognito: access token, kiểm tra chữ ký JWKS và phân quyền truy cập nhóm học ở backend.<br>Đối chiếu với kiến thức IAM và đề cương blog Cognito; ghi chú tách quyền triển khai, quyền ứng dụng và bảo vệ thông tin xác thực. |
| 21/10/2026 | Tìm hiểu CloudWatch metrics, logs và alarm; xây dựng danh sách chỉ số cần giám sát cho DropIt: CPU, RAM, lỗi API và kết nối WebSocket.<br>Nghiên cứu tích hợp SNS gửi thông báo; phác thảo phương án sao lưu PostgreSQL và uploads, kiểm tra phục hồi và kiểm soát chi phí AWS. |
| 22/10/2026 | Khảo sát FitJoy, ứng dụng React/Vite về sức khỏe và tập luyện; phân tích nhu cầu phân phối giao diện, đăng nhập và đồng bộ tiến độ.<br>Đề xuất kiến trúc AWS cho FitJoy: S3/CloudFront phục vụ web, Cognito xác thực, API Gateway/Lambda và DynamoDB lưu tiến độ; chưa triển khai. |
| 23/10/2026 | So sánh phương án Lightsail của DropIt với phương án Serverless đề xuất cho FitJoy về vận hành, mở rộng, bảo mật và chi phí.<br>Tổng hợp kiến thức tuần 5; liên hệ hai dự án với đề cương blog Cognito, Serverless và workshop S3 VPC Endpoint; cập nhật nhật ký, sơ đồ và câu hỏi kỹ thuật. |
| 24/10/2026 | Không bố trí buổi thực tập theo kế hoạch. |

### Kết quả tổng hợp

Đã liên hệ kiến thức AWS với DropIt; hình thành phương án AWS đề xuất cho FitJoy và các tiêu chí về bảo mật, mở rộng, giám sát và chi phí.

### Bài viết và hoạt động liên quan

- [Blog 3 Amazon Cognito](/vi/3-blogsposted/3.3-blog3/)

Các mục nghiên cứu, phác thảo và đề xuất phản ánh mức độ ghi nhận trong nhật ký; không đồng nghĩa đã triển khai hoặc hoàn thành toàn bộ bài lab.
