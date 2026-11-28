---
title: "Worklog Tuần 10"
weight: 10
chapter: false
pre: "<b>1.10. </b> "
---

## Tuần 10: Rà soát Workshop và đối chiếu kết quả thực tế

**Thời gian:** 23/11/2026–28/11/2026.

**Tiến độ:** Tuần đang diễn ra. Công việc chưa có kết quả, gồm phần còn lại của ngày 28/11, tiếp tục được theo dõi; không tính là đã hoàn thành.

### Mục tiêu

Rà soát hướng dẫn, ảnh và báo cáo xác minh AWS; tách môi trường manual/lab, ghi nhận sai lệch và đầu việc còn thiếu.

### Nội dung công việc

| Nhóm công việc | Nội dung ghi nhận | Sản phẩm đối chiếu |
|---|---|---|
| Bộ ảnh thực hành | Tổng hợp 192 ảnh từ chín DOCX, phân loại theo dịch vụ và nội dung thao tác. | Bộ ảnh Console có thể tra cứu theo phần hướng dẫn. |
| Trình bày Workshop | Đặt ảnh sau bước tương ứng; sửa chú thích, bỏ tiêu đề lặp và các đoạn chuyển bước gây rối. | Hướng dẫn dễ theo dõi hơn trên Hugo. |
| Đối chiếu backend | Đọc báo cáo xác minh AWS: hai đơn CONFIRMED, stock từ 10 còn 8; ghi nhận cấu hình mapping và Function LIVE đã kiểm tra. | Kết quả đối chiếu backend theo báo cáo xác minh. |
| Ghi nhận sai lệch | Lập checklist frontend S3, CORS, missing-data của alarm và SQS wait time từ báo cáo xác minh. | Danh sách cần xử lý và ảnh cần chụp lại sau Save. |
| Rà soát nhật ký | Thống nhất lộ trình 12 tuần, đưa Workshop vào tuần 8–10; bố trí tuần 11–12 học tiếp dữ liệu và AI. | Nhật ký có nội dung và ảnh phù hợp từng giai đoạn. |

### Nội dung nghiên cứu

Hồ sơ xác minh trước đó ghi nhận hai đơn CONFIRMED, stock từ 10 còn 8; đồng thời nêu frontend S3, CORS, missing-data của alarm và SQS wait time cần bổ sung. Đây là ghi nhận của lần kiểm tra đã lưu, cần đối chiếu lại với hiện trạng trước khi kết luận còn lỗi hoặc đã khắc phục. Retry, chống bán vượt tồn, toàn luồng website và alarm tới email cần bằng chứng riêng.

### Nội dung chi tiết và hình ảnh

#### 1. Hiện trạng stack FLASHRUSH

Kiểm tra stack flashrush-lab UPDATE_COMPLETE. Tách môi trường này khỏi flashrush-manual của hướng dẫn Console.

![Hiện trạng stack FLASHRUSH](/images/1-Worklog/aws-practice/week10-stack.png)

*Ảnh Console bổ sung theo chủ đề tuần; không dùng để xác nhận ngày thực hiện của nhật ký gốc.*

#### 2. Minh chứng kiểm tra điều kiện tồn kho

Dùng bài thực hành riêng để kiểm chứng hành vi từ chối cập nhật vượt tồn; không dùng để xác nhận toàn bộ FLASHRUSH đã đạt kiểm thử.

![Minh chứng kiểm tra điều kiện tồn kho](/images/1-Worklog/aws-practice/week04-dynamodb-items.png)

#### 3. Đối chiếu hàng đợi giữa các môi trường

Phân biệt prefix flashrush-lab, flashrush-manual và fcj-worklog-practice để tránh kiểm tra nhầm môi trường.

![Đối chiếu hàng đợi giữa các môi trường](/images/1-Worklog/aws-practice/week09-sqs.png)

### Kết quả

Đã có hướng dẫn kèm ảnh và checklist sai lệch; các phát hiện cũ cần kiểm tra lại trước khi đánh dấu đã sửa.

### Bài học và điểm cần tiếp tục

Đối chiếu prefix, Region và nguồn bằng chứng trước khi kết luận. Các phát hiện trong báo cáo cũ cần kiểm tra hiện trạng; chỉ đánh dấu đã sửa khi có kết quả mới.

### Kế hoạch tiếp theo

Tiếp tục với [Lưu trữ và phân tích dữ liệu trên AWS](../1.11-week11/).

### Tài liệu liên quan

- [Kiểm thử và giám sát Workshop]({{< relref "/5-Workshop/5.5-Testing-and-monitoring/" >}})
