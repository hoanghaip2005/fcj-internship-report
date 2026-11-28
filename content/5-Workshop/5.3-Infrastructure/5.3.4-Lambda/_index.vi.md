---
title: "5.3.4 AWS Lambda"
weight: 4
draft: false
---

Mục tiêu: Tạo Order API, Order Worker và SQS trigger; kiểm tra trực tiếp bằng Lambda Test.

Điều kiện: Hoàn thành [5.2 Chuẩn bị]({{< relref "/5-Workshop/5.2-Prerequisite/" >}}); có DynamoDB Products/Orders, SQS main queue, DLQ và IAM execution roles. Dùng region us-east-1 và backend/app.py của dự án FLASHRUSH.

Cách đọc: Khung xanh chỉ ô nhập, nút hoặc giá trị cần kiểm tra. Vòng tròn xanh dùng số bước toàn cục 1–21; các hình cùng bước lặp lại cùng số. Mỗi hình dùng một trang ngang để đọc rõ Console.

Giá trị cấu hình cần dùng

API: flashrush-manual-api · Python 3.12 · ARM64 · app.api · 256 MB · 15 giây.

Worker: flashrush-manual-worker · Python 3.12 · ARM64 · app.worker · 256 MB · 15 giây.

PRODUCTS_TABLE = flashrush-manual-products; ORDERS_TABLE = flashrush-manual-orders; QUEUE_URL = URL main queue của tài khoản đang dùng.

SQS trigger: flashrush-manual-orders; Batch size = 1; Batch window = 0; Maximum concurrency = 5; bật Report batch item failures.

### 5.3.4.1 Chuẩn bị mã nguồn

**Bước 1.** Mở VS Code → backend/app.py → sao chép toàn bộ mã nguồn. Hai Lambda dùng cùng app.py, khác handler.

![Mã nguồn dùng PRODUCTS_TABLE, ORDERS_TABLE và SQS client](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-01.png)

*Hình 5.3.4.1. Mã nguồn dùng PRODUCTS_TABLE, ORDERS_TABLE và SQS client.*

### 5.3.4.2 Tạo Lambda API

**Bước 2.** Mở AWS Lambda tại us-east-1 → nhấn Create an Event Function.

![Nút tạo Lambda Event Function](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-02.png)

*Hình 5.3.4.2. Nút tạo Lambda Event Function.*

#### Tạo Lambda API

**Bước 3.** Chọn Author from scratch → Function name: flashrush-manual-api → Runtime: Python 3.12. Chọn role flashrush-manual-api-role trong Custom execution role.

![Tên function, runtime và dropdown IAM role](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-03.png)

*Hình 5.3.4.3. Tên function, runtime và dropdown IAM role.*

#### Tạo Lambda API

**Bước 4.** Bật ARM64 architecture và Custom execution role → chọn flashrush-manual-api-role → Save. Giữ VPC tắt.

![Hai công tắc cấu hình, dropdown role và nút Save](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-04.png)

*Hình 5.3.4.4. Hai công tắc cấu hình, dropdown role và nút Save.*

#### Tạo Lambda API

Tiếp bước 4: Kiểm tra ARM64 đã bật và role đúng → nhấn Create Event Function.

![Hoàn tất tạo function sau khi lưu role](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-05.png)

*Hình 5.3.4.5. Hoàn tất tạo function sau khi lưu role.*

### 5.3.4.2 Triển khai mã nguồn API

**Bước 5.** Code → tạo app.py ở gốc Explorer → dán toàn bộ backend/app.py → nhấn Deploy. Khung mã nguồn chỉ phần handler worker trong file dùng chung.

![File app.py, handler trong mã nguồn và nút Deploy](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-06.png)

*Hình 5.3.4.6. File app.py, handler trong mã nguồn và nút Deploy.*

### 5.3.4.2 Đặt handler API

**Bước 6.** Trong tab Code → Runtime settings → nhấn Edit để đổi handler mặc định.

![Runtime settings, handler mặc định và nút Edit](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-07.png)

*Hình 5.3.4.7. Runtime settings, handler mặc định và nút Edit.*

#### Đặt handler API

Tiếp bước 6: Nhập Handler = app.api → nhấn Save settings.

![Ô handler app.api và nút Save settings](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-08.png)

*Hình 5.3.4.8. Ô handler app.api và nút Save settings.*

### 5.3.4.2 Cấu hình bộ nhớ và thời gian chạy

**Bước 7.** Configuration → General configuration → Edit. Ảnh hiện Memory 128 MB và Timeout 3 secs trước khi sửa.

![Menu cấu hình, giá trị hiện tại và nút Edit](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-09.png)

*Hình 5.3.4.9. Menu cấu hình, giá trị hiện tại và nút Edit.*

#### Cấu hình bộ nhớ và thời gian chạy

Tiếp bước 7: Memory = 256 MB; Timeout = 0 mins 15 secs; Execution role = flashrush-manual-api-role → Save.

![Các ô giá trị Memory, Timeout, role và nút Save](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-10.png)

*Hình 5.3.4.10. Các ô giá trị Memory, Timeout, role và nút Save.*

### 5.3.4.2 Thêm biến môi trường

**Bước 8.** Configuration → Environment variables → Edit. Thêm PRODUCTS_TABLE, ORDERS_TABLE và QUEUE_URL.

![Menu Environment variables, số biến hiện tại và nút Edit](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-11.png)

*Hình 5.3.4.11. Menu Environment variables, số biến hiện tại và nút Edit.*

#### Thêm biến môi trường

Tiếp bước 8: Nhập từng cặp Key/Value → Add environment variable để thêm dòng. Chỉ nhấn Save sau khi điền đủ ba biến.

![Ô Key, ô Value, nút thêm dòng và nút Save](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-12.png)

*Hình 5.3.4.12. Ô Key, ô Value, nút thêm dòng và nút Save.*

#### Thêm biến môi trường

Tiếp bước 8: PRODUCTS_TABLE = flashrush-manual-products; ORDERS_TABLE = flashrush-manual-orders; QUEUE_URL = URL của main queue → Save.

![Ba biến môi trường trước khi lưu; QUEUE_URL dùng URL của main queue](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-13.png)

*Hình 5.3.4.13. Ba biến môi trường trước khi lưu; QUEUE_URL dùng URL của main queue.*

#### Thêm biến môi trường

Tiếp bước 8: Kiểm tra Environment variables (3) và đủ ba dòng giá trị đã lưu.

![Xác nhận ba biến môi trường của Lambda API](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-14.png)

*Hình 5.3.4.14. Xác nhận ba biến môi trường của Lambda API.*

### 5.3.4.3 Kiểm tra GET /products

**Bước 9.** Test → Create new event → Event name: GetProducts → Synchronous → Private. Nhập JSON ở hình tiếp theo rồi Save → Test.

![Tạo test event GetProducts với kiểu gọi Synchronous](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-15.png)

*Hình 5.3.4.15. Tạo test event GetProducts với kiểu gọi Synchronous.*

#### Kiểm tra GET /products

Tiếp bước 9: Trong Event JSON, nhập payload HTTP API 2.0 với rawPath = /products và requestContext.http.method = GET → Save → Test.

![Toàn bộ editor Event JSON cho GET /products](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-16.png)

*Hình 5.3.4.16. Toàn bộ editor Event JSON cho GET /products.*

### 5.3.4.3 Đọc kết quả GET /products

**Bước 10.** Kiểm tra Executing function: succeeded → mở Details để đọc Response. Tiếp tục đối chiếu HTTP status và body ở hình sau.

![Trạng thái thực thi thành công và nút Test](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-17.png)

*Hình 5.3.4.17. Trạng thái thực thi thành công và nút Test.*

#### Đọc kết quả GET /products

Tiếp bước 10: Response phải có statusCode = 200; body chứa items và productId = manual-sku-001.

![HTTP 200 và toàn bộ body chứa sản phẩm thử](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-18.png)

*Hình 5.3.4.18. HTTP 200 và toàn bộ body chứa sản phẩm thử.*

### 5.3.4.4 Tạo Lambda Worker

**Bước 11.** Tạo flashrush-manual-worker: Python 3.12, ARM64, role flashrush-manual-worker-role; Deploy cùng app.py; handler app.worker; 256 MB, 15 giây; cùng ba biến môi trường.

![Ảnh xác nhận tên Worker và ba biến; handler, memory và timeout cần kiểm tra trong Console](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-19.png)

*Hình 5.3.4.19. Ảnh xác nhận tên Worker và ba biến; handler, memory và timeout cần kiểm tra trong Console.*

### 5.3.4.5 Gắn SQS trigger

**Bước 12.** Trên Lambda Worker → Add trigger → tại Trigger configuration mở Select a source. Lấy ARN main queue theo hai bước tiếp theo.

![Màn hình cấu hình trigger và dropdown chọn nguồn](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-20.png)

*Hình 5.3.4.20. Màn hình cấu hình trigger và dropdown chọn nguồn.*

### 5.3.4.5 Xác định main queue

**Bước 13.** Mở Amazon SQS → Queues → chọn flashrush-manual-orders (main queue). Dòng flashrush-manual-dlq là dead-letter queue.

![Dòng trên: DLQ; dòng dưới: main queue đang được chọn](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-21.png)

*Hình 5.3.4.21. Dòng trên: DLQ; dòng dưới: main queue đang được chọn.*

### 5.3.4.5 Sao chép ARN và URL queue

**Bước 14.** Trong flashrush-manual-orders → sao chép ARN để gắn trigger; sao chép URL cho QUEUE_URL. Kiểm tra Dead-letter queue = Enabled.

![ARN và URL đều được khoanh đủ hai dòng; DLQ đang Enabled](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-22.png)

*Hình 5.3.4.22. ARN và URL đều được khoanh đủ hai dòng; DLQ đang Enabled.*

### 5.3.4.5 Cấu hình SQS event source mapping

**Bước 15.** Quay lại Add trigger → chọn SQS → nhập ARN flashrush-manual-orders. Đổi Batch size từ 10 thành 1; đặt Batch window = 0.

![Ảnh đang hiển thị Batch size = 10 trước khi sửa; chưa xác nhận giá trị 1](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-23.png)

*Hình 5.3.4.23. Ảnh đang hiển thị Batch size = 10 trước khi sửa; chưa xác nhận giá trị 1.*

#### Cấu hình SQS event source mapping

Tiếp bước 15: Maximum concurrency = 5 → bật Report batch item failures → Add. Giữ Provisioned mode và EventCount metrics tắt theo baseline.

![Ảnh chỉ thấy ô concurrency 5, checkbox đã bật và Add; Batch size/Batch window nằm ngoài ảnh](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-24.png)

*Hình 5.3.4.24. Ảnh chỉ thấy ô concurrency 5, checkbox đã bật và Add; Batch size/Batch window nằm ngoài ảnh.*

### 5.3.4.5 Theo dõi trạng thái trigger

**Bước 16.** Configuration → Triggers → kiểm tra đúng flashrush-manual-orders. State có thể tạm thời là Creating; không thêm trigger thứ hai.

![Main queue flashrush-manual-orders trong trạng thái Creating](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-25.png)

*Hình 5.3.4.25. Main queue flashrush-manual-orders trong trạng thái Creating.*

### 5.3.4.5 Xác nhận trigger hoạt động

**Bước 17.** Mở Details khi cần xem cấu hình; nhấn Refresh và chờ State chuyển từ Creating sang Enabled.

![Tên main queue đầy đủ, trạng thái Creating và nút Details](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-26.png)

*Hình 5.3.4.26. Tên main queue đầy đủ, trạng thái Creating và nút Details.*

#### Xác nhận trigger hoạt động

Tiếp bước 17: Xác nhận State: Enabled. Trạng thái này xác nhận event source mapping đã được bật; cần thêm bằng chứng để kết luận Worker xử lý đơn thành công.

![Tên main queue đầy đủ và State: Enabled](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-27.png)

*Hình 5.3.4.27. Tên main queue đầy đủ và State: Enabled.*

### 5.3.4.5 Kiểm tra concurrency của Worker

**Bước 18.** Configuration → Concurrency and recursion detection → giữ Use unreserved account concurrency. Ảnh hiển thị quota 10 và Provisioned concurrency (0); kiểm tra quota trước test tải.

![Chế độ unreserved, giá trị 10 và không có provisioned configuration](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-28.png)

*Hình 5.3.4.28. Chế độ unreserved, giá trị 10 và không có provisioned configuration.*

### 5.3.4.6 Hiểu cơ chế chống overselling

Order API tạo Order PENDING bằng conditional Put. orderId dẫn xuất từ Idempotency-Key; enqueue lease phối hợp retry khi DynamoDB đã ghi Order nhưng chưa chắc SQS đã nhận message.

Worker dùng DynamoDB transaction để giảm stock có điều kiện và chuyển PENDING sang CONFIRMED trong cùng thao tác nguyên tử. Order đã ở trạng thái cuối không được trừ stock lần hai.

Khi hết hàng, transaction riêng kiểm tra thiếu hàng rồi ghi OUT_OF_STOCK. Lỗi kỹ thuật phải được retry; không thay transaction bằng đọc stock → trừ trong Python → ghi đè stock.

HTTP 202 chỉ chứng minh API tiếp nhận đơn. Trigger Enabled chỉ xác nhận mapping đã bật. Kết luận xử lý thành công cần bằng chứng CloudWatch và DynamoDB Orders/Products.

### 5.3.4.7 Kiểm tra POST /orders

**Bước 19.** Lambda API → Test → lưu ManualPostOrderTest: payload 2.0, POST /orders, header idempotency-key là UUIDv4; body có productId và quantity. Seed sản phẩm trước khi thử.

![Event JSON cho POST /orders trong ManualPostOrderTest](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-29.png)

*Hình 5.3.4.29. Event JSON cho POST /orders trong ManualPostOrderTest.*

### 5.3.4.7 Đọc kết quả POST /orders

**Bước 20.** Nhấn Test với ManualPostOrderTest đã lưu → kiểm tra Executing function: succeeded.21. Mở Details → Response: statusCode = 202; body có status = PENDING và orderId. Kết quả chỉ chứng minh API đã tiếp nhận đơn.

![Kết quả bước 20–21: thực thi thành công, HTTP 202 và Order PENDING](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-30.png)

*Hình 5.3.4.30. Kết quả bước 20–21: thực thi thành công, HTTP 202 và Order PENDING.*
