---
title: "Worklog Tuần 4"
weight: 4
chapter: false
pre: "<b>1.4. </b> "
---

## Tuần 4: Cơ sở dữ liệu, container và đề cương blog

**Thời gian:** 12/10/2026–17/10/2026.

### Mục tiêu

So sánh RDS, DynamoDB và ElastiCache; hiểu khóa dữ liệu, cập nhật có điều kiện và các kiến thức nền tảng về container, DNS.

### Nội dung công việc

| Ngày | Công việc và nội dung ghi nhận |
|---|---|
| 12/10/2026 | Tham khảo Database Essentials with Amazon RDS; tìm hiểu DB instance, kết nối từ ứng dụng, backup và phục hồi.<br>Phân biệt Multi-AZ phục vụ độ sẵn sàng với Read Replica phục vụ mở rộng đọc; ghi chú kiểm soát truy cập cơ sở dữ liệu. |
| 13/10/2026 | Tìm hiểu DynamoDB table, partition key, sort key và mô hình truy cập; so sánh cơ sở dữ liệu NoSQL với RDS.<br>Phác thảo dữ liệu cho ứng dụng web đơn giản; ghi chú cách lựa chọn khóa và tránh phân bố tải không đồng đều. |
| 14/10/2026 | Nghiên cứu In-Memory Caching with Amazon ElastiCache; tìm hiểu cache-aside, TTL, cache hit và cache miss.<br>Phân tích cách cache giảm tải cơ sở dữ liệu, các tình huống dữ liệu cũ và yêu cầu cập nhật khi dữ liệu nguồn thay đổi. |
| 15/10/2026 | Tìm hiểu Amazon Lightsail, Lightsail Containers và vai trò image, container, cổng dịch vụ trong triển khai ứng dụng.<br>Lập đề cương blog về Karpenter trên EKS: pod chờ, lựa chọn EC2 node, consolidation; ghi lại phần cần nghiên cứu sâu sau giai đoạn nền tảng. |
| 16/10/2026 | Tìm hiểu Amazon Route 53, hosted zone, bản ghi DNS và cách trỏ tên miền đến ứng dụng; tổng hợp quan hệ giữa DNS, máy chủ và dữ liệu.<br>Rà soát ba chủ đề blog hiện tại: Karpenter/EKS, S3 Express One Zone và Amazon Cognito; bổ sung câu hỏi cần nghiên cứu. |
| 17/10/2026 | Không bố trí buổi thực tập theo kế hoạch. |

### Nội dung chi tiết và hình ảnh

#### 1. Cấu hình bảng DynamoDB thực hành

Bảng fcj-worklog-practice dùng partition key id kiểu String và capacity On-demand.

![Cấu hình bảng DynamoDB thực hành](/images/1-Worklog/aws-practice/week04-dynamodb.png)

*Ảnh Console bổ sung theo chủ đề tuần; không dùng để xác nhận ngày thực hiện của nhật ký gốc.*

#### 2. Kết quả cập nhật tồn kho có điều kiện

Stock ban đầu 2 giảm còn 1. Yêu cầu giảm tiếp 2 bị ConditionalCheckFailedException; đọc nhất quán xác nhận stock vẫn là 1.

![Kết quả cập nhật tồn kho có điều kiện](/images/1-Worklog/aws-practice/week04-dynamodb-items.png)

#### 3. Liên hệ chủ đề container với Karpenter

Sơ đồ từ bài blog dùng để giải thích cách mở rộng node theo nhu cầu Pod; chưa xác nhận triển khai EKS.

![Liên hệ chủ đề container với Karpenter](/images/3-BlogsPosted/blog2-karpenter-eks.png)

*Sơ đồ minh họa kiến thức, không phải ảnh kết quả triển khai.*

### Kết quả

Đã phân biệt cơ sở dữ liệu và cache; kiểm chứng cập nhật có điều kiện DynamoDB trên dữ liệu riêng.

### Bài học và điểm cần tiếp tục

Đọc rồi ghi riêng lẻ vẫn có thể tạo race condition; điều kiện phải nằm trong thao tác ghi. Bài thử một item chưa chứng minh transaction nhiều bảng hoặc kiểm thử tải.

### Kế hoạch tiếp theo

Tiếp tục với [Phân tích DropIt và đề xuất kiến trúc FitJoy](../1.5-week5/).

### Tài liệu liên quan

- [Blog Karpenter/EKS]({{< relref "/3-BlogsPosted/3.1-Blog1/" >}})
- [Điều kiện ghi DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html)
