---
title: "Worklog Tuần 11"
weight: 11
chapter: false
pre: "<b>1.11. </b> "
---

## Tuần 11: Lưu trữ và phân tích dữ liệu trên AWS

**Thời gian:** 30/11/2026–05/12/2026.

**Kế hoạch:** Tuần học chưa diễn ra. Ảnh khảo sát chuẩn bị được tách khỏi kết quả thực hành dự kiến.

### Mục tiêu

Tìm hiểu lưu trữ S3, metadata Glue Data Catalog và truy vấn Athena; chuẩn bị dữ liệu mẫu, câu SQL và kết quả mong đợi.

### Nội dung công việc dự kiến

| Chủ đề | Công việc dự kiến | Sản phẩm cần ghi nhận |
|---|---|---|
| Amazon S3 | Ôn lại bucket, object, prefix, định dạng CSV/JSON và mã hóa; chuẩn bị dữ liệu mẫu không chứa thông tin cá nhân. | Bộ dữ liệu mẫu và mô tả từng cột. |
| AWS Glue Data Catalog | Tìm hiểu database, table, schema và crawler; so sánh khai báo schema thủ công với khám phá schema. | Ghi chú ánh xạ dữ liệu trên S3 vào bảng metadata. |
| Amazon Athena | Tìm hiểu workgroup, vị trí lưu kết quả, quyền truy cập và chi phí theo dữ liệu quét; chuẩn bị truy vấn lọc, đếm và tổng hợp. | Bộ câu SQL cùng kết quả mong đợi. |
| Tối ưu truy vấn | So sánh CSV với Parquet và tìm hiểu partition theo ngày; phân tích ảnh hưởng tới lượng dữ liệu quét. | Bảng so sánh định dạng và cách tổ chức dữ liệu. |
| Tổng hợp kiến thức | Vẽ luồng S3, Data Catalog, Athena; ghi lại lỗi schema, quyền đọc dữ liệu và vị trí lưu kết quả cần kiểm tra. | Ghi chú học tập, sơ đồ và danh sách câu hỏi. |

### Nội dung nghiên cứu

Dự kiến chuẩn bị dữ liệu đơn hàng giả lập, xác định trước số dòng và kết quả tổng hợp rồi so sánh SQL. Kiểm tra schema, quyền đọc nguồn, quyền ghi kết quả và lượng dữ liệu quét; so sánh CSV với Parquet và partition.

### Nội dung chi tiết và hình ảnh

#### 1. Khảo sát Athena Query Editor

Đã khảo sát giao diện trước tuần học. Chưa cấu hình vị trí kết quả, chưa chạy SQL; ảnh không phải kết quả truy vấn.

![Khảo sát Athena Query Editor](/images/1-Worklog/aws-practice/athena-preparation.png)

*Ảnh khảo sát chuẩn bị; tuần học vẫn là kế hoạch.*

#### 2. Khảo sát Glue Data Catalog

Khảo sát giao diện database để chuẩn bị bài học schema và metadata. Chưa xác nhận đã tạo database hoặc crawler.

![Khảo sát Glue Data Catalog](/images/1-Worklog/aws-practice/glue-preparation.png)

*Ảnh khảo sát chuẩn bị; tuần học vẫn là kế hoạch.*

### Sơ đồ kiến thức

![Sơ đồ kiến thức](/images/1-Worklog/diagrams/week11-vi.svg)

### Kết quả dự kiến

Dự kiến có dữ liệu mẫu, schema, SQL và bảng đối chiếu. Hiện mới khảo sát giao diện, chưa chạy truy vấn.

### Bài học và điểm cần tiếp tục

Athena cần schema, quyền dữ liệu và vị trí lưu kết quả. Ảnh Query Editor hiện chưa có kết quả SQL; bài thực hành sẽ đo cả tính đúng và lượng dữ liệu quét.

### Kế hoạch tiếp theo

Tiếp tục với [Generative AI và nền tảng RAG trên AWS](../1.12-week12/).

### Tài liệu liên quan

- [Tài liệu Athena](https://docs.aws.amazon.com/athena/latest/ug/what-is.html)
- [Glue Data Catalog](https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html)
