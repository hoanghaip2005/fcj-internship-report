---
title: "5.3.4 AWS Lambda"
weight: 4
draft: false
---




**Mục tiêu:** Order API, Order Worker và SQS trigger.

> **Hình thức:** Tạo thủ công bằng **AWS Management Console**. Các thao tác dưới đây tạo hoặc cập nhật tài nguyên AWS thật và có thể phát sinh phí. Chỉ làm trên bộ `flashrush-manual-*`, không đụng tới `flashrush-lab` của CloudFormation. Ảnh thực hành được trình bày bên dưới; các điểm chưa đủ bằng chứng cần kiểm tra lại trên AWS.

**Điều kiện đầu vào:** Hoàn thành [5.2 Chuẩn bị]({{< relref "/5-Workshop/5.2-Prerequisite/" >}}) và các mục 5.3 đứng trước trang này. Region `us-east-1`; thay `YOUR_AWS_ACCOUNT_ID` bằng Account ID đúng của người thực hành.

### 5.3.4.1 Chuẩn bị code để dán trên web


**Bước 1.** Mở source-snapshot/backend/app.py trong ZIP bằng VS Code hoặc trình soạn thảo văn bản.

![Mở mã nguồn app.py](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-01.png)

*Hình 5.3.4.1. Mở mã nguồn app.py.*


**Bước 2.** Chọn toàn bộ nội dung → Copy.


**Bước 3.** Trong Lambda ở các bước sau, tạo file app.py ở gốc cây source và dán nội dung.


**Bước 4.** Bấm **Deploy** sau khi dán; lưu trong editor chưa đủ nếu chưa deploy.


**Bước 5.** Hai functions dùng cùng app.py nhưng handler khác nhau.

Runtime dùng boto3 đi kèm Lambda Python. Không upload .venv, tests, credentials hoặc frontend vào Lambda.

Nếu thích upload ZIP: trong File Explorer chọn riêng app.py → Compress to ZIP file, mở ZIP kiểm tra app.py ở gốc, rồi Code → Upload from → .zip file. Cách chính trong bài là dán code bằng editor web.

### 5.3.4.2 Tạo Lambda API


**Bước 1.** Lambda → Create function → Author from scratch.

![Mở màn hình tạo Lambda](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-02.png)

*Hình 5.3.4.2. Mở màn hình tạo Lambda.*


**Bước 2.** Function name: `flashrush-manual-api`.


**Bước 3.** Runtime Python 3.12, architecture arm64.


**Bước 4.** Permissions → Use an existing role → `flashrush-manual-api-role`.

![Nhập tên, runtime, ARM64 và execution role API](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-03.png)

*Hình 5.3.4.3. Nhập tên, runtime, ARM64 và execution role API.*

![Nhập tên, runtime, ARM64 và execution role API](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-04.png)

*Hình 5.3.4.4. Nhập tên, runtime, ARM64 và execution role API.*


**Bước 5.** Create function.

![Hoàn tất tạo Lambda API](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-05.png)

*Hình 5.3.4.5. Hoàn tất tạo Lambda API.*


**Bước 6.** Code → cây source → New file → tên **app.py** → dán nội dung từ [mục 5.3.4.1 Lambda code]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.4-Lambda/" >}}) → bấm **Deploy**. Có thể giữ file mẫu lambda_function.py, nhưng handler phải trỏ app.py.

![Dán mã nguồn vào app.py và Deploy](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-06.png)

*Hình 5.3.4.6. Dán mã nguồn vào app.py và Deploy.*


**Bước 7.** Runtime settings → Edit → Handler **app.api** → Save.

![Đổi handler API thành app.api](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-07.png)

*Hình 5.3.4.7. Đổi handler API thành app.api.*

![Đổi handler API thành app.api](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-08.png)

*Hình 5.3.4.8. Đổi handler API thành app.api.*


**Bước 8.** Configuration → General configuration → Memory 256 MB, Timeout 15 seconds.

![Sửa memory 256 MB và timeout 15 giây; ảnh đầu là trước khi sửa](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-09.png)

*Hình 5.3.4.9. Sửa memory 256 MB và timeout 15 giây; ảnh đầu là trước khi sửa.*

![Sửa memory 256 MB và timeout 15 giây; ảnh đầu là trước khi sửa](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-10.png)

*Hình 5.3.4.10. Sửa memory 256 MB và timeout 15 giây; ảnh đầu là trước khi sửa.*


**Bước 9.** Configuration → Environment variables → thêm ba biến ở bảng dưới.

![Thêm và kiểm tra ba biến môi trường](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-11.png)

*Hình 5.3.4.11. Thêm và kiểm tra ba biến môi trường.*

![Thêm và kiểm tra ba biến môi trường](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-12.png)

*Hình 5.3.4.12. Thêm và kiểm tra ba biến môi trường.*

![Thêm và kiểm tra ba biến môi trường](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-13.png)

*Hình 5.3.4.13. Thêm và kiểm tra ba biến môi trường.*

![Thêm và kiểm tra ba biến môi trường](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-14.png)

*Hình 5.3.4.14. Thêm và kiểm tra ba biến môi trường.*


**Bước 10.** Không gắn VPC cho bài lab này. VPC không cần thiết cho DynamoDB/SQS public service endpoints và có thể làm mất kết nối nếu không cấu hình egress.

| Biến | Giá trị cho bài thực hành |
|---|---|
| PRODUCTS_TABLE | flashrush-manual-products |
| ORDERS_TABLE | flashrush-manual-orders |
| QUEUE_URL | Queue URL của flashrush-manual-orders lấy từ Console |

QUEUE_URL là URL, không phải ARN. Không đặt AWS_ACCESS_KEY_ID hay AWS_SECRET_ACCESS_KEY trong Lambda environment; runtime dùng execution role.

### 5.3.4.3 Test API trực tiếp trước khi nối HTTP

**Minh họa thao tác**


![Tạo test GET products và đọc phản hồi 200](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-15.png)

*Hình 5.3.4.15. Tạo test GET products và đọc phản hồi 200.*

![Tạo test GET products và đọc phản hồi 200](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-16.png)

*Hình 5.3.4.16. Tạo test GET products và đọc phản hồi 200.*

![Tạo test GET products và đọc phản hồi 200](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-17.png)

*Hình 5.3.4.17. Tạo test GET products và đọc phản hồi 200.*

![Tạo test GET products và đọc phản hồi 200](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-18.png)

*Hình 5.3.4.18. Tạo test GET products và đọc phản hồi 200.*

Tab Test → Create new event → đặt tên `GetProducts` → dán:

```json
{
  "version": "2.0",
  "rawPath": "/products",
  "headers": {},
  "requestContext": {
    "requestId": "manual-read-test",
    "http": {"method": "GET", "path": "/products"}
  }
}
```

Nhấn Test. Phải có statusCode 200 và body là JSON chứa items. Lambda hiển thị invocation thành công nhưng body statusCode 503 vẫn là lỗi ứng dụng: xem CloudWatch logs và IAM/environment.

### 5.3.4.4 Tạo Lambda Worker

**Minh họa thao tác**


![Kiểm tra tên Lambda Worker và các biến môi trường](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-19.png)

*Hình 5.3.4.19. Kiểm tra tên Lambda Worker và các biến môi trường.*

Lặp lại quy trình tạo với tên `flashrush-manual-worker`, role `flashrush-manual-worker-role`, handler **app.worker**, cùng nội dung app.py đã dán và Deploy, Python 3.12, arm64, 256 MB, timeout 15 giây và cùng ba environment variables.

### 5.3.4.5 Gắn SQS trigger


**Bước 1.** Mở Worker → Add trigger → SQS.

![Mở Add trigger](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-20.png)

*Hình 5.3.4.20. Mở Add trigger.*


**Bước 2.** Chọn queue `flashrush-manual-orders`, không chọn DLQ.

![Xác định main queue, ARN và URL](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-21.png)

*Hình 5.3.4.21. Xác định main queue, ARN và URL.*

![Xác định main queue, ARN và URL](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-22.png)

*Hình 5.3.4.22. Xác định main queue, ARN và URL.*


**Bước 3.** Batch size: **1**.


**Bước 4.** Batch window: **0 seconds**.

![Màn hình tạo mapping còn hiển thị batch size 10; cần đổi thành 1 theo hướng dẫn](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-23.png)

*Hình 5.3.4.23. Màn hình tạo mapping còn hiển thị batch size 10; cần đổi thành 1 theo hướng dẫn.*


**Bước 5.** Bật **Report batch item failures**. Nếu form Add trigger không hiển thị, mở event source mapping sau khi tạo để cập nhật.


**Bước 6.** Maximum concurrency: **5**.

![Đặt concurrency 5 và bật partial batch failures](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-24.png)

*Hình 5.3.4.24. Đặt concurrency 5 và bật partial batch failures.*


**Bước 7.** Enable trigger, chờ state Enabled.

![Theo dõi mapping từ Creating đến Enabled](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-25.png)

*Hình 5.3.4.25. Theo dõi mapping từ Creating đến Enabled.*

![Theo dõi mapping từ Creating đến Enabled](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-26.png)

*Hình 5.3.4.26. Theo dõi mapping từ Creating đến Enabled.*

![Theo dõi mapping từ Creating đến Enabled](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-27.png)

*Hình 5.3.4.27. Theo dõi mapping từ Creating đến Enabled.*


**Bước 8.** Giữ reserved concurrency chưa cấu hình theo baseline; kiểm tra quota toàn tài khoản đủ cho Worker và API.

![Kiểm tra chế độ unreserved concurrency của Worker](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-28.png)

*Hình 5.3.4.28. Kiểm tra chế độ unreserved concurrency của Worker.*

Worker trả batchItemFailures để retry các record lỗi. Lambda có thể ghi nhận invocation không lỗi dù một record cần retry, vì vậy metric Errors đơn lẻ không đủ theo dõi đường này. [Nguồn partial batch response](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html).

### 5.3.4.6 Hiểu cơ chế chống overselling

**Minh họa thao tác**


![Test POST orders: phản hồi 202 và PENDING chỉ xác nhận tiếp nhận](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-29.png)

*Hình 5.3.4.29. Test POST orders: phản hồi 202 và PENDING chỉ xác nhận tiếp nhận.*

![Test POST orders: phản hồi 202 và PENDING chỉ xác nhận tiếp nhận](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-30.png)

*Hình 5.3.4.30. Test POST orders: phản hồi 202 và PENDING chỉ xác nhận tiếp nhận.*

API tạo Orders=PENDING bằng conditional Put; orderId xác định từ idempotency key. Khi gửi SQS, enqueue lease phối hợp retry để xử lý tình huống đã ghi DynamoDB nhưng chưa chắc SQS nhận message.

Worker đọc order hiện tại rồi thực hiện một transaction gồm: giảm stock với điều kiện stock đủ, đồng thời chuyển order từ PENDING sang CONFIRMED. Nếu giao lại message của order đã terminal, Worker không giảm stock nữa. Nếu hết hàng, Worker dùng transaction riêng kiểm tra stock rồi ghi OUT_OF_STOCK. Lỗi kỹ thuật được retry thay vì bị coi thành hết hàng.

Không sửa flow thành đọc stock → trừ trong Python → ghi đè stock, vì nhiều Worker có thể cùng nhìn thấy một lượng tồn kho cũ.

### Code bàn giao và trạng thái enqueue

Lấy `source-snapshot/backend/app.py` trong ZIP, dùng chính xác cùng file cho cả hai functions. ZIP upload chỉ chứa `app.py` ở gốc. Runtime cung cấp boto3; không upload virtualenv/dependencies local thay cho code này.

`202` chỉ có sau ACK SQS hoặc đã ghi SENT. Retry đơn terminal trả `200`; đổi payload cùng key trả `409`; quantity khác 1 trả `400`; enqueue chưa chắc chắn có thể trả `503`. Giữ key/payload cũ khi retry. Lease hết hạn sau 30 giây; tối đa 3 send attempts có điều kiện. Đừng bấm Test liên tục rồi tạo key mới để né lỗi.

Khi update, lưu code cũ cả hai functions trước; deploy API và Worker cùng snapshot, kiểm tra environment vẫn trỏ đúng bộ manual. Không cần artifact bucket riêng cho cách upload trực tiếp Console.




