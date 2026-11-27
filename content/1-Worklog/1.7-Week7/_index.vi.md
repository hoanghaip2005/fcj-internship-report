---
title: "Worklog Tuần 7"
weight: 7
chapter: false
pre: "<b>1.7. </b> "
---

## Tuần 7: Bảo mật và xác thực ứng dụng

**Thời gian:** 02/11/2026–07/11/2026.

### Mục tiêu

Hệ thống hóa policy IAM, bảo vệ dữ liệu và luồng Cognito; phân biệt xác thực người dùng với quyền truy cập tài nguyên AWS.

### Nội dung công việc

| Nhóm công việc | Nội dung triển khai | Sản phẩm hoặc kết quả cần ghi nhận |
|---|---|---|
| IAM | Phân tích identity policy, resource policy, trust policy và permission boundaries; đối chiếu nguyên tắc quyền tối thiểu. | Bảng phân biệt vai trò các loại policy. |
| Bảo vệ dữ liệu | Tìm hiểu KMS và Secrets Manager; phân biệt định danh tài nguyên với bí mật đăng nhập, hạn chế ghi token vào ảnh và log. | Danh sách dữ liệu cần bảo vệ khi bàn giao. |
| Bảo vệ truy cập | Nghiên cứu WAF và S3 VPC Endpoint; đối chiếu truy cập S3 nội bộ với phân phối frontend qua CloudFront/OAC. | Ghi chú điều kiện áp dụng từng phương án. |
| Amazon Cognito | Phân tích User Pool, Identity Pool, token và luồng xác thực; liên hệ phương án đề xuất cho FitJoy. | Nội dung đối chiếu cho blog Cognito. |
| Tổng hợp bài viết | Rà soát kiến trúc, thuật ngữ và nguồn kỹ thuật của bài Cognito; phân biệt kiến trúc đề xuất với ứng dụng đã triển khai. | Bài viết và minh chứng đăng bài trong mục Blog 3. |

### Nội dung chi tiết và hình ảnh

#### 1. User Pool trong Amazon Cognito

Kiểm tra User Pool flashrush-customers đang tồn tại; chưa suy ra kết quả kiểm thử đăng nhập.

![User Pool trong Amazon Cognito](/images/1-Worklog/aws-practice/week07-cognito.png)

*Ảnh Console bổ sung theo chủ đề tuần; không dùng để xác nhận ngày thực hiện của nhật ký gốc.*

#### 2. Tổng quan cấu hình User Pool

Xác định User Pool và cấu hình ứng dụng liên quan; phân biệt xác thực người dùng với quyền IAM của dịch vụ.

![Tổng quan cấu hình User Pool](/images/1-Worklog/aws-practice/cognito-overview.png)

#### 3. Liên hệ bảo mật với lưu trữ riêng tư

Đối chiếu cơ chế chặn truy cập công khai của bucket riêng để bổ trợ phần bảo vệ dữ liệu.

![Liên hệ bảo mật với lưu trữ riêng tư](/images/1-Worklog/aws-practice/s3-permissions.png)

### Kết quả

Đã hệ thống hóa IAM, bảo vệ dữ liệu và Cognito; ảnh xác nhận cấu hình tồn tại, chưa thay thế kiểm thử đăng nhập.

### Bài học và điểm cần tiếp tục

User Pool xác thực và cấp token; Identity Pool cấp credentials AWS tạm thời theo IAM. Backend vẫn phải kiểm tra quyền đối với dữ liệu và nghiệp vụ cụ thể.

### Kế hoạch tiếp theo

Tiếp tục với [Phân tích và thiết kế Workshop FLASHRUSH](../1.8-week8/).

### Tài liệu liên quan

- [Blog Cognito]({{< relref "/3-BlogsPosted/3.3-Blog3/" >}})
- [Policy IAM](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)
