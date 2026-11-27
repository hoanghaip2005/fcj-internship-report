---
title: "Worklog Tuần 12"
weight: 12
chapter: false
pre: "<b>1.12. </b> "
---

## Tuần 12: Generative AI và nền tảng RAG trên AWS

**Thời gian:** 07/12/2026–12/12/2026.

**Kế hoạch:** Tuần học chưa diễn ra. Ảnh khảo sát chuẩn bị được tách khỏi kết quả thực hành dự kiến.

### Mục tiêu

Tìm hiểu Amazon Bedrock và RAG; chuẩn bị prompt, nguồn tài liệu và bộ câu hỏi đánh giá tính đúng, dẫn nguồn và phạm vi trả lời.

### Nội dung công việc dự kiến

| Chủ đề | Công việc dự kiến | Sản phẩm cần ghi nhận |
|---|---|---|
| Amazon Bedrock | Tìm hiểu foundation model, cách gửi yêu cầu, Region hỗ trợ, quyền truy cập và các thành phần chi phí. | Bảng lựa chọn mô hình theo mục tiêu thử nghiệm. |
| Prompt và đầu ra | Chuẩn bị chỉ dẫn về nhiệm vụ, nguồn thông tin và định dạng câu trả lời; kiểm tra cách phản hồi khi thiếu dữ liệu. | Bộ prompt cùng ví dụ kết quả mong đợi. |
| RAG | Nghiên cứu chia đoạn, embedding, truy xuất và đưa ngữ cảnh vào prompt; phân biệt lỗi tìm kiếm với lỗi sinh câu trả lời. | Sơ đồ RAG và mô tả vai trò từng bước. |
| Đánh giá và quyền dữ liệu | Chuẩn bị câu hỏi có đáp án, ngoài phạm vi và thiếu thông tin; xác định tài liệu nào được sử dụng và yêu cầu dẫn nguồn. | Bảng đánh giá tính đúng, dẫn chứng và phạm vi trả lời. |
| Tổng kết học tập | Tổng hợp kiến thức 12 tuần, đối chiếu mục tiêu với sản phẩm hiện có và ghi lại chủ đề cần học sâu. | Ghi chú tổng kết và kế hoạch học tiếp. |

### Nội dung nghiên cứu

Dự kiến chọn tập tài liệu nhỏ và chuẩn bị đáp án tham chiếu trước khi thử nghiệm. Kiểm tra riêng việc tìm đúng đoạn và việc câu trả lời bám vào đoạn đó. Khi thiếu dữ liệu hoặc ngoài phạm vi, kết quả mong đợi là nêu giới hạn, không tự thêm thông tin.

### Nội dung chi tiết và hình ảnh

#### 1. Khảo sát Amazon Bedrock

Khảo sát dịch vụ và các nhóm chức năng trước tuần học. Chưa gửi prompt hoặc gọi mô hình.

![Khảo sát Amazon Bedrock](/images/1-Worklog/aws-practice/bedrock-preparation.png)

*Ảnh khảo sát chuẩn bị; tuần học vẫn là kế hoạch.*

#### 2. Khảo sát danh mục mô hình

Chuẩn bị tiêu chí chọn mô hình theo nhiệm vụ, quyền truy cập và chi phí; chưa đăng ký mô hình Marketplace.

![Khảo sát danh mục mô hình](/images/1-Worklog/aws-practice/bedrock-models.png)

*Ảnh khảo sát chuẩn bị; tuần học vẫn là kế hoạch.*

### Sơ đồ kiến thức

![Sơ đồ kiến thức](/images/1-Worklog/diagrams/week12-vi.svg)

### Kết quả dự kiến

Dự kiến có sơ đồ RAG và bộ đánh giá. Hiện mới khảo sát Bedrock, chưa gọi mô hình hoặc triển khai RAG.

### Bài học và điểm cần tiếp tục

RAG cần đánh giá riêng truy xuất và sinh câu trả lời. Khảo sát danh mục mô hình không đồng nghĩa đã có quyền gọi, đã kiểm thử hay đã triển khai ứng dụng AI.

### Kế hoạch tiếp theo

Tổng hợp kết quả đã kiểm chứng và lập kế hoạch học sâu IAM, hệ thống bất đồng bộ, dữ liệu và AI.

### Tài liệu liên quan

- [Tài liệu Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html)
- [Knowledge Bases và RAG](https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html)
