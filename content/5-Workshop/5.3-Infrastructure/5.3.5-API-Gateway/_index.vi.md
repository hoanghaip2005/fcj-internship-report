---
title: "5.3.5 Amazon API Gateway"
weight: 5
draft: false
---

**Bước 5.** 5  Amazon API Gateway và kiểm tra

Mục tiêu: Tạo và kiểm tra HTTP API, routes, $default stage, throttling, CORS, access logging và Invoke URL; test GET trên browser, POST từ frontend origin và kiểm tra trang Orders.

Điều kiện: Đã có Lambda API/Worker, DynamoDB và SQS. Backend dùng Lambda flashrush-manual-api; frontend local khi test là http://localhost:5173.

Cách đọc: Khung xanh chỉ vùng thao tác hoặc giá trị cần kiểm tra. Vòng số xanh, số trắng dùng bước toàn cục 1–19; ảnh cùng bước dùng cùng số. Mỗi hình một trang ngang.

Giá trị cấu hình cần dùng

HTTP API: flashrush-manual-api · us-east-1 · Lambda flashrush-manual-api · payload format version 2.0.

Routes: GET /products; GET /products/{productId}; GET /campaigns; GET /campaigns/{campaignId}; POST /orders; GET /orders/{orderId}. Stage $default, Auto-deploy Enabled; dùng Invoke URL không có /prod.

Throttling: Burst limit = 10; Rate limit = 5 requests/second.

CORS: origins http://localhost:5173, http://127.0.0.1:5173; methods GET, POST, OPTIONS; headers content-type, idempotency-key, x-order-token; Max age = 300; Allow credentials = NO.

Access log destination quan sát được: /aws/apigateway/flashrush-manual.

Giới hạn bằng chứng

Ảnh CORS còn origin 127.0.0.1 trong ô nhập; cần Add rồi Save và chụp trạng thái đã lưu. HTTP 202/PENDING chỉ chứng minh tiếp nhận đơn. Trang Orders hiện đơn demo-* và document 200; chưa có request API Fetch/XHR tương ứng.

**Bước 5.** 5.1 Mở Amazon API Gateway

**Bước 1.** Mở API Gateway tại us-east-1 → trong Get started nhấn Create an API.

![Nút Create an API trên trang API Gateway](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-01.png)

*Hình 5.3.5.1. Nút Create an API trên trang API Gateway.*

**Bước 5.** 5.1 Chọn HTTP API

**Bước 2.** Tại Choose an API type → tìm HTTP API → nhấn Build trong đúng card HTTP API.

![HTTP API và nút Build tương ứng](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-02.png)

*Hình 5.3.5.2. HTTP API và nút Build tương ứng.*

**Bước 5.** 5.1 Nhập tên API

**Bước 3.** Nhập API name = flashrush-manual-api → giữ IPv4 → Add integration. Ảnh chụp trước khi nhập tên; giá trị đã điền xuất hiện ở hình 04.

![Ô API name còn trống, lựa chọn IPv4 và nút Add integration](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-03.png)

*Hình 5.3.5.3. Ô API name còn trống, lựa chọn IPv4 và nút Add integration.*

**Bước 5.** 5.1 Gắn Lambda integration

**Bước 4.** Chọn Lambda → region us-east-1 → Lambda function flashrush-manual-api → Version 2.0 → Next. Ô ARN bị rút gọn trong ảnh; kiểm tra tên đầy đủ ở hình 05/07.

![Loại integration, region, ô Lambda ARN, payload version và Next](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-04.png)

*Hình 5.3.5.4. Loại integration, region, ô Lambda ARN, payload version và Next.*

**Bước 5.** 5.1 Tạo bốn routes

**Bước 5.** Tạo GET /products; GET /products/{productId}; GET /campaigns; GET /campaigns/{campaignId}; POST /orders; GET /orders/{orderId}. Đặt cả bốn Integration target = flashrush-manual-api → Next.

![Bốn cặp method/path cùng trỏ tới Lambda API](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-05.png)

*Hình 5.3.5.5. Bốn cặp method/path cùng trỏ tới Lambda API.*

**Bước 5.** 5.1 Giữ $default stage

**Bước 6.** Giữ Stage name = $default → bật Auto-deploy → Next.

![$default stage và công tắc Auto-deploy đã bật](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-06.png)

*Hình 5.3.5.6. $default stage và công tắc Auto-deploy đã bật.*

**Bước 5.** 5.1 Kiểm tra và tạo API

**Bước 7.** Rà soát API name, Lambda integration, bốn routes và $default (Auto-deploy: enabled) → nhấn Create.

![Giá trị tổng hợp trước khi tạo HTTP API](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-07.png)

*Hình 5.3.5.7. Giá trị tổng hợp trước khi tạo HTTP API.*

**Bước 5.** 5.1 Kiểm tra integrations sau khi tạo

**Bước 8.** Mở Integrations → kiểm tra các routes đang nhìn thấy có nhãn AWS Lambda. Đối chiếu tên backend flashrush-manual-api với hình 05/07; cuộn danh sách để kiểm tra route còn lại.

![API đã tạo và các ánh xạ route/Lambda đang hiển thị](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-08.png)

*Hình 5.3.5.8. API đã tạo và các ánh xạ route/Lambda đang hiển thị.*

**Bước 5.** 5.1 Kiểm tra quyền invoke Lambda

**Bước 9.** Mở Lambda flashrush-manual-api → Configuration → Permissions → Resource-based policy. Kiểm tra Principal apigateway.amazonaws.com, Action lambda:InvokeFunction, Resource đúng Lambda và SourceArn đúng API.

![Policy cho phép API Gateway invoke Lambda; cần test runtime riêng](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-09.png)

*Hình 5.3.5.9. Policy cho phép API Gateway invoke Lambda; cần test runtime riêng.*

**Bước 5.** 5.1 Mở cấu hình throttling

**Bước 10.** Mở Throttling → chọn $default → tại Default route throttling nhấn Edit. Ảnh hiện Burst limit và Rate limit đều Not configured.

![Throttling của $default trước khi cấu hình](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-10.png)

*Hình 5.3.5.10. Throttling của $default trước khi cấu hình.*

**Bước 5.** 5.1 Nhập giới hạn throttling

Tiếp bước 10: Nhập Burst limit = 10; Rate limit = 5 requests/second → Save.

![Burst 10, Rate 5 và nút Save](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-11.png)

*Hình 5.3.5.11. Burst 10, Rate 5 và nút Save.*

**Bước 5.** 5.1 Mở cấu hình CORS

**Bước 11.** Mở CORS → nhấn Configure. Ảnh chụp khi các danh sách origin, header và method còn rỗng.

![Menu CORS và nút Configure trước khi nhập cấu hình](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-12.png)

*Hình 5.3.5.12. Menu CORS và nút Configure trước khi nhập cấu hình.*

**Bước 5.** 5.1 Nhập các trường CORS

Tiếp bước 11: http://127.0.0.1:5173 đang nằm trong ô nhập; phải nhấn Add để biến nó thành origin đã lưu trước khi Save. Giữ localhost:5173; headers content-type, idempotency-key, x-order-token; methods GET, POST, OPTIONS; Max age 300; credentials NO.

![Origin localhost đã thành thẻ; origin 127.0.0.1 còn cần nhấn Add](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-13.png)

*Hình 5.3.5.13. Origin localhost đã thành thẻ; origin 127.0.0.1 còn cần nhấn Add.*

**Bước 5.** 5.1 Đóng hộp Deploy API

**Bước 12.** Với $default và Auto-deploy đã Enabled, không cần deploy thủ công. Đóng hoặc Cancel dialog và kiểm tra Stage details.

![Hộp Deploy API, dropdown Stage và nút Cancel](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-14.png)

*Hình 5.3.5.14. Hộp Deploy API, dropdown Stage và nút Cancel.*

**Bước 5.** 5.1 Xác nhận Stage details

**Bước 13.** Mở Stages → chọn $default → kiểm tra Invoke URL và Automatic Deployment = Enabled.

![Stage $default, Invoke URL và trạng thái Automatic Deployment](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-15.png)

*Hình 5.3.5.15. Stage $default, Invoke URL và trạng thái Automatic Deployment.*

**Bước 5.** 5.1 Kiểm tra access logging

**Bước 14.** Mở Monitor → Logging → kiểm tra Access logging enabled và log destination /aws/apigateway/flashrush-manual. Kiểm tra log format và bảo đảm không chủ động đưa body/token nhạy cảm vào log.

![Access logging đã bật, ARN log group và phần log format nhìn thấy](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-16.png)

*Hình 5.3.5.16. Access logging đã bật, ARN log group và phần log format nhìn thấy.*

**Bước 5.** 5.2 Sao chép Invoke URL

**Bước 15.** Quay lại Stages → $default → chọn và sao chép Invoke URL. Dùng base URL; không thêm /prod.

![Invoke URL của $default được chọn để sao chép](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-17.png)

*Hình 5.3.5.17. Invoke URL của $default được chọn để sao chép.*

**Bước 5.** 5.2 Test GET /products trên trình duyệt

**Bước 16.** Mở YOUR_INVOKE_URL/products → kiểm tra JSON có items và productId = manual-sku-001. stock = 9 tại thời điểm chụp; không coi đây là baseline cố định.

![GET /products trả JSON items qua API Gateway](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-18.png)

*Hình 5.3.5.18. GET /products trả JSON items qua API Gateway.*

**Bước 5.** 5.2 Test GET /products/{productId}

**Bước 17.** Mở YOUR_INVOKE_URL/products/manual-sku-001 → kiểm tra JSON trả về đúng sản phẩm manual-sku-001.

![GET một sản phẩm theo productId](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-19.png)

*Hình 5.3.5.19. GET một sản phẩm theo productId.*

**Bước 5.** 5.2 Test POST /orders từ frontend origin

**Bước 18.** Mở http://localhost:5173 → F12 → Console → dùng fetch POST /orders với Content-Type, Idempotency-Key và body productId/quantity. HTTP 202 + PENDING chỉ chứng minh API đã tiếp nhận đơn.

![POST từ origin localhost trả HTTP 202 và body PENDING](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-20.png)

*Hình 5.3.5.20. POST từ origin localhost trả HTTP 202 và body PENDING.*

**Bước 5.** 5.2 Kiểm tra trang Orders

**Bước 19.** Mở /orders trên frontend. Ảnh chứng minh UI trang Orders tải được và có dữ liệu hiển thị. Nếu nghiệm thu API call từ frontend, chuyển Network sang Fetch/XHR và chụp request /orders hoặc /products.

![UI có đơn mã demo-* “Đã xác nhận”; Network hiện document orders status 200](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-21.png)

*Hình 5.3.5.21. UI có đơn mã demo-* “Đã xác nhận”; Network hiện document orders status 200.*

> **Baseline hiện tại:** tạo đủ 6 public routes gồm GET /products, GET /products/{productId}, GET /campaigns, GET /campaigns/{campaignId}, POST /orders và GET /orders/{orderId}. Ảnh cũ có bốn route không chứng minh đã cấu hình Campaigns. Track guest không tạo route admin hoặc /me; không bật JWT cho guest routes.
