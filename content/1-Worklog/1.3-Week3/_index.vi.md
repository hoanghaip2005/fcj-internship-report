---
title: "Worklog Tuần 3"
weight: 3
chapter: false
pre: "<b>1.3. </b> "
---

## Tuần 3: EC2, S3 và kiến trúc ứng dụng

**Thời gian:** 05/10/2026–10/10/2026.

### Mục tiêu

Hiểu vòng đời EC2, EBS và instance profile; phân biệt S3 origin, CloudFront và OAC; kiểm tra versioning trên dữ liệu thực hành riêng.

### Nội dung công việc

| Ngày | Công việc và nội dung ghi nhận |
|---|---|
| 05/10/2026 | Tìm hiểu EC2 instance type, AMI và vòng đời instance; phân biệt stop, start, reboot với terminate.<br>Đọc hướng dẫn chuẩn bị EC2, key pair và Security Group; ghi chú cách chọn cấu hình phù hợp và kiểm soát chi phí. |
| 06/10/2026 | Nghiên cứu Amazon EBS, volume và snapshot; tìm hiểu quy trình kết nối SSH và giới hạn địa chỉ IP được phép truy cập.<br>Tổng hợp cách nhận diện lỗi kết nối do định tuyến, Security Group hoặc key pair; lập danh sách kiểm tra khi làm lab. |
| 07/10/2026 | Tham khảo Instance Profiling with IAM Roles for EC2; tìm hiểu instance profile và quyền để ứng dụng trên EC2 truy cập S3.<br>Phân tích luồng cấp thông tin xác thực tạm thời; phác thảo kiểm tra quyền đọc/ghi đối tượng theo nguyên tắc quyền tối thiểu. |
| 08/10/2026 | Nghiên cứu Static Website Hosting with Amazon S3: bucket, object, quyền truy cập, versioning và mã hóa dữ liệu.<br>Lập đề cương bài viết về S3 Express One Zone; so sánh với S3 Standard về phạm vi AZ, độ trễ và loại workload phù hợp.<br>Tham gia AWS for Software & Financial Services Companies Day; tổng hợp nội dung vận hành Agentic AI, dữ liệu chất lượng và AWS Transform. |
| 09/10/2026 | Tìm hiểu CloudFront distribution, origin và cache; phân biệt S3 website endpoint với REST origin, ghi chú OAC khi bảo vệ S3 origin.<br>Bổ sung ý tưởng sơ đồ cho blog lưu trữ; mô tả luồng dữ liệu giữa tài nguyên tính toán, S3 Express One Zone và S3 Standard. |
| 10/10/2026 | Không bố trí buổi thực tập theo kế hoạch. |

### Nội dung chi tiết và hình ảnh

#### 1. Hai phiên bản của object S3

Ghi hai nội dung khác nhau vào cùng object, đọc lại đúng phiên bản đầu và phiên bản hiện tại.

![Hai phiên bản của object S3](/images/1-Worklog/aws-practice/week03-s3.png)

*Ảnh Console bổ sung theo chủ đề tuần; không dùng để xác nhận ngày thực hiện của nhật ký gốc.*

#### 2. Versioning và thuộc tính bucket

Kiểm tra versioning Enabled và mã hóa SSE-S3 của bucket thực hành riêng.

![Versioning và thuộc tính bucket](/images/1-Worklog/aws-practice/s3-properties.png)

#### 3. Chặn truy cập công khai vào S3

Đối chiếu Block Public Access và Object Ownership để hiểu cách giữ dữ liệu riêng tư.

![Chặn truy cập công khai vào S3](/images/1-Worklog/aws-practice/s3-permissions.png)

### Kết quả

Đã tổng hợp EC2/S3/CloudFront; bài thực hành bổ sung kiểm chứng đọc lại hai phiên bản object S3.

### Bài học và điểm cần tiếp tục

Versioning giữ các phiên bản object, nhưng không tự thay thế chiến lược backup. Tách bucket thực hành khỏi bucket ứng dụng, kiểm tra quyền đọc và chi phí lưu từng phiên bản.

### Kế hoạch tiếp theo

Tiếp tục với [Cơ sở dữ liệu, container và đề cương blog](../1.4-week4/).

### Tài liệu liên quan

- [Blog S3 Express One Zone]({{< relref "/3-BlogsPosted/3.2-Blog2/" >}})
- [AWS for Software & Financial Services Companies Day]({{< relref "/4-EventParticipated/4.3-Event3/" >}})
