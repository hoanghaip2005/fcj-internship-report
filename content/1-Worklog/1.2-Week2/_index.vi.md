---
title: "Worklog Tuần 2"
weight: 2
chapter: false
pre: "<b>1.2. </b> "
---

## Tuần 2: IAM, VPC và hoạt động cộng đồng

**Thời gian:** 28/09/2026–03/10/2026.

### Mục tiêu

Phân biệt IAM User, Group, Role và Policy; giải thích subnet, định tuyến và kiểm soát lưu lượng VPC; tổng hợp hoạt động cộng đồng.

### Nội dung công việc

| Ngày | Công việc và nội dung ghi nhận |
|---|---|
| 28/09/2026 | Tìm hiểu IAM User, Group, Role và Policy; phân biệt xác thực với phân quyền, nhận diện các trường Effect, Action, Resource trong chính sách.<br>Phân tích ví dụ cấp quyền theo nhóm; ghi chú nguyên tắc quyền tối thiểu và rủi ro của quyền truy cập quá rộng. |
| 29/09/2026 | Nghiên cứu IAM Role và thông tin xác thực tạm thời; so sánh với việc lưu access key dài hạn trong ứng dụng.<br>Phác thảo nhóm kiến thức bảo mật cho bài viết về Amazon Cognito: người dùng, token và quyền gọi dịch vụ; lập câu hỏi cần nghiên cứu thêm.<br>Ghi nhận AWS Cloud and AI Day Hanoi; tổng hợp các chủ đề AI Agent, dữ liệu, phát triển ứng dụng và migration. |
| 30/09/2026 | Tham khảo Networking Essentials with Amazon VPC; tìm hiểu CIDR, public/private subnet, Route Table và Internet Gateway.<br>Vẽ sơ đồ VPC cơ bản, mô tả đường đi của request từ Internet đến máy chủ trong public subnet. |
| 01/10/2026 | Tìm hiểu NAT Gateway, Security Group và Network ACL; so sánh kiểm soát lưu lượng ở mức tài nguyên với mức subnet.<br>Phân tích cách private subnet truy cập dịch vụ bên ngoài; ghi chú chi phí NAT và hạn chế của việc mở cổng quá rộng. |
| 02/10/2026 | Đọc Networking on AWS Workshop; hệ thống hóa các bước chuẩn bị mạng, định tuyến và kiểm tra kết nối.<br>Khảo sát chủ đề workshop truy cập S3 an toàn qua VPC Endpoint; phác thảo sơ đồ, phạm vi và danh sách dịch vụ cần tìm hiểu.<br>Tham gia Fireside Chat with Dr. Werner; ghi chép các chủ đề Cloud, AI, hệ thống quy mô lớn và học tập cộng đồng. |
| 03/10/2026 | Không bố trí buổi thực tập theo kế hoạch. |

### Nội dung chi tiết và hình ảnh

#### 1. Permissions của execution role API

Đối chiếu các policy của role API với trách nhiệm truy cập dữ liệu và gửi message.

![Permissions của execution role API](/images/1-Worklog/aws-practice/week02-roles.png)

*Ảnh Console bổ sung theo chủ đề tuần; không dùng để xác nhận ngày thực hiện của nhật ký gốc.*

#### 2. Trust relationship của role API

Kiểm tra service principal được phép sử dụng role; phân biệt trust policy với policy cấp quyền thao tác tài nguyên.

![Trust relationship của role API](/images/1-Worklog/aws-practice/iam-trust.png)

#### 3. Hoạt động AWS Cloud and AI Day

Ảnh hoạt động cộng đồng liên quan bài thu hoạch Event 2.

![Hoạt động AWS Cloud and AI Day](/images/4-EventParticipated/event2/group-photo.jpg)

*Nguồn: ảnh tham gia sự kiện trong hồ sơ cá nhân.*

### Kết quả

Đã phân biệt các loại danh tính và policy, hệ thống hóa mạng VPC và ghi nhận hoạt động cộng đồng.

### Bài học và điểm cần tiếp tục

Trust policy xác định ai được assume role; permission policy xác định role được làm gì. Với VPC, cần kiểm tra cả route, Security Group và Network ACL khi phân tích kết nối.

### Kế hoạch tiếp theo

Tiếp tục với [EC2, S3 và kiến trúc ứng dụng](../1.3-week3/).

### Tài liệu liên quan

- [AWS Cloud and AI Day]({{< relref "/4-EventParticipated/4.2-Event2/" >}})
- [Fireside Chat with Dr. Werner]({{< relref "/4-EventParticipated/4.4-Event4/" >}})
- [Tổng quan IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)
