---
title: "Worklog Tuần 3"
date: 2026-09-21
weight: 3
chapter: false
pre: " <b> 1.3. </b> "
---

# Tuần 3: EC2, S3 và kiến trúc ứng dụng

**Thời gian:** 05/10/2026–10/10/2026.

### Mục tiêu

EC2, S3 và kiến trúc ứng dụng.

### Nội dung công việc

| Ngày | Công việc và nội dung ghi nhận |
|---|---|
| 05/10/2026 | Tìm hiểu EC2 instance type, AMI và vòng đời instance; phân biệt stop, start, reboot với terminate.<br>Đọc hướng dẫn chuẩn bị EC2, key pair và Security Group; ghi chú cách chọn cấu hình phù hợp và kiểm soát chi phí. |
| 06/10/2026 | Nghiên cứu Amazon EBS, volume và snapshot; tìm hiểu quy trình kết nối SSH và giới hạn địa chỉ IP được phép truy cập.<br>Tổng hợp cách nhận diện lỗi kết nối do định tuyến, Security Group hoặc key pair; lập danh sách kiểm tra khi làm lab. |
| 07/10/2026 | Tham khảo Instance Profiling with IAM Roles for EC2; tìm hiểu instance profile và quyền để ứng dụng trên EC2 truy cập S3.<br>Phân tích luồng cấp thông tin xác thực tạm thời; phác thảo kiểm tra quyền đọc/ghi đối tượng theo nguyên tắc quyền tối thiểu. |
| 08/10/2026 | Nghiên cứu Static Website Hosting with Amazon S3: bucket, object, quyền truy cập, versioning và mã hóa dữ liệu.<br>Lập đề cương bài viết về S3 Express One Zone; so sánh với S3 Standard về phạm vi AZ, độ trễ và loại workload phù hợp.<br>Tham gia AWS for Software & Financial Services Companies Day; tổng hợp nội dung vận hành Agentic AI, dữ liệu chất lượng và AWS Transform. |
| 09/10/2026 | Tìm hiểu CloudFront distribution, origin và cache; phân biệt S3 website endpoint với REST origin, ghi chú OAC khi bảo vệ S3 origin.<br>Bổ sung ý tưởng sơ đồ cho blog lưu trữ; mô tả luồng dữ liệu giữa tài nguyên tính toán, S3 Express One Zone và S3 Standard. |
| 10/10/2026 | Không bố trí buổi thực tập theo kế hoạch. |

### Kết quả tổng hợp

Đã tổng hợp EC2, instance profile, S3 và CloudFront; xây dựng đề cương lưu trữ, liên hệ với các chủ đề Agentic AI và dữ liệu của sự kiện.

### Bài viết và hoạt động liên quan

- [Event 3 AWS for Software & Financial Services Companies Day](/vi/4-eventparticipated/4.3-event3/)
- [Blog 2 S3 Express One Zone](/vi/3-blogsposted/3.2-blog2/)

Các mục nghiên cứu, phác thảo và đề xuất phản ánh mức độ ghi nhận trong nhật ký; không đồng nghĩa đã triển khai hoặc hoàn thành toàn bộ bài lab.
