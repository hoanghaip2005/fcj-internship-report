---
title: "5.5 Kiểm thử và giám sát"
weight: 5
draft: false
---

Thực hiện kiểm thử trên bộ tài nguyên **flashrush-manual** trong vùng **us-east-1**, cùng tài khoản đã sử dụng ở mục 5.3.

**Điều kiện đầu vào:** Hạ tầng 5.3 và frontend 5.4 đã hoạt động. Bài Test trong Lambda hoặc gửi message SQS có thể tạo đơn và làm thay đổi DynamoDB. Chỉ chạy trong bộ `flashrush-manual-*` đã xác nhận.

**Giới hạn:** Bấm Test nhiều lần trên Console không chứng minh 100 yêu cầu đồng thời; kết quả kiểm thử lịch sử từ bộ `flashrush-lab` không được gán cho bộ manual.

## 5.5.1 Test backend bằng nút Test trong Lambda

Các event dưới đây gọi trực tiếp Lambda, kiểm tra Lambda → SQS → Worker → DynamoDB, chưa đi qua API Gateway/CORS. Mục 5.5.2 kiểm tra đường trình duyệt đầy đủ. Các bài này thay đổi dữ liệu lab thật.

### 5.5.1.1 Tạo một đơn

1. Lambda → flashrush-manual-api → **Test** → Create new event.

2. Tên CreateOrderManual; chọn Private nếu có lựa chọn chia sẻ.

3. JSON editor → dán event dưới đây → Save → Test một lần.

4. Execution result → mở body và statusCode, ghi orderId trả về.

```json
{
  "version": "2.0",
  "rawPath": "/orders",
  "headers": {"content-type": "application/json", "idempotency-key": "f2b648ce-807e-47e6-bc5a-968d98fab301"},
  "requestContext": {"requestId": "manual-order-001", "http": {"method": "POST", "path": "/orders"}},
  "body": "{\"productId\":\"manual-sku-001\",\"quantity\":1}",
  "isBase64Encoded": false
}
```

UUID mẫu chỉ dùng cho fixture lab; không dùng làm token dữ liệu thật. Khi bấm Test lại cùng event, đó là retry cùng ý định, không phải đơn mới. API yêu cầu UUIDv4 chữ thường.

Kỳ vọng statusCode 202 lần đầu, có orderId. Nếu order đã terminal từ lần trước, replay có thể trả 200. Invocation thành công nhưng body statusCode 503 vẫn là lỗi nghiệp vụ/kết nối cần điều tra.

### 5.5.1.2 Xem kết quả ở DynamoDB

1. DynamoDB → Tables → Orders manual → Explore table items.

2. Query theo partition key orderId vừa nhận → Run → mở item.

3. Refresh sau vài giây nếu status còn PENDING.

4. Products → Explore items → tìm manual-sku-001.

5. Nếu stock ban đầu 10 và không có đơn khác, kỳ vọng order CONFIRMED, stock=9.

6. Lambda Worker → Monitor → View CloudWatch logs để đối chiếu invocation.

7. Nếu chưa xử lý, kiểm tra Worker → Configuration → Triggers → Enabled, rồi SQS Monitoring.

Không sửa tay status hoặc stock để làm kết quả test đạt. Chờ lâu chưa có nghĩa order FAILED.

### 5.5.1.3 Tra cứu bằng token

Tạo event GetOrderManual, thay YOUR_ORDER_ID ở cả hai vị trí bằng ID thật:

```json
{
  "version": "2.0",
  "rawPath": "/orders/YOUR_ORDER_ID",
  "headers": {"x-order-token": "f2b648ce-807e-47e6-bc5a-968d98fab301"},
  "requestContext": {"requestId": "manual-read-order", "http": {"method": "GET", "path": "/orders/YOUR_ORDER_ID"}}
}
```

Save → Test: kỳ vọng 200 và status cuối. Xóa header x-order-token rồi Test: kỳ vọng 404. Dùng token sai cũng 404.

### 5.5.1.4 Retry và dữ liệu sai

1. Chọn lại CreateOrderManual, giữ nguyên key/body → Test. Cùng orderId, stock không giảm thêm.

2. Tạo bản sao event, giữ key nhưng đổi productId thành manual-sku-other → Test. Với order cũ đã tồn tại, kỳ vọng 409 vì payload khác.

3. Dùng key mới và quantity=2 trong chiến dịch maxQtyPerOrder=1: kỳ vọng 409 CAMPAIGN_QUANTITY_LIMIT. quantity=0 hoặc số thập phân mới là ca validation 400. Không đổi payload của key đã có để kiểm tra riêng quantity.

4. Khôi phục event gốc. Muốn ý định mua mới, dùng UUIDv4 khác.

**Điểm kiểm tra:** đọc sản phẩm, gửi queue, xử lý tồn kho và retry đều hoạt động trước khi dựng website.

## 5.5.2 Kiểm thử toàn hệ thống bằng trình duyệt

### 5.5.2.1 Website tới API tới DynamoDB

1. CloudFront → Distribution manual → copy domain, mở bằng HTTPS.

2. Vào sản phẩm, mua một đơn, chờ UI báo trạng thái cuối, ghi orderId.

3. DynamoDB Orders → tìm đúng ID; Products → kiểm tra stock giảm một lần so với trước.

4. Refresh trực tiếp trang sản phẩm và /orders: không bị AccessDenied.

5. Mở /assets/does-not-exist.js: phải là lỗi, không trả index HTML 200.

6. Mở object S3 URL ở cửa sổ ẩn danh: bị từ chối là đúng.

7. Nếu cần, F12 → Network → Fetch/XHR để thấy products/orders gọi đúng API manual. Che token trước khi chụp evidence.

### 5.5.2.2 Hiểu tồn kho bằng ba ý định mua

1. DynamoDB Products → Create item theo mẫu mục 5.3.1.3, đổi productId thành manual-stock-two-001, stock và initialStock thành 2, saleEndsAt trong tương lai.

2. Lambda API → Test, tạo ba event POST theo mục 5.5.1.1, cùng productId mới, ba keys khác nhau trong bảng.

3. Test lần lượt ba event; lưu ba orderId; chờ Worker xử lý.

4. DynamoDB: kỳ vọng hai CONFIRMED, stock=0; ý định thứ ba có thể bị từ chối 409 ngay khi intake hoặc được nhận rồi OUT_OF_STOCK ở Worker. Không bắt buộc cả ba request trả 202.

5. Test lại event A giữ nguyên key: cùng orderId, không trừ kho thêm.

| Event | Key mẫu chỉ dùng cho fixture lab |
|---|---|
| StockTwoA | 37c295a6-ae82-483c-b6c3-62cc0c788101 |
| StockTwoB | 37c295a6-ae82-483c-b6c3-62cc0c788102 |
| StockTwoC | 37c295a6-ae82-483c-b6c3-62cc0c788103 |

Bài này kiểm tra chức năng tuần tự, không phải benchmark 100 request đồng thời. Bấm Test nhiều lần bằng tay không bảo đảm concurrent load.

### 5.5.2.3 Worker nhận message trùng

1. Dùng fixture riêng stock=2, tạo một đơn, đợi CONFIRMED và stock còn 1.

2. Mở Orders item, ghi orderId, productId, quantity và correlationId.

3. SQS → queue chính manual → Send and receive messages.

4. Dán body bên dưới, thay các placeholder bằng dữ liệu order thật → Send message.

```json
{
  "schemaVersion": "1.0",
  "orderId": "YOUR_CONFIRMED_ORDER_ID",
  "productId": "YOUR_FIXTURE_PRODUCT_ID",
  "quantity": 1,
  "correlationId": "YOUR_ORDER_CORRELATION_ID"
}
```

5. CloudWatch Worker logs → tìm worker_terminal_noop với đúng orderId.

6. Sau khi có bằng chứng xử lý bản trùng, kiểm tra stock vẫn 1 và status CONFIRMED.

7. Không chỉ nhìn stock ngay sau khi Send rồi kết luận khi Worker chưa chạy.

### 5.5.2.4 Kiểm tra retry và DLQ nâng cao

Chỉ làm trên bộ manual riêng, khi không có người khác demo và có thời gian theo dõi đến hết.

1. Ghi số message DLQ trước test.

2. Queue chính → Send đúng một message: `{"schemaVersion":"invalid","labTest":"dlq-retry-manual-001"}`.

3. Xem Worker log worker_retry; mapping phải bật ReportBatchItemFailures.

4. Chờ các lần nhận thất bại theo visibility 90 giây và maxReceiveCount=5. Cần nhiều phút, không có thời gian hoàn tất chính xác cố định.

5. DLQ → Poll for messages → tìm body test. Poll làm message tạm ẩn, có thể ảnh hưởng metric visible.

6. Lưu evidence và xóa riêng message sai có nhãn đó; không redrive message cố ý sai schema vì sẽ lỗi tiếp.

7. Kiểm tra queue và alarms ổn định, không Purge cả queue.

Bài này không có order tương ứng, chỉ kiểm tra retry/DLQ, không chứng minh phục hồi order PENDING. Message vào DLQ không tự chuyển Orders thành FAILED.

### 5.5.2.5 Bằng chứng cần lưu

Ghi thời gian, account/region, productId fixture, stock trước/sau, orderId và trạng thái, log duplicate và alarm history. Chụp màn hình kết quả thực tế, che token. Không dùng dashboard React mock làm bằng chứng AWS.

## 5.5.3 Kiểm tra đường CloudWatch Alarm → SNS → Email

Thực hiện trên bộ manual riêng khi các đơn bình thường đã xử lý. Bài này đưa trực tiếp một message test vào DLQ để kiểm tra metric → alarm → SNS, chưa chứng minh redrive từ queue chính.

1. SQS → flashrush-manual-dlq → **Send and receive messages**.

2. Body: `{"labTest":"notification-only","runId":"manual-alert-001"}`.

3. Bấm Send message đúng một lần vào DLQ, không phải queue chính.

4. CloudWatch → Alarms → flashrush-manual-dlqalarm.

5. Chờ metric và đánh giá alarm; có thể mất vài phút hoặc lâu hơn khi queue vừa hoạt động lại. Không gửi thêm message liên tục.

6. Refresh, kiểm tra ALARM; History có action SNS thành công.

7. Mở inbox/spam, xác nhận email đến.

8. Quay lại DLQ → Send and receive messages → Poll for messages.

9. Mở message, xác minh body đúng runId manual-alert-001; chỉ chọn message đó → Delete → xác nhận.

10. Không dùng Purge queue vì có thể xóa message khác.

11. Chờ alarm về OK khi metric giảm. Nếu còn message thật, điều tra, không ép OK để che lỗi.

12. Ghi riêng kết quả SNS action và nhận thư.

Nếu chỉ dùng SNS Publish message ở mục 5.3.8.3, đó chỉ kiểm tra SNS → email; không thay thế bài metric alarm này.

## 5.5.4 Xử lý lỗi trên Console

| Hiện tượng | Mở ở đâu | Kiểm tra |
|---|---|---|
| ImportModuleError | Lambda Code và Runtime settings | app.py ở gốc, app.api/app.worker đúng, đã Deploy |
| Execution thành công nhưng body 503 | Lambda result, CloudWatch | Quyền, environment, tên bảng/queue |
| Không có log | IAM và log group | Group đã tạo, ARN đúng, có invocation |
| Worker AccessDenied | Worker role | GetItem/UpdateItem/ConditionCheckItem trên đúng bảng |
| Đơn luôn PENDING | Worker Triggers, SQS Monitoring | Enabled, đúng queue, quyền và concurrency |
| Message lỗi mất không vào DLQ | Event source mapping | ReportBatchItemFailures bật |
| HTTP 404 | API Routes và Stages | Method/path đúng, $default không thêm /prod |
| HTTP 500/503 | Integration, Lambda permissions/logs | Payload 2.0, invoke permission và runtime |
| Browser lỗi CORS | API CORS | Origin HTTPS đúng, headers đủ |
| HTTP 429 | Stage throttling | Chờ retry, giữ key cho cùng ý định |
| CloudFront 403 | Origin, OAC, S3 policy | REST origin, SourceArn đúng, index ở gốc |
| Refresh route 403 | Function và Behaviors | Function LIVE, Viewer request association |
| JS trả HTML | S3 MIME, rewrite | Không rewrite assets, không biến mọi lỗi thành 200 |
| Website dùng API cũ/mock | Build config, invalidation | Build lại đúng URL manual, upload, invalidate |
| Email không đến | SNS, Alarm History | Confirm, topic policy, alarm action, spam |
| Tên đã tồn tại | Danh sách dịch vụ | Xác minh owner/prefix trước khi dùng lại |

Kiểm tra theo lớp: Lambda Test → GET HTTP → website. Không sửa nhiều lớp cùng lúc khi chưa xác định lỗi.

## 5.5.5 Checklist nghiệm thu demo

- [ ] DynamoDB: ba bảng ACTIVE, partition keys đúng, stock kiểu Number.

- [ ] SQS: Standard, DLQ, visibility 90 giây, maxReceiveCount=5.

- [ ] IAM: hai roles riêng, trust Lambda, quyền theo nhiệm vụ.

- [ ] Lambda: đủ năm module đã Deploy, handlers đúng, mapping Enabled và partial failures bật.

- [ ] API Gateway: sáu public routes, payload 2.0, CORS đúng.

- [ ] S3: dist ở đúng gốc, bucket private, MIME đúng.

- [ ] CloudFront: OAC, policy đúng, HTTPS, Function LIVE, refresh route được.

- [ ] SNS: subscription Confirmed, đã kiểm tra nhận email.

- [ ] CloudWatch: logs retention 7 ngày, ba alarms đúng dimensions.

- [ ] Website gọi API manual, đơn terminal và tồn kho đúng.

- [ ] Retry và message trùng không giảm stock lần hai.

- [ ] Không gọi test tuần tự là benchmark concurrency.

- [ ] Có evidence và inventory để cleanup đúng bộ manual.

## 5.5.6 Ảnh và bằng chứng bắt buộc

Ảnh Lambda Test, Orders CONFIRMED, Products, SNS Confirmed và các cấu hình CloudWatch đã có trong [các bài dịch vụ 5.3]({{< relref "/5-Workshop/5.3-Infrastructure/" >}}). Khi nghiệm thu, vẫn cần đối chiếu cùng một lần kiểm thử: stock trước/sau, order ID, Worker logs và Alarm History với email tương ứng.

Ghi lại mã sản phẩm và số lượng tồn trước/sau, `orderId`, trạng thái cuối và thời gian UTC; không công khai giá trị Idempotency-Key/X-Order-Token của đơn thật.

**Checkpoint:** Có ít nhất một đơn CONFIRMED, một bài test idempotency replay và một bài kiểm tra alert ghi nhận kết quả. Các bài nâng cao chỉ đánh dấu PASS nếu thực sự chạy và có bằng chứng.

## PENDING lâu và giới hạn bằng chứng

1. Ghi thời điểm, orderId, createdAt/updatedAt, enqueueState/attempt count; che token/hash khỏi ảnh chia sẻ.
2. Sau khoảng 300 giây vẫn PENDING, điều tra IAM, trigger, queue, DLQ, logs. 300 giây là ngưỡng vận hành tham khảo, không phải SLA.
3. Nếu SENT, kiểm tra Worker trước. Nếu UNKNOWN/SENDING, kiểm tra lease và khả năng SQS đã nhận; không gửi message thủ công ngẫu nhiên hoặc sửa order thành CONFIRMED.
4. Retry POST chỉ với key/payload gốc theo cơ chế API; hết giới hạn gửi cần người phụ trách điều tra. Bài manual không triển khai job reconciliation tự động.
5. Chỉ đánh dấu PASS khi thu được kết quả thật. Bộ lab trước đây có bằng chứng 100 đơn (10 CONFIRMED, 90 OUT_OF_STOCK), chạy tối đa 10 workers phía client; không phải 100 request đồng thời và không chứng minh bộ manual mới.

Mẫu ghi nhận: thời gian UTC, namespace/account/region, ca kiểm thử, stock trước/sau, orderId, HTTP/status, log xác nhận, PASS/FAIL/chưa chạy. Lưu riêng token; không đưa vào báo cáo công khai.

> Mỗi fixture mới phải được thêm vào productIds của chiến dịch đang hiệu lực, maxQtyPerOrder=1; chỉ tạo Products mà không có Campaigns sẽ bị từ chối. Bài test tuần tự không chứng minh tải đồng thời.


## Cấu hình mở rộng bắt buộc — cập nhật 28/11/2026

Các ảnh/bước guest cũ trên trang này chỉ là nền tảng. Để dựng **đầy đủ project hiện tại**, áp dụng cấu hình bên dưới và [5.3.10 Cognito]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}}). Không dùng User Pool/client/bảng của lab cho bộ manual khác.


## Bổ sung nghiệm thu feature

Chỉ đọc trước: anonymous products/campaigns 200, protected `/me/profile` 401; JWT route/scope/CORS đúng. Test có login/logout làm thay đổi phiên xác thực, test mua làm thay đổi dữ liệu: dùng tài khoản/fixture được owner duyệt.

- Khách xác minh email → `/auth` → `/account`; profile/cart/history chỉ của chủ tài khoản.
- Owner login cùng màn → `/admin`; warehouse không sửa campaign/product, support không quản lý user, customer không ghi admin.
- Thêm cart, quote voucher, checkout cùng key/payload khi retry; đối chiếu subtotal/discount/net tại server và order.
- Với voucher quota cuối: hai intent cạnh tranh tối đa một redemption; stock/usedCount không đổi nếu đơn thất bại; replay không trừ thêm.
- Đăng xuất xóa cả phiên khách/staff; không để session còn quyền ở cửa sổ vừa đăng xuất.
- Monitoring hiển thị source CloudWatch và đúng region; thiếu datapoint không gọi là 0.

Không gửi email đăng ký/invite hoặc tạo đơn thật chỉ để chụp ảnh khi chưa có phạm vi duyệt. Lưu ảnh màn hình đã che thông tin nhạy cảm cùng commit/time/namespace và expected/actual.

### Cognito mapping

Tách 401 token/email/client, 403 role và 5xx IAM/config. Kiểm tra riêng owner, customer, nhân viên hạn quyền; deep link SPA 200 không chứng minh phân quyền. [Mapping Cognito]({{< relref "/5-Workshop/5.7-Baseline-and-evidence/" >}})
