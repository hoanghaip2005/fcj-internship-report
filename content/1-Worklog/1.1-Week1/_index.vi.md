---
title: "Worklog Tuần 1"
weight: 1
chapter: false
pre: "<b>1.1. </b> "
---

## Tuần 1: Nền tảng AWS và làm quen chương trình

**Thời gian:** 21/09/2026–26/09/2026.

### Mục tiêu

Hiểu Region, Availability Zone và trách nhiệm bảo mật; làm quen IAM, quản lý tài khoản, chi phí và cách ghi nhật ký thực tập.

### Nội dung công việc

| Ngày | Công việc và nội dung ghi nhận |
|---|---|
| 21/09/2026 | Tìm hiểu chương trình First Cloud AI Journey, nội quy và mục tiêu đợt thực tập; xây dựng cách lưu tài liệu, ghi chép công việc theo tuần.<br>Khảo sát lộ trình Cloud Journey, xác định các nhóm kiến thức nền tảng và sản phẩm cần chuẩn bị: blog kỹ thuật, workshop, báo cáo. |
| 22/09/2026 | Tìm hiểu mô hình IaaS, PaaS, SaaS; phân biệt Region, Availability Zone và trách nhiệm bảo mật giữa AWS với khách hàng.<br>Hệ thống hóa vai trò các nhóm dịch vụ Compute, Storage, Networking, Database; ghi lại ví dụ sử dụng trong ứng dụng web. |
| 23/09/2026 | Nghiên cứu hướng dẫn Creating Your First AWS Account; tìm hiểu AWS Management Console, lựa chọn Region và bảo vệ tài khoản root bằng MFA.<br>Ghi chú các bước quản lý truy cập ban đầu, nguyên tắc không sử dụng tài khoản root cho công việc thường ngày. |
| 24/09/2026 | Tham khảo Managing Costs with AWS Budgets; tìm hiểu ngân sách chi phí, cảnh báo theo ngưỡng và cách kiểm tra tài nguyên phát sinh phí.<br>Tìm hiểu các gói AWS Support; lập danh sách lưu ý về hạn mức, điều kiện Free Tier và dọn dẹp tài nguyên sau bài lab. |
| 25/09/2026 | Nghiên cứu Command Line Operations with AWS CLI: cài đặt, cấu hình Region, hồ sơ truy cập và cú pháp lệnh cơ bản.<br>Tổng hợp kiến thức tuần đầu; xây dựng khung nhật ký, danh mục nguồn tham khảo và tiêu chí chọn chủ đề blog/workshop. |
| 26/09/2026 | Tham gia Buildrathon Kickoff với CMC Global; hệ thống hóa định hướng Cloud & AI, prompt engineering, RAG và AI Agent Challenge. |

### Nội dung chi tiết và hình ảnh

#### 1. Quản lý danh tính trên IAM Dashboard

Kiểm tra các nhóm tài nguyên IAM để phân biệt user, group, role và policy.

![Quản lý danh tính trên IAM Dashboard](/images/1-Worklog/aws-practice/week01-iam.png)

*Ảnh Console bổ sung theo chủ đề tuần; không dùng để xác nhận ngày thực hiện của nhật ký gốc.*

#### 2. Cài đặt tài khoản IAM

Đọc chính sách mật khẩu và thông tin endpoint STS. Lần kiểm tra này chỉ đọc cấu hình, không thay đổi mật khẩu hoặc quyền.

![Cài đặt tài khoản IAM](/images/1-Worklog/aws-practice/iam-account.png)

### Sơ đồ kiến thức

![Sơ đồ kiến thức](/images/1-Worklog/diagrams/week01-vi.svg)

### Kết quả

Đã hệ thống hóa dịch vụ AWS, quản lý danh tính và quy trình học; ảnh bổ sung giúp đối chiếu cấu hình thực tế.

### Bài học và điểm cần tiếp tục

IAM Dashboard chỉ phản ánh danh tính và cấu hình hiện có. Cần tiếp tục thực hành Budget/MFA theo phạm vi được phép; chưa coi ảnh IAM là bằng chứng đã hoàn thành các phần đó.

### Kế hoạch tiếp theo

Tiếp tục với [IAM, VPC và hoạt động cộng đồng](../1.2-week2/).

### Tài liệu liên quan

- [Buildrathon Kickoff]({{< relref "/4-EventParticipated/4.1-Event1/" >}})
- [Lộ trình Cloud Journey](https://cloudjourney.awsstudygroup.com/)
