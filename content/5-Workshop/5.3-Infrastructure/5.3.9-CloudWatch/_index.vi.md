---
title: "5.3.9 Amazon CloudWatch"
weight: 9
draft: false
---




**Mục tiêu:** Logs, metrics và alarms.

> **Hình thức:** Tạo thủ công bằng **AWS Management Console**. Các thao tác dưới đây tạo hoặc cập nhật tài nguyên AWS thật và có thể phát sinh phí. Chỉ làm trên bộ `flashrush-manual-*`, không đụng tới `flashrush-lab` của CloudFormation. Ảnh thực hành được trình bày bên dưới; các điểm chưa đủ bằng chứng cần kiểm tra lại trên AWS.

**Điều kiện đầu vào:** Hoàn thành [5.2 Chuẩn bị]({{< relref "/5-Workshop/5.2-Prerequisite/" >}}) và các mục 5.3 đứng trước trang này. Region `us-east-1`; thay `YOUR_AWS_ACCOUNT_ID` bằng Account ID đúng của người thực hành.

### 5.3.9.1 Kiểm tra logs


**Bước 1.** CloudWatch → Log groups → API group → mở stream mới nhất.

![Mở CloudWatch, chọn log group API và đọc log stream](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-01.png)

*Hình 5.3.9.1. Mở CloudWatch, chọn log group API và đọc log stream.*

![Mở CloudWatch, chọn log group API và đọc log stream](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-02.png)

*Hình 5.3.9.2. Mở CloudWatch, chọn log group API và đọc log stream.*

![Mở CloudWatch, chọn log group API và đọc log stream](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-03.png)

*Hình 5.3.9.3. Mở CloudWatch, chọn log group API và đọc log stream.*

![Mở CloudWatch, chọn log group API và đọc log stream](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-04.png)

*Hình 5.3.9.4. Mở CloudWatch, chọn log group API và đọc log stream.*

![Mở CloudWatch, chọn log group API và đọc log stream](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-05.png)

*Hình 5.3.9.5. Mở CloudWatch, chọn log group API và đọc log stream.*

![Mở CloudWatch, chọn log group API và đọc log stream](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-06.png)

*Hình 5.3.9.6. Mở CloudWatch, chọn log group API và đọc log stream.*

![Mở CloudWatch, chọn log group API và đọc log stream](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-07.png)

*Hình 5.3.9.7. Mở CloudWatch, chọn log group API và đọc log stream.*

![Mở CloudWatch, chọn log group API và đọc log stream](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-08.png)

*Hình 5.3.9.8. Mở CloudWatch, chọn log group API và đọc log stream.*


**Bước 2.** Gọi GET products hoặc POST order để tạo hoạt động.


**Bước 3.** Mở Worker group, đối chiếu thời điểm nhận đơn và các thông báo lỗi/no-op nếu có.

![Log Worker ban đầu rỗng, sau đó có stream](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-09.png)

*Hình 5.3.9.9. Log Worker ban đầu rỗng, sau đó có stream.*

![Log Worker ban đầu rỗng, sau đó có stream](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-10.png)

*Hình 5.3.9.10. Log Worker ban đầu rỗng, sau đó có stream.*


**Bước 4.** Mở API Gateway access log group để xem status và requestId.

![Mở access log API Gateway và đọc sự kiện](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-11.png)

*Hình 5.3.9.11. Mở access log API Gateway và đọc sự kiện.*

![Mở access log API Gateway và đọc sự kiện](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-12.png)

*Hình 5.3.9.12. Mở access log API Gateway và đọc sự kiện.*

![Mở access log API Gateway và đọc sự kiện](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-13.png)

*Hình 5.3.9.13. Mở access log API Gateway và đọc sự kiện.*


**Bước 5.** Ghi thời gian UTC khi thu thập evidence. Giờ Việt Nam là UTC+7.

Trong log group, chọn Search all log streams, đặt khoảng thời gian đúng lần test, tìm worker_retry hoặc worker_terminal_noop. Nếu chưa có logs, kiểm tra invocation, Deploy code và quyền ghi đúng log group.

### 5.3.9.2 Tạo ba alarms đúng dimensions

**Minh họa thao tác**


![Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-14.png)

*Hình 5.3.9.14. Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action.*

![Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-15.png)

*Hình 5.3.9.15. Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action.*

![Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-16.png)

*Hình 5.3.9.16. Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action.*

![Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-17.png)

*Hình 5.3.9.17. Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action.*

![Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-18.png)

*Hình 5.3.9.18. Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action.*

![Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-19.png)

*Hình 5.3.9.19. Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action.*

![Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-20.png)

*Hình 5.3.9.20. Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action.*

![Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-21.png)

*Hình 5.3.9.21. Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action.*

![Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-22.png)

*Hình 5.3.9.22. Tạo alarm DLQ; đối chiếu metric, dimension, threshold và SNS action.*

CloudWatch → Alarms → Create alarm → Select metric. Với từng dòng dưới, chọn namespace và dimension chính xác; không chọn metric tổng hợp cho tất cả queues/functions.

| Alarm name | Namespace và metric | Dimension | Ngưỡng |
|---|---|---|---|
| flashrush-manual-dlqalarm | AWS/SQS ApproximateNumberOfMessagesVisible | QueueName=flashrush-manual-dlq | ≥ 1 |
| flashrush-manual-workererroralarm | AWS/Lambda Errors | FunctionName=flashrush-manual-worker | ≥ 1 |
| flashrush-manual-queueagealarm | AWS/SQS ApproximateAgeOfOldestMessage | QueueName=flashrush-manual-orders | ≥ 300 giây |

Cấu hình chung theo template: Statistic Maximum, Period 1 minute, Evaluation periods 1, Datapoints to alarm 1/1, Treat missing data = notBreaching. Notification khi In alarm → topic flashrush-manual-alerts. Bật alarm actions.

![Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-23.png)

*Hình 5.3.9.23. Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu.*

![Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-24.png)

*Hình 5.3.9.24. Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu.*

![Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-25.png)

*Hình 5.3.9.25. Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu.*

![Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-26.png)

*Hình 5.3.9.26. Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu.*

![Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-27.png)

*Hình 5.3.9.27. Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu.*

![Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-28.png)

*Hình 5.3.9.28. Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu.*

![Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-29.png)

*Hình 5.3.9.29. Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu.*

![Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-30.png)

*Hình 5.3.9.30. Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu.*

![Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-31.png)

*Hình 5.3.9.31. Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu.*

![Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-32.png)

*Hình 5.3.9.32. Tạo alarm Lambda Worker Errors; đối chiếu cấu hình trước và sau lưu.*

Metric có thể chưa xuất hiện khi tài nguyên chưa phát sinh hoạt động. Tạo một đơn hợp lệ, chờ metric xuất hiện rồi chọn lại; không đổi sang queue khác chỉ để hoàn thành wizard.

![Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-33.png)

*Hình 5.3.9.33. Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh.*

![Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-34.png)

*Hình 5.3.9.34. Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh.*

![Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-35.png)

*Hình 5.3.9.35. Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh.*

![Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-36.png)

*Hình 5.3.9.36. Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh.*

![Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-37.png)

*Hình 5.3.9.37. Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh.*

![Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-38.png)

*Hình 5.3.9.38. Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh.*

![Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-39.png)

*Hình 5.3.9.39. Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh.*

![Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-40.png)

*Hình 5.3.9.40. Tạo alarm tuổi message và kiểm tra danh sách alarms; còn warning cần xác minh.*

notBreaching nghĩa là dữ liệu thiếu được xử lý như không vi phạm trong logic đánh giá; không có nghĩa hệ thống chắc chắn khỏe khi không có traffic. [Nguồn xử lý missing data](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarms-and-missing-data.html).

### Giới hạn cảnh báo

Partial batch failure có thể trả invocation thành công nên không tăng Lambda `Errors`. Luôn xem thêm `worker_retry`, queue age, DLQ và throttles. Alarm action thành công chỉ chứng minh SNS chấp nhận action; phải xác minh riêng email đến inbox. Ba log groups retention 7 ngày; dashboard React không thay CloudWatch.

![Kiểm tra retention của ba log groups](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-41.png)

*Hình 5.3.9.41. Kiểm tra retention của ba log groups.*




