---
title: "Worklog Tuần 8"
weight: 8
chapter: false
pre: "<b>1.8. </b> "
---

## Tuần 8: Phân tích và thiết kế Workshop FLASHRUSH

**Thời gian:** 09/11/2026–14/11/2026.

### Mục tiêu

Xác định phạm vi FLASHRUSH, luồng đặt hàng bất đồng bộ, mô hình dữ liệu và tiêu chí kiểm chứng trước khi viết hướng dẫn.

### Nội dung công việc

| Nhóm công việc | Nội dung ghi nhận | Sản phẩm đối chiếu |
|---|---|---|
| Phạm vi ứng dụng | Phân tích luồng xem sản phẩm, gửi yêu cầu mua và tra cứu trạng thái đơn. Phân biệt yêu cầu được tiếp nhận với đơn đã xác nhận. | Danh sách chức năng và giới hạn của Workshop. |
| Kiến trúc Serverless | Mô tả CloudFront/S3 phục vụ giao diện, API Gateway/Lambda tiếp nhận yêu cầu, SQS chuyển việc cho Worker và DynamoDB lưu sản phẩm, đơn hàng. | Sơ đồ thành phần và đường đi của yêu cầu. |
| Thiết kế dữ liệu | Xác định khóa productId cho Products, orderId cho Orders; phân tích tồn kho, trạng thái PENDING/CONFIRMED và khóa chống tạo đơn trùng. | Mô hình dữ liệu và điều kiện chuyển trạng thái. |
| Hàng đợi và xử lý lỗi | Nghiên cứu visibility timeout, retry, DLQ và khả năng giao message lặp; liên hệ thời gian xử lý của Worker với cấu hình SQS. | Danh sách tham số cần kiểm tra khi tích hợp. |
| Chuẩn bị tài liệu | Sắp xếp hướng dẫn theo phụ thuộc: dữ liệu, hàng đợi, quyền, hàm xử lý, API, giao diện và giám sát; xác định bằng chứng cần thu thập. | Khung bài thực hành và tiêu chí kiểm tra từng phần. |

### Nội dung nghiên cứu

API trả HTTP 202 để xác nhận tiếp nhận, Worker xử lý message và cập nhật trạng thái đơn. Giao diện cần tra cứu trạng thái cuối. Orders và gửi SQS là hai thao tác riêng; cần ghi nhận khả năng enqueue chưa rõ kết quả. Các ca gửi lại cùng khóa, message trùng và hết hàng là cơ sở kiểm thử tuần 10.

### Nội dung chi tiết và hình ảnh

#### 1. Kiến trúc Workshop FLASHRUSH

Phân tích luồng CloudFront/S3, API Gateway/Lambda, SQS/Worker và DynamoDB.

![Kiến trúc Workshop FLASHRUSH](/images/5-Workshop/FLASHRUSH/flashrush-architecture-v1.1.png)

*Sơ đồ minh họa kiến thức, không phải ảnh kết quả triển khai.*

#### 2. Thiết kế khóa bảng Products

Đối chiếu tên bảng và partition key productId với mô hình truy cập sản phẩm.

![Thiết kế khóa bảng Products](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-02.png)

*Nguồn: ảnh thực hành do nhóm cung cấp.*

#### 3. Chuẩn bị cấu hình hàng đợi

Ảnh cấu hình trong bộ tài liệu nhóm bổ trợ việc phân tích xử lý bất đồng bộ và retry.

![Chuẩn bị cấu hình hàng đợi](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-03.png)

*Nguồn: ảnh thực hành do nhóm cung cấp.*

### Kết quả

Đã hình thành khung kiến trúc, mô hình dữ liệu và tiêu chí kiểm tra Workshop.

### Bài học và điểm cần tiếp tục

HTTP 202 là tiếp nhận; CONFIRMED là kết quả nghiệp vụ. Cần thiết kế xử lý trùng và khoảng lỗi giữa ghi Orders với gửi SQS trước khi nghiệm thu.

### Kế hoạch tiếp theo

Tiếp tục với [Xây dựng hướng dẫn Workshop FLASHRUSH](../1.9-week9/).

### Tài liệu liên quan

- [Đề xuất FLASHRUSH]({{< relref "/2-Proposal/" >}})
- [Tổng quan Workshop]({{< relref "/5-Workshop/5.1-Workshop-overview/" >}})
