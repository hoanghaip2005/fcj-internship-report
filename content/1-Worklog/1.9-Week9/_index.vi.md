---
title: "Worklog Tuần 9"
weight: 9
chapter: false
pre: "<b>1.9. </b> "
---

## Tuần 9: Xây dựng hướng dẫn Workshop FLASHRUSH

**Thời gian:** 16/11/2026–21/11/2026.

### Mục tiêu

Biên soạn hướng dẫn chín dịch vụ AWS theo phụ thuộc; xác định ảnh và kết quả cần kiểm tra ở từng bước tích hợp.

### Nội dung công việc

| Nhóm công việc | Nội dung ghi nhận | Sản phẩm đối chiếu |
|---|---|---|
| DynamoDB và SQS | Biên soạn hướng dẫn tạo bảng Products/Orders, dữ liệu thử, queue chính và DLQ; mô tả tham số ảnh hưởng đến xử lý đơn. | Hướng dẫn dữ liệu và hàng đợi. |
| IAM và Lambda | Tách quyền của API với Worker; mô tả execution role, runtime, handler, biến môi trường và event source mapping. | Hướng dẫn quyền và cấu hình backend. |
| API Gateway | Mô tả route, integration, stage và CORS; liên hệ endpoint với cấu hình frontend. | Các bước kết nối client với backend. |
| S3 và CloudFront | Mô tả build giao diện, upload nội dung, S3 private origin, OAC và phân phối qua CloudFront. | Hướng dẫn phục vụ frontend. |
| SNS và CloudWatch | Chuẩn bị hướng dẫn subscription email, metrics và alarm; phân biệt xác nhận subscription với kiểm thử gửi cảnh báo. | Hướng dẫn giám sát và danh sách bằng chứng cần bổ sung. |

### Nội dung nghiên cứu

Hướng dẫn được tổ chức theo đầu vào, thao tác và kết quả cần kiểm tra. Với Lambda phải đối chiếu quyền, biến môi trường và mapping; với frontend phải đối chiếu API endpoint và CORS. Bằng chứng cấu hình cần phân biệt với kết quả chạy ứng dụng.

### Nội dung chi tiết và hình ảnh

#### 1. Dữ liệu mẫu để kiểm tra hướng dẫn

Kiểm tra dữ liệu mẫu hiển thị trong DynamoDB và vị trí ảnh tương ứng trong tài liệu.

![Dữ liệu mẫu để kiểm tra hướng dẫn](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-14.png)

*Nguồn: ảnh thực hành do nhóm cung cấp.*

#### 2. Danh sách hàng đợi và kết quả thực hành SQS

Queue fcj-worklog-practice dùng SSE-SQS, long polling 20 giây và visibility timeout 60 giây. Đã gửi, nhận đúng MessageId rồi xóa message sau xử lý.

![Danh sách hàng đợi và kết quả thực hành SQS](/images/1-Worklog/aws-practice/week09-sqs.png)

*Ảnh Console bổ sung theo chủ đề tuần; không dùng để xác nhận ngày thực hiện của nhật ký gốc.*

#### 3. Đối chiếu event source mapping của Worker

Kiểm tra nguồn SQS trong tab Triggers; ảnh cấu hình không thay thế kiểm thử nghiệp vụ.

![Đối chiếu event source mapping của Worker](/images/1-Worklog/aws-practice/lambda-triggers.png)

### Kết quả

Đã biên soạn hướng dẫn dịch vụ; bài SQS riêng xác nhận gửi, nhận và xóa đúng message.

### Bài học và điểm cần tiếp tục

Ảnh cần đặt sau bước tương ứng và cho thấy giá trị đã lưu khi dùng để kết luận cấu hình. Phép thử queue riêng không thay thế kiểm thử tích hợp Worker và DynamoDB.

### Kế hoạch tiếp theo

Tiếp tục với [Rà soát Workshop và đối chiếu kết quả thực tế](../1.10-week10/).

### Tài liệu liên quan

- [Hướng dẫn hạ tầng Workshop]({{< relref "/5-Workshop/5.3-Infrastructure/" >}})
