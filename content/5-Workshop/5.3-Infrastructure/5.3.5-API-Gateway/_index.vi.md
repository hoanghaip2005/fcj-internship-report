---
title: "5.3.5 Amazon API Gateway"
weight: 5
draft: false
---




**Mục tiêu:** HTTP API, routes, CORS và access logs.

> **Hình thức:** Tạo thủ công bằng **AWS Management Console**. Các thao tác dưới đây tạo hoặc cập nhật tài nguyên AWS thật và có thể phát sinh phí. Chỉ làm trên bộ `flashrush-manual-*`, không đụng tới `flashrush-lab` của CloudFormation. Ảnh thực hành được trình bày bên dưới; các điểm chưa đủ bằng chứng cần kiểm tra lại trên AWS.

**Điều kiện đầu vào:** Hoàn thành [5.2 Chuẩn bị]({{< relref "/5-Workshop/5.2-Prerequisite/" >}}) và các mục 5.3 đứng trước trang này. Region `us-east-1`; thay `YOUR_AWS_ACCOUNT_ID` bằng Account ID đúng của người thực hành.

### 5.3.5.1 Tạo API và integration


**Bước 1.** API Gateway → Create API → **HTTP API** → Build.

![Mở API Gateway và chọn HTTP API](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-01.png)

*Hình 5.3.5.1. Mở API Gateway và chọn HTTP API.*

![Mở API Gateway và chọn HTTP API](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-02.png)

*Hình 5.3.5.2. Mở API Gateway và chọn HTTP API.*


**Bước 2.** Integration: Lambda, Region us-east-1, chọn `flashrush-manual-api`.


**Bước 3.** API name: `flashrush-manual-api`.

![Ô nhập tên API](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-03.png)

*Hình 5.3.5.3. Ô nhập tên API.*


**Bước 4.** Integration dùng Lambda proxy, payload format **2.0**; timeout 20.000 ms nếu cấu hình tùy chọn này.

![Chọn Lambda integration và payload format 2.0](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-04.png)

*Hình 5.3.5.4. Chọn Lambda integration và payload format 2.0.*


**Bước 5.** Tạo bốn routes bên dưới, cùng trỏ đến API Lambda.

![Bốn routes của HTTP API](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-05.png)

*Hình 5.3.5.5. Bốn routes của HTTP API.*

| Method | Path | Kết quả |
|---|---|---|
| GET | /products | Danh sách sản phẩm |
| GET | /products/{productId} | Một sản phẩm |
| POST | /orders | Tiếp nhận đơn |
| GET | /orders/{orderId} | Tra cứu đơn bằng token header |


**Bước 6.** Stage: `$default`, bật Auto-deploy. Với stage này API URL không có hậu tố /prod.

![Tạo default stage tự triển khai và kiểm tra integrations](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-06.png)

*Hình 5.3.5.6. Tạo default stage tự triển khai và kiểm tra integrations.*

![Tạo default stage tự triển khai và kiểm tra integrations](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-07.png)

*Hình 5.3.5.7. Tạo default stage tự triển khai và kiểm tra integrations.*

![Tạo default stage tự triển khai và kiểm tra integrations](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-08.png)

*Hình 5.3.5.8. Tạo default stage tự triển khai và kiểm tra integrations.*


**Bước 7.** Stage throttling: rate 5 requests/second, burst 10 để khớp lab.

![Cấu hình rate 5 và burst 10; ảnh đầu chưa cấu hình](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-10.png)

*Hình 5.3.5.10. Cấu hình rate 5 và burst 10; ảnh đầu chưa cấu hình.*

![Cấu hình rate 5 và burst 10; ảnh đầu chưa cấu hình](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-11.png)

*Hình 5.3.5.11. Cấu hình rate 5 và burst 10; ảnh đầu chưa cấu hình.*


**Bước 8.** Kiểm tra Lambda → Configuration → Permissions → Resource-based policy có quyền invoke cho `apigateway.amazonaws.com`, giới hạn SourceArn thuộc API này. Console thường tạo khi gắn integration; nếu thiếu, thêm trigger API Gateway đúng API hoặc thêm invoke permission có giới hạn.

![Đối chiếu resource-based policy cho API Gateway](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-09.png)

*Hình 5.3.5.9. Đối chiếu resource-based policy cho API Gateway.*

### 5.3.5.2 Cấu hình CORS

**Minh họa thao tác**


![Cấu hình CORS; origin 127.0.0.1 còn trong ô nhập cần Add và Save](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-12.png)

*Hình 5.3.5.12. Cấu hình CORS; origin 127.0.0.1 còn trong ô nhập cần Add và Save.*

![Cấu hình CORS; origin 127.0.0.1 còn trong ô nhập cần Add và Save](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-13.png)

*Hình 5.3.5.13. Cấu hình CORS; origin 127.0.0.1 còn trong ô nhập cần Add và Save.*

![Cấu hình CORS; origin 127.0.0.1 còn trong ô nhập cần Add và Save](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-14.png)

*Hình 5.3.5.14. Cấu hình CORS; origin 127.0.0.1 còn trong ô nhập cần Add và Save.*

API → CORS → Configure:

- Allow origins: `http://localhost:5173` và `http://127.0.0.1:5173`.

- Allow methods: GET, POST, OPTIONS.

- Allow headers: content-type, idempotency-key, x-order-token.

- Max age: 300 giây.

- Không bật credentials vì flow hiện không dùng cookie authentication.

Sau khi có CloudFront domain ở [mục 5.3.7 CloudFront]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.7-CloudFront/" >}}), thêm chính xác origin HTTPS của website, không có dấu / cuối. HTTP API tự xử lý preflight theo cấu hình CORS; không cần tạo Lambda OPTIONS riêng cho flow này. CORS là quy tắc trình duyệt, không thay cho xác thực API. [Nguồn cấu hình CORS](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html).

### 5.3.5.3 Bật access logs

**Minh họa thao tác**


![Kiểm tra default stage và access logging](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-15.png)

*Hình 5.3.5.15. Kiểm tra default stage và access logging.*

![Kiểm tra default stage và access logging](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-16.png)

*Hình 5.3.5.16. Kiểm tra default stage và access logging.*

Stage → Logs → Enable access logging → chọn log group `/aws/apigateway/flashrush-manual`. Dùng format:

```json
{"requestId":"$context.requestId","status":"$context.status","routeKey":"$context.routeKey","latency":"$context.responseLatency"}
```

Không ghi token hoặc body đơn vào access logs.


**Bước 1.** API Gateway → Stages → $default → sao chép **Invoke URL/API endpoint**.

![Sao chép Invoke URL](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-17.png)

*Hình 5.3.5.17. Sao chép Invoke URL.*


**Bước 2.** Mở tab trình duyệt mới, dán endpoint rồi thêm `/products`.


**Bước 3.** Ví dụ: `https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/products`.


**Bước 4.** Phải thấy JSON có items. Lưu endpoint không có /products để build React.

![GET danh sách và chi tiết sản phẩm trả JSON](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-18.png)

*Hình 5.3.5.18. GET danh sách và chi tiết sản phẩm trả JSON.*

![GET danh sách và chi tiết sản phẩm trả JSON](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-19.png)

*Hình 5.3.5.19. GET danh sách và chi tiết sản phẩm trả JSON.*


**Bước 5.** API kiểu HTTP không dùng quy trình nút Test của REST API. Kiểm tra POST bằng Lambda Test ở [mục 5.5.1 Lambda Test]({{< relref "/5-Workshop/5.5-Testing-and-monitoring/" >}}), rồi website ở [mục 5.5.2 Kiểm thử trình duyệt]({{< relref "/5-Workshop/5.5-Testing-and-monitoring/" >}}) để kiểm tra cả API Gateway.

![POST nhận 202 PENDING; trang Orders có đơn demo, chưa chứng minh đơn thật](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-20.png)

*Hình 5.3.5.20. POST nhận 202 PENDING; trang Orders có đơn demo, chưa chứng minh đơn thật.*

![POST nhận 202 PENDING; trang Orders có đơn demo, chưa chứng minh đơn thật](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-21.png)

*Hình 5.3.5.21. POST nhận 202 PENDING; trang Orders có đơn demo, chưa chứng minh đơn thật.*

**Điểm kiểm tra:** GET trả items chứa manual-sku-001; gọi URL API từ trình duyệt không báo 500/503. Không mở frontend trước khi đọc sản phẩm qua HTTP hoạt động.

