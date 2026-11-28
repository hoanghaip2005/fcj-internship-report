---
title: "5.3.9 Amazon CloudWatch"
weight: 9
draft: false
---

### Mục tiêu thực hành

Trong phần này, người thực hành sẽ triển khai và cấu hình Amazon CloudWatch để giám sát hoạt động của hệ thống FLASHRUSH trên AWS.

Amazon CloudWatch cung cấp các chức năng thu thập nhật ký hoạt động (Logs), theo dõi chỉ số hiệu năng (Metrics) và thiết lập cảnh báo (Alarms) khi hệ thống phát sinh sự cố.

Sau khi hoàn thành, người thực hành có thể:

- Kiểm tra CloudWatch Logs của Lambda API, Lambda Worker và API Gateway.
- Theo dõi các chỉ số hoạt động của Amazon SQS và AWS Lambda.
- Tạo ba CloudWatch Alarms để phát hiện các tình huống bất thường.
- Kết nối CloudWatch Alarms với Amazon SNS để gửi thông báo qua email.
- Kiểm tra trạng thái các Alarms và thu thập bằng chứng triển khai.

Lưu ý: Hướng dẫn sử dụng namespace flashrush-manual trong Region us-east-1. Các thao tác được thực hiện thủ công bằng AWS Management Console và có thể phát sinh chi phí. Chỉ thao tác trên tài nguyên flashrush-manual của bài thực hành.

### Điều kiện tiên quyết

Trước khi thực hiện, cần bảo đảm:

- Có tài khoản AWS và quyền truy cập Amazon CloudWatch.
- Đã đăng nhập AWS Management Console.
- Region đang sử dụng là US East (N. Virginia) us-east-1.
- Đã triển khai Lambda API và Lambda Worker.
- Đã tạo Amazon SQS Queue và Dead-Letter Queue (DLQ).
- Đã cấu hình Amazon API Gateway và Access Logging.
- Đã tạo Amazon SNS Topic flashrush-manual-alerts và xác nhận Email Subscription.

Các tài nguyên được sử dụng:

| Thành phần | Tên tài nguyên |
|---|---|
| AWS Region | us-east-1 |
| Lambda API | flashrush-manual-api |
| Lambda Worker | flashrush-manual-worker |
| SQS Queue | flashrush-manual-orders |
| SQS DLQ | flashrush-manual-dlq |
| SNS Topic | flashrush-manual-alerts |
| Monitoring | Amazon CloudWatch |

### Quy trình triển khai

### 5.3.9.1 Truy cập Amazon CloudWatch

**Bước 1.** Đăng nhập AWS Management Console tại https://console.aws.amazon.com/.

![Mở AWS Console](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-001.png)

*Hình 5.3.9.1. Mở AWS Console.*

**Bước 2.** Tại thanh tìm kiếm AWS, nhập từ khóa CloudWatch.

![Tìm CloudWatch](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-02.png)

*Hình 5.3.9.2. Tìm CloudWatch.*

**Bước 3.** Chọn dịch vụ CloudWatch trong kết quả tìm kiếm.

**Bước 4.** Kiểm tra Region ở góc trên bên phải, bảo đảm đang sử dụng us-east-1.

**Bước 5.** Quan sát thanh điều hướng bên trái của CloudWatch, xác định các nhóm chức năng:

Logs

Metrics

Alarms

![CloudWatch và menu Logs, Metrics, Alarms](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-003.png)

*Hình 5.3.9.3. CloudWatch và menu Logs, Metrics, Alarms.*

### 5.3.9.2 Kiểm tra CloudWatch Logs của Lambda API

CloudWatch Logs được sử dụng để ghi nhận thông tin thực thi, lỗi và các sự kiện phát sinh trong quá trình Lambda hoạt động.

**Bước 1.** Trong menu CloudWatch, chọn Logs → Log groups.

![Mở Log groups](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-004.png)

*Hình 5.3.9.4. Mở Log groups.*

**Bước 2.** Trong danh sách Log groups, tìm:

/aws/lambda/flashrush-manual-api

![Chọn Lambda API log group](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-005.png)

*Hình 5.3.9.5. Chọn Lambda API log group.*

**Bước 3.** Nhấn vào tên Log group.

**Bước 4.** Chọn một Log stream tương ứng với thời điểm Lambda được gọi gần nhất.

![Chọn API log stream](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-006.png)

*Hình 5.3.9.6. Chọn API log stream.*

**Bước 5.** Kiểm tra các thông tin nhật ký.

Một Lambda invocation thường có các dòng tương tự:

START RequestId: ...

END RequestId: ...

REPORT RequestId: ...

Các thông tin này hỗ trợ xác định thời gian thực thi, mức sử dụng bộ nhớ và trạng thái invocation.

Tuy nhiên, Lambda invocation thành công không đồng nghĩa nghiệp vụ ứng dụng thành công. Cần đối chiếu thêm HTTP status và nội dung response của hệ thống.

**Bước 6.** Nếu chưa xuất hiện log, truy cập:

Lambda → Functions → flashrush-manual-api → Test.

Sử dụng Test Event GetProducts:

```json
{
"version": "2.0",
"rawPath": "/products",
"headers": {},
"requestContext": {
"requestId": "manual-read-test",
"http": {
"method": "GET",
"path": "/products"
}
}
}
```

Nhấn Test để gọi Lambda.

Sau đó quay lại CloudWatch Logs, làm mới danh sách Log streams và kiểm tra bản ghi tương ứng.

![Log API sau Test Event](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-007.png)

*Hình 5.3.9.7. Log API sau Test Event.*

### 5.3.9.3 Kiểm tra CloudWatch Logs của Lambda Worker

Lambda Worker chịu trách nhiệm xử lý các đơn hàng được đưa vào hàng đợi SQS.

**Bước 1.** Quay lại CloudWatch → Logs → Log groups.

**Bước 2.** Tìm Log group:

/aws/lambda/flashrush-manual-worker

**Bước 3.** Nhấn vào Log group và mở Log stream phù hợp với thời điểm kiểm thử đơn hàng.

**Bước 4.** Kiểm tra các thông tin thực thi và thông báo lỗi nếu có.

Trong FLASHRUSH, cần chú ý những sự kiện:

worker_retry: Worker cần thử xử lý lại do gặp lỗi.

worker_terminal_noop: Worker nhận lại message của đơn hàng đã ở trạng thái kết thúc và không thực hiện giảm tồn kho lần nữa.

**Bước 5.** Sử dụng chức năng Search all log streams để tìm kiếm các thông báo trên.

**Bước 6.** Điều chỉnh khoảng thời gian tìm kiếm phù hợp với lần kiểm thử.

Các thông báo trên chỉ xuất hiện khi source code thực tế ghi log và hệ thống đã thực thi qua nhánh xử lý tương ứng.

![Các log stream của Worker](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-008.png)

*Hình 5.3.9.8. Các log stream của Worker.*

Ảnh mới cho thấy đúng log group /aws/lambda/flashrush-manual-worker và hai log stream có thời điểm sự kiện UTC. Mở stream khớp với lần kiểm thử để xem Log events và chụp bản ghi thực thi.

### 5.3.9.4 Kiểm tra API Gateway Access Logs

API Gateway Access Logs hỗ trợ giám sát các HTTP request đi vào hệ thống.

**Bước 1.** Trong CloudWatch, mở Logs → Log groups.

**Bước 2.** Tìm Log group được cấu hình cho API Gateway trong mục 5.3.5.

![Chọn API Gateway access log group](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-009.png)

*Hình 5.3.9.9. Chọn API Gateway access log group.*

**Bước 3.** Mở Log stream tương ứng với thời gian gửi request.

**Bước 4.** Kiểm tra các thông tin được cấu hình trong Access Log, chẳng hạn:

Request ID

HTTP method

Request path

HTTP status

Request time

**Bước 5.** Đối chiếu HTTP status với kết quả gọi API.

Nếu chưa có Access Logs, kiểm tra lại cấu hình Access Logging tại API Gateway Stage và quyền ghi log.

![Mở access log stream](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-010.png)

*Hình 5.3.9.10. Mở access log stream.*

![Request ID và HTTP status trong access logs](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-011.png)

*Hình 5.3.9.11. Request ID và HTTP status trong access logs.*

Lưu ý: Khi thu thập bằng chứng, cần ghi nhận thời gian UTC của bản ghi log. Giờ Việt Nam là UTC+7.

### 5.3.9.5 Tạo CloudWatch Alarm giám sát Dead-Letter Queue

Alarm đầu tiên được sử dụng để phát hiện các message xuất hiện trong Dead-Letter Queue.

Tên Alarm:

flashrush-manual-dlqalarm

**Bước 1.** Trong menu CloudWatch, chọn Alarms → All alarms.

![Mở danh sách alarms](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-012.png)

*Hình 5.3.9.12. Mở danh sách alarms.*

**Bước 2.** Nhấn Create alarm.

**Bước 3.** Chọn Select metric.

![Chọn Create alarm và Select metric](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-013.png)

*Hình 5.3.9.13. Chọn Create alarm và Select metric.*

**Bước 4.** Trong danh sách namespaces, chọn SQS (AWS/SQS).

**Bước 5.** Chọn nhóm metric theo Queue Name.

**Bước 6.** Tìm queue:

flashrush-manual-dlq

**Bước 7.** Chọn metric:

ApproximateNumberOfMessagesVisible

Metric này phản ánh số lượng message đang có thể nhận từ hàng đợi.

![Chọn metric DLQ đúng QueueName](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-014.png)

*Hình 5.3.9.14. Chọn metric DLQ đúng QueueName.*

Chọn dòng đã khoanh xanh với QueueName = flashrush-manual-dlq và metric ApproximateNumberOfMessagesVisible, rồi bấm Select metric ở Bước 8.

**Bước 8.** Nhấn Select metric.

**Bước 9.** Cấu hình Metric và Conditions:

| Thông số | Giá trị |
|---|---|
| Namespace | AWS/SQS |
| Metric | ApproximateNumberOfMessagesVisible |
| Dimension | QueueName=flashrush-manual-dlq |
| Statistic | Maximum |
| Period | 1 minute |
| Threshold type | Static |
| Condition | Greater/Equal |
| Threshold value | 1 |
| Evaluation periods | 1 |
| Datapoints to alarm | 1 out of 1 |
| Missing data | Treat missing data as good (not breaching threshold) |

Như vậy, khi DLQ có ít nhất một message và metric đáp ứng điều kiện đánh giá, Alarm có thể chuyển sang trạng thái ALARM.

![Điều kiện DLQ và missing data notBreaching](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-015.png)

*Hình 5.3.9.15. Điều kiện DLQ và missing data notBreaching.*

Ảnh cấu hình DLQ cho thấy đúng queue flashrush-manual-dlq, Maximum, 1 minute, ngưỡng ≥ 1, 1 out of 1 và Treat missing data as good (not breaching threshold).

**Bước 10.** Nhấn Next để cấu hình thông báo.

**Bước 11.** Tại phần Notification:

Alarm state trigger: In alarm

Notification: Select an existing SNS topic

SNS Topic: flashrush-manual-alerts

Bảo đảm Alarm actions được bật.

![Chọn SNS action cho DLQ alarm](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-016.png)

*Hình 5.3.9.16. Chọn SNS action cho DLQ alarm.*

**Bước 12.** Nhấn Next và nhập Alarm name:

flashrush-manual-dlqalarm

![Đặt tên DLQ alarm](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-017.png)

*Hình 5.3.9.17. Đặt tên DLQ alarm.*

**Bước 13.** Kiểm tra cấu hình và nhấn Create alarm.

![Rà soát và tạo DLQ alarm](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-018.png)

*Hình 5.3.9.18. Rà soát và tạo DLQ alarm.*

![Thông báo tạo alarm](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-21.png)

*Hình 5.3.9.19. Thông báo tạo alarm.*

![Chi tiết DLQ alarm](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-020.png)

*Hình 5.3.9.20. Chi tiết DLQ alarm.*

### 5.3.9.6 Tạo CloudWatch Alarm giám sát Lambda Worker Errors

Alarm thứ hai được sử dụng để theo dõi số lần Lambda Worker gặp lỗi thực thi.

Tên Alarm:

flashrush-manual-workererroralarm

**Bước 1.** Truy cập CloudWatch → Alarms → All alarms → Create alarm.

![Tạo Worker Errors alarm](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-021.png)

*Hình 5.3.9.21. Tạo Worker Errors alarm.*

**Bước 2.** Chọn Select metric.

![Mở bộ chọn metric](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-022.png)

*Hình 5.3.9.22. Mở bộ chọn metric.*

**Bước 3.** Chọn namespace Lambda (AWS/Lambda).

![Chọn AWS/Lambda](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-25.png)

*Hình 5.3.9.23. Chọn AWS/Lambda.*

**Bước 4.** Chọn nhóm metric By Function Name.

![Chọn By Function Name](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-26.png)

*Hình 5.3.9.24. Chọn By Function Name.*

**Bước 5.** Tìm Lambda Function:

flashrush-manual-worker

![Chọn đúng Worker](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-27.png)

*Hình 5.3.9.25. Chọn đúng Worker.*

**Bước 6.** Chọn metric Errors.

![Chọn metric Errors](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-026.png)

*Hình 5.3.9.26. Chọn metric Errors.*

Ảnh ở Bước 6 minh họa cách chọn metric Errors của flashrush-manual-worker. Các giá trị điều kiện cần dùng được trình bày ở Bước 7.

**Bước 7.** Cấu hình:

| Thông số | Giá trị |
|---|---|
| Namespace | AWS/Lambda |
| Metric | Errors |
| Dimension | FunctionName=flashrush-manual-worker |
| Statistic | Maximum |
| Period | 1 minute |
| Threshold | Greater/Equal 1 |
| Evaluation periods | 1 |
| Datapoints to alarm | 1/1 |
| Missing data | Treat missing data as good (not breaching threshold) |
| SNS Topic | flashrush-manual-alerts |
|  |  |

![Worker Errors với notBreaching](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-027.png)

*Hình 5.3.9.27. Worker Errors với notBreaching.*

Ảnh Edit alarm của Worker Errors cho thấy đúng function và metric, Maximum, 1 minute, ngưỡng ≥ 1, 1 out of 1 và Treat missing data as good (not breaching threshold).

**Bước 8.** Chọn Notification khi trạng thái chuyển sang In alarm.

![Chọn SNS action cho Worker](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-028.png)

*Hình 5.3.9.28. Chọn SNS action cho Worker.*

**Bước 9.** Đặt tên Alarm:

flashrush-manual-workererroralarm

**Bước 10.** Rà soát cấu hình. Chọn Update alarm khi sửa alarm hiện có hoặc Create alarm khi tạo lần đầu.

![Rà soát hoặc cập nhật Worker alarm](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-029.png)

*Hình 5.3.9.29. Rà soát hoặc cập nhật Worker alarm.*

Kết quả

![Danh sách sau khi lưu Worker alarm](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-030.png)

*Hình 5.3.9.30. Danh sách sau khi lưu Worker alarm.*

Lưu ý: Với SQS partial batch response, Worker có thể trả batchItemFailures mà Lambda invocation vẫn hoàn thành thành công. Vì vậy, metric Errors không phản ánh đầy đủ tất cả các trường hợp cần retry.

Cần kết hợp theo dõi Worker Logs, DLQ và các metric liên quan để đánh giá hoạt động xử lý đơn hàng.

### 5.3.9.7 Tạo CloudWatch Alarm giám sát thời gian chờ SQS

Alarm thứ ba được sử dụng để phát hiện tình huống message nằm trong hàng đợi quá lâu.

Tên Alarm:

flashrush-manual-queueagealarm

**Bước 1.** Truy cập CloudWatch → Alarms → All alarms → Create alarm.

**Bước 2.** Chọn Select metric.

![Tạo Queue Age alarm](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-031.png)

*Hình 5.3.9.31. Tạo Queue Age alarm.*

**Bước 3.** Chọn namespace SQS (AWS/SQS).

![Chọn AWS/SQS](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-34.png)

*Hình 5.3.9.32. Chọn AWS/SQS.*

**Bước 4.** Chọn nhóm metric theo Queue Name.

**Bước 5.** Tìm queue:

flashrush-manual-orders

**Bước 6.** Chọn metric:

ApproximateAgeOfOldestMessage

![Chọn tuổi message của main queue](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-35.png)

*Hình 5.3.9.33. Chọn tuổi message của main queue.*

**Bước 7.** Cấu hình các giá trị:

| Thông số | Giá trị |
|---|---|
| Namespace | AWS/SQS |
| Metric | ApproximateAgeOfOldestMessage |
| Dimension | QueueName=flashrush-manual-orders |
| Statistic | Maximum |
| Period | 1 minute |
| Threshold | Greater/Equal 300 |
| Evaluation periods | 1 |
| Datapoints to alarm | 1/1 |
| Missing data | notBreaching |
| SNS Topic | flashrush-manual-alerts |

Ngưỡng 300 được tính bằng giây, tương đương 5 phút.

Khi metric tuổi message cũ nhất đạt hoặc vượt 300 giây và đáp ứng điều kiện đánh giá, Alarm sẽ chuyển sang trạng thái cảnh báo.

![Điều kiện tuổi message 300 giây](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-034.png)

*Hình 5.3.9.34. Điều kiện tuổi message 300 giây.*

**Bước 8.** Cấu hình Notification khi trạng thái là In alarm.

![Chọn SNS action cho Queue Age](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-035.png)

*Hình 5.3.9.35. Chọn SNS action cho Queue Age.*

**Bước 9.** Đặt Alarm name:

flashrush-manual-queueagealarm

![Đặt tên Queue Age alarm](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-036.png)

*Hình 5.3.9.36. Đặt tên Queue Age alarm.*

**Bước 10.** Nhấn Create alarm.

![Lưu Queue Age alarm](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-037.png)

*Hình 5.3.9.37. Lưu Queue Age alarm.*

### 5.3.9.8 Kiểm tra trạng thái ba CloudWatch Alarms

Sau khi tạo các Alarms, cần kiểm tra toàn bộ cấu hình đã được lưu.

**Bước 1.** Truy cập CloudWatch → Alarms → All alarms.

**Bước 2.** Kiểm tra danh sách có đủ ba Alarm:

| STT | Alarm name | Chức năng |
|---|---|---|
| 1 | flashrush-manual-dlqalarm | Theo dõi message trong DLQ |
| 2 | flashrush-manual-workererroralarm | Theo dõi lỗi Lambda Worker |
| 3 | flashrush-manual-queueagealarm | Theo dõi thời gian chờ SQS |

**Bước 3.** Kiểm tra trạng thái của từng Alarm.

Các trạng thái thường gặp:

OK: Metric không vi phạm điều kiện cảnh báo theo đánh giá hiện tại.

ALARM: Metric đã vi phạm điều kiện cảnh báo.

INSUFFICIENT_DATA: Chưa có đủ dữ liệu để xác định trạng thái.

**Bước 4.** Mở chi tiết từng alarm và đối chiếu metric, dimension, threshold, Missing data treatment và SNS action với các bảng cấu hình ở trên.

**Bước 5.** Xác nhận Alarm actions đang bật.

![Ba alarm OK với actions enabled trong ảnh cung cấp](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-038.png)

*Hình 5.3.9.38. Ba alarm OK với actions enabled trong ảnh cung cấp.*

Ảnh danh sách ghi nhận cả ba alarm ở trạng thái OK, Actions enabled và hiển thị ngưỡng tương ứng. Dùng trang chi tiết của từng alarm để đối chiếu thêm Missing data treatment và SNS action.

Cập nhật alarm đã có: kiểm tra flashrush-manual-dlqalarm và flashrush-manual-workererroralarm. Nếu giá trị còn là missing, chọn Actions → Edit → Additional configuration → Missing data treatment → Treat missing data as good (not breaching threshold). Đi tiếp qua các màn hình, giữ action In alarm → flashrush-manual-alerts rồi chọn Update alarm.

Mở lại chi tiết từng alarm đã cập nhật và chụp metric, dimension, threshold, missing data và SNS action. DLQ dùng AWS/SQS, ApproximateNumberOfMessagesVisible, QueueName=flashrush-manual-dlq, ≥ 1. Worker dùng AWS/Lambda, Errors, FunctionName=flashrush-manual-worker, ≥ 1. Giữ Maximum, 1 minute và 1/1 cho cả hai.

Sau khi frontend hoạt động và nhóm thống nhất kịch bản, đối chiếu Alarm History với email của cùng lần thử. Email từ Publish trực tiếp ở mục SNS xác nhận riêng đường gửi từ topic đến hộp thư.

### 5.3.9.9 Kiểm tra CloudWatch Logs Retention

Để giới hạn thời gian lưu trữ logs trong môi trường thực hành, cần kiểm tra retention của ba Log groups.

**Bước 1.** Truy cập CloudWatch → Logs → Log groups.

**Bước 2.** Chọn Log group của Lambda API, Lambda Worker hoặc API Gateway.

**Bước 3.** Tìm mục Retention setting.

**Bước 4.** Nếu chưa được cấu hình theo baseline, chỉnh retention thành 7 days.

**Bước 5.** Lưu thay đổi và kiểm tra lại.

Lặp lại với ba Log groups.

![Retention 7 ngày của ba log group](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-41.png)

*Hình 5.3.9.39. Retention 7 ngày của ba log group.*

Ảnh Log groups xác nhận cả ba nhóm có retention 1 week (7 ngày).

### Kiểm tra kết quả

Các tiêu chí nghiệm thu của phần thực hành:

| STT | Tiêu chí | Kết quả mong đợi |
|---|---|---|
| 1 | Lambda API Logs | Truy cập được log group và xem được log thực tế |
| 2 | Lambda Worker Logs | Truy cập được log group và xem được log thực tế |
| 3 | API Gateway Logs | Xem được access logs nếu đã bật và phát sinh request |
| 4 | DLQ Alarm | Tạo đúng metric, dimension và threshold ≥ 1 |
| 5 | Worker Errors Alarm | Tạo đúng metric Errors của flashrush-manual-worker |
| 6 | Queue Age Alarm | Tạo đúng metric, dimension và threshold ≥ 300 giây |
| 7 | SNS Notification | Ba Alarm trỏ tới flashrush-manual-alerts |
| 8 | Log Retention | Ba Log groups có retention 7 ngày |

Kết quả rà soát: Ảnh cấu hình mới của DLQ và Worker Errors hiển thị notBreaching. Ảnh danh sách cho thấy cả ba alarm ở trạng thái OK và Actions enabled. Retention 7 ngày của ba log group đã được ghi nhận. Ca CloudWatch Alarm → SNS → email còn chờ kiểm thử theo kịch bản đã thống nhất.

### Các lỗi thường gặp

Lỗi 1 Không tìm thấy Log group

Nguyên nhân có thể do Lambda chưa được gọi, sai Region hoặc thiếu quyền ghi CloudWatch Logs.

Cách xử lý: Kiểm tra Region, gọi Lambda bằng Test Event và xác minh execution role có quyền ghi logs.

Lỗi 2 Không thấy metric trong CloudWatch

Nguyên nhân có thể là Lambda hoặc SQS chưa phát sinh hoạt động nên chưa có dữ liệu metric phù hợp.

Cách xử lý: Tạo hoạt động hợp lệ trên đúng tài nguyên, kiểm tra lại khoảng thời gian và Refresh danh sách metric. Không chọn metric của tài nguyên khác.

Lỗi 3 Alarm ở trạng thái INSUFFICIENT_DATA

Nguyên nhân có thể do chưa có đủ dữ liệu để CloudWatch đánh giá.

Cách xử lý: Kiểm tra metric, khoảng thời gian đánh giá và cấu hình Treat missing data.

Lỗi 4 CloudWatch Alarm không gửi email

Cần kiểm tra Alarm actions, SNS Topic, Access Policy và trạng thái Email Subscription.

Chỉ khi subscription đã được xác nhận, SNS mới có thể gửi email đến endpoint đó.

Lỗi 5 Lambda Errors không tăng dù Worker cần retry

Nguyên nhân có thể do Worker sử dụng partial batch response, trả về danh sách record thất bại mà không làm Lambda invocation thất bại.

Cách xử lý: Kiểm tra thêm Worker Logs, queue age, DLQ và throttles.

### Kết luận

Amazon CloudWatch đóng vai trò quan trọng trong quá trình giám sát và vận hành hệ thống FLASHRUSH.

Thông qua CloudWatch Logs, người thực hành có thể theo dõi lịch sử thực thi của Lambda API, Lambda Worker và các HTTP request đi qua API Gateway.

Bên cạnh đó, ba CloudWatch Alarms được cấu hình nhằm phát hiện các trường hợp bất thường liên quan đến Dead-Letter Queue, lỗi thực thi Lambda Worker và thời gian chờ xử lý trong Amazon SQS.

Việc kết nối CloudWatch Alarms với Amazon SNS hỗ trợ gửi thông báo qua email khi Alarm chuyển sang trạng thái cảnh báo.

Tuy nhiên, các Alarms chỉ phản ánh những điều kiện và metric đã được cấu hình. Chúng không thay thế việc kiểm tra logs, trạng thái đơn hàng và các bằng chứng kiểm thử nghiệp vụ.

### Tài liệu tham khảo

AWS Documentation Amazon CloudWatch: https://docs.aws.amazon.com/cloudwatch/

AWS Documentation Missing data in CloudWatch alarms: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarms-and-missing-data.html

AWS Documentation Amazon SQS metrics: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-available-cloudwatch-metrics.html

AWS Documentation Amazon CloudWatch Logs: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html

### Cognito mapping

Monitoring API cần JWT nhân viên, quyền backend và quyền đọc CloudWatch của execution role API. Owner/manager được monitoring; support không tự có quyền. Không log password, bearer token hoặc mã xác minh. [Mapping Cognito]({{< relref "/5-Workshop/5.7-Baseline-and-evidence/" >}})
