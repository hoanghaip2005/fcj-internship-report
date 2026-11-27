---
title: "Worklog Tuần 5"
weight: 5
chapter: false
pre: "<b>1.5. </b> "
---

## Tuần 5: Phân tích DropIt và đề xuất kiến trúc FitJoy

**Thời gian:** 19/10/2026–24/10/2026.

### Mục tiêu

Liên hệ AWS với DropIt; đề xuất kiến trúc cho FitJoy và đánh giá quyền, giám sát, khả năng mở rộng, chi phí trong phạm vi thiết kế.

### Nội dung công việc

| Ngày | Công việc và nội dung ghi nhận |
|---|---|
| 19/10/2026 | Tìm hiểu EC2 Auto Scaling và khả năng mở rộng ứng dụng; dùng DropIt làm tình huống phân tích backend Node.js, Socket.IO và PostgreSQL.<br>Phác thảo phương án chạy DropIt trên Lightsail; xem xét tải phiên học đồng thời, kết nối WebSocket và giới hạn của kiến trúc một máy. |
| 20/10/2026 | Phân tích xác thực DropIt bằng Amazon Cognito: access token, kiểm tra chữ ký JWKS và phân quyền truy cập nhóm học ở backend.<br>Đối chiếu với kiến thức IAM và đề cương blog Cognito; ghi chú tách quyền triển khai, quyền ứng dụng và bảo vệ thông tin xác thực. |
| 21/10/2026 | Tìm hiểu CloudWatch metrics, logs và alarm; xây dựng danh sách chỉ số cần giám sát cho DropIt: CPU, RAM, lỗi API và kết nối WebSocket.<br>Nghiên cứu tích hợp SNS gửi thông báo; phác thảo phương án sao lưu PostgreSQL và uploads, kiểm tra phục hồi và kiểm soát chi phí AWS. |
| 22/10/2026 | Khảo sát FitJoy, ứng dụng React/Vite về sức khỏe và tập luyện; phân tích nhu cầu phân phối giao diện, đăng nhập và đồng bộ tiến độ.<br>Đề xuất kiến trúc AWS cho FitJoy: S3/CloudFront phục vụ web, Cognito xác thực, API Gateway/Lambda và DynamoDB lưu tiến độ; chưa triển khai. |
| 23/10/2026 | So sánh phương án Lightsail của DropIt với phương án Serverless đề xuất cho FitJoy về vận hành, mở rộng, bảo mật và chi phí.<br>Tổng hợp kiến thức tuần 5; liên hệ hai dự án với đề cương blog Cognito, Serverless và workshop S3 VPC Endpoint; cập nhật nhật ký, sơ đồ và câu hỏi kỹ thuật. |
| 24/10/2026 | Không bố trí buổi thực tập theo kế hoạch. |

### Nội dung chi tiết và hình ảnh

#### 1. Đọc log ứng dụng bằng CloudWatch

Ảnh thực hành nhóm dùng làm ví dụ đọc log; không phải bằng chứng DropIt đã triển khai giám sát.

![Đọc log ứng dụng bằng CloudWatch](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-03.png)

*Nguồn: ảnh thực hành do nhóm cung cấp.*

#### 2. Theo dõi trạng thái alarm

Đối chiếu metric, threshold và action khi phân tích phương án giám sát cho ứng dụng.

![Theo dõi trạng thái alarm](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-14.png)

*Nguồn: ảnh thực hành do nhóm cung cấp.*

#### 3. Phương án xác thực ứng dụng

Liên hệ sơ đồ Cognito với phương án DropIt và FitJoy. Kiến trúc AWS cho FitJoy là đề xuất.

![Phương án xác thực ứng dụng](/images/3-BlogsPosted/blog4-cognito-architecture.png)

*Sơ đồ minh họa kiến thức, không phải ảnh kết quả triển khai.*

### Kết quả

Đã phân tích DropIt và đề xuất AWS cho FitJoy; chưa ghi nhận FitJoy đã triển khai AWS.

### Bài học và điểm cần tiếp tục

Phương án kiến trúc cần xuất phát từ tải, kết nối và cách vận hành của ứng dụng. Giữ rõ FitJoy là đề xuất, ảnh CloudWatch nhóm chỉ bổ trợ phương pháp giám sát.

### Kế hoạch tiếp theo

Tiếp tục với [Lambda và tự động hóa hạ tầng](../1.6-week6/).

### Tài liệu liên quan

- [Blog Cognito]({{< relref "/3-BlogsPosted/3.3-Blog3/" >}})
- [Tài liệu Amazon Lightsail](https://docs.aws.amazon.com/lightsail/)
