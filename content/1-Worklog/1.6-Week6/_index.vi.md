---
title: "Worklog Tuần 6"
weight: 6
chapter: false
pre: "<b>1.6. </b> "
---

## Tuần 6: Lambda và tự động hóa hạ tầng

**Thời gian:** 26/10/2026–31/10/2026.

### Mục tiêu

Giải thích mô hình Lambda theo sự kiện, execution role và timeout; phân biệt CloudFormation/CDK với triển khai Console thủ công.

### Nội dung công việc

| Nhóm công việc | Nội dung triển khai | Sản phẩm hoặc kết quả cần ghi nhận |
|---|---|---|
| AWS Lambda | Phân tích mô hình thực thi theo sự kiện, handler, runtime, bộ nhớ, timeout và execution role; phân biệt triển khai mã với lưu mã trong editor. | Bảng cấu hình cần kiểm tra khi tạo Lambda. |
| AWS Systems Manager | Tìm hiểu vai trò quản lý cấu hình và thao tác vận hành; phân biệt quyền người vận hành với quyền runtime ứng dụng. | Ghi chú phạm vi sử dụng trong quản lý hệ thống. |
| CloudFormation và CDK | Đối chiếu cách mô tả tài nguyên, phụ thuộc giữa dịch vụ và vòng đời stack; phân biệt triển khai bằng IaC với tạo thủ công qua Console. | Sơ đồ phụ thuộc và danh sách tài nguyên. |
| Quản lý tài nguyên | Xác định quy ước tên, tags, Region và inventory để tránh nhầm tài nguyên giữa các môi trường. | Quy ước nhận diện tài nguyên lab. |
| Liên hệ ứng dụng | Liên hệ Lambda với API tiếp nhận yêu cầu và Worker; xác định các thông tin cần truyền qua biến môi trường. | Danh sách yêu cầu trước khi tích hợp backend. |

### Nội dung chi tiết và hình ảnh

#### 1. Lambda Worker và nguồn sự kiện SQS

Đọc Function overview để xác định nguồn sự kiện, execution role và các thành phần liên quan.

![Lambda Worker và nguồn sự kiện SQS](/images/1-Worklog/aws-practice/week06-lambda.png)

*Ảnh Console bổ sung theo chủ đề tuần; không dùng để xác nhận ngày thực hiện của nhật ký gốc.*

#### 2. Bộ nhớ và timeout của Worker

Console ghi nhận bộ nhớ 256 MB, timeout 15 giây. Liên hệ timeout với visibility timeout của SQS.

![Bộ nhớ và timeout của Worker](/images/1-Worklog/aws-practice/lambda-config.png)

#### 3. Quản lý vòng đời tài nguyên bằng CloudFormation

Stack flashrush-lab ở trạng thái UPDATE_COMPLETE; đây là ví dụ IaC, khác môi trường Console manual.

![Quản lý vòng đời tài nguyên bằng CloudFormation](/images/1-Worklog/aws-practice/week10-stack.png)

### Kết quả

Đã tổng hợp Lambda, quyền thực thi và IaC; đối chiếu cấu hình Worker hiện có.

### Bài học và điểm cần tiếp tục

Timeout của Lambda, thời gian ẩn message và concurrency phải phù hợp với nhau. Stack UPDATE_COMPLETE chỉ xác nhận thao tác hạ tầng hoàn tất, chưa chứng minh luồng nghiệp vụ đúng.

### Kế hoạch tiếp theo

Tiếp tục với [Bảo mật và xác thực ứng dụng](../1.7-week7/).

### Tài liệu liên quan

- [Tài liệu CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html)
