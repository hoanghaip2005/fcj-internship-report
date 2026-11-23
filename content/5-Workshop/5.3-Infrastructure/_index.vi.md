---
title: "5.3 Hạ tầng AWS: 9 dịch vụ"
weight: 3
draft: false
---




> **Trạng thái:** Bản nháp thực hành; chưa chạy lại từ đầu trên AWS Console. Người học sẽ tạo resource AWS thật, có thể phát sinh chi phí. Chỉ thực hiện trên `flashrush-manual-*`, tách biệt khỏi `flashrush-lab` do CloudFormation quản lý.

**Mục tiêu:** Đi từng dịch vụ, tạo tài nguyên bằng giao diện AWS Console, kiểm tra kết quả rồi mới chuyển bước. Các bài dùng source Python Lambda và frontend React hiện có của FLASHRUSH; **không dùng CloudFormation hoặc AWS CLI để tạo hạ tầng**.

## Thứ tự thao tác

| Bài | Dịch vụ | Tài nguyên/chức năng | Hướng dẫn |
|---|---|---|---|
| 5.3.1 | **Amazon DynamoDB** | Hai bảng Products và Orders, tạo dữ liệu sản phẩm | [Thực hành 5.3.1]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.1-DynamoDB/" >}}) |
| 5.3.2 | **Amazon SQS** | Standard Queue, DLQ, redrive policy | [Thực hành 5.3.2]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.2-SQS/" >}}) |
| 5.3.3 | **AWS IAM** | Hai execution roles và quyền truy cập tối thiểu | [Thực hành 5.3.3]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.3-IAM/" >}}) |
| 5.3.4 | **AWS Lambda** | Order API, Order Worker và SQS trigger | [Thực hành 5.3.4]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.4-Lambda/" >}}) |
| 5.3.5 | **Amazon API Gateway** | HTTP API, routes, CORS và access logs | [Thực hành 5.3.5]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.5-API-Gateway/" >}}) |
| 5.3.6 | **Amazon S3** | Private bucket lưu trữ frontend | [Thực hành 5.3.6]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.6-S3/" >}}) |
| 5.3.7 | **Amazon CloudFront** | OAC, HTTPS, bucket policy và SPA Function | [Thực hành 5.3.7]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.7-CloudFront/" >}}) |
| 5.3.8 | **Amazon SNS** | Topic và email subscription | [Thực hành 5.3.8]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.8-SNS/" >}}) |
| 5.3.9 | **Amazon CloudWatch** | Logs, metrics và alarms | [Thực hành 5.3.9]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.9-CloudWatch/" >}}) |

## Checklist trước khi bắt đầu

- [ ] Đã đọc [5.2 Chuẩn bị môi trường]({{< relref "/5-Workshop/5.2-Prerequisite/" >}}) và đăng nhập đúng AWS Account.
- [ ] Region đã đặt thành `us-east-1` (IAM, CloudFront có phạm vi toàn cục).
- [ ] Có đủ quyền tạo resource và biết cách theo dõi chi phí; Budget không phải giới hạn cứng.
- [ ] Đã kiểm tra tên `flashrush-manual-*` chưa trùng tài nguyên có sẵn.
- [ ] Có file ghi chú resource names, ARN, SQS Queue URL, API Endpoint, CloudFront domain.

**Các phần giao thoa:** CloudWatch Log Groups phải được tạo trong bài IAM để giới hạn quyền ghi log; bài CloudWatch cuối chương phụ trách alarms/observability. Upload frontend và tích hợp trình duyệt nằm ở **5.4**, không thực hiện trước khi có API URL, S3 và CloudFront.

## Ảnh thực tế cần bổ sung

| Bước | Ảnh cần chụp | Tên gợi ý |
|---|---|---|
| DynamoDB | Hai bảng ACTIVE và kiểu khóa | `5.3-01-dynamodb-tables.png` |
| SQS | Main Queue, DLQ, redrive policy | `5.3-02-sqs-dlq.png` |
| IAM | Hai execution roles và quyền theo ARN | `5.3-03-iam-roles.png` |
| Lambda | API/Worker, handler và environment | `5.3-04-lambda-config.png` |
| Lambda/SQS | Event source mapping Enabled | `5.3-05-sqs-trigger.png` |
| API Gateway | Bốn routes, `$default`, CORS | `5.3-06-http-api.png` |
| S3 | Bucket private, Block Public Access | `5.3-07-private-s3.png` |
| CloudFront | Distribution, OAC, Function LIVE | `5.3-08-cloudfront-oac.png` |
| SNS | Subscription Confirmed | `5.3-09-sns-subscription.png` |
| CloudWatch | Ba Alarms và log groups | `5.3-10-cloudwatch.png` |

Ảnh từ tài liệu thực hành đã được bổ sung ở từng bài dịch vụ. Các cấu hình chưa xuất hiện đầy đủ trong ảnh vẫn cần được xác minh trực tiếp.

**Checkpoint cuối 5.3:** Các resource có tên `flashrush-manual-*` tồn tại đúng tài khoản/vùng; hai Lambda hoạt động với API Lambda Test; API Gateway GET `/products` trả JSON; chưa bắt buộc frontend xuất hiện.

---

[← 5.2 Chuẩn bị]({{< relref "/5-Workshop/5.2-Prerequisite/" >}}) · [5.4 Triển khai ứng dụng →]({{< relref "/5-Workshop/5.4-Application-deployment/" >}})
