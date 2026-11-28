---
title: "5.6 Dọn dẹp tài nguyên"
weight: 6
draft: false
---

Phần này hướng dẫn xóa các tài nguyên đã tạo trong workshop. Kiểm tra đúng tài khoản AWS và vùng US East (N. Virginia), mã vùng us-east-1. Chỉ xóa tài nguyên có trong danh sách của bài thực hành; giữ nguyên tài nguyên của dự án khác.

**Cảnh báo:** Đây là thao tác xóa dữ liệu và tài nguyên thật. Chỉ thực hiện sau khi đã lưu evidence, inventory tên/ARN và xác nhận đúng account, region, owner. Không chạy chỉ để chụp ảnh.

## 5.6.1 Kiểm tra trước khi xóa

1. Dừng website, test và traffic vào API.
2. Kiểm tra DynamoDB Orders: không còn đơn PENDING cần xử lý; lưu dữ liệu cần giữ.
3. Kiểm tra SQS queue chính và DLQ; chờ hoặc lưu message còn cần thiết.
4. Lưu CloudWatch logs, alarm history, test report và ảnh bằng chứng.
5. Lập inventory các tài nguyên manual:

| Dịch vụ | Tài nguyên cần đối chiếu |
|---|---|
| CloudFront | distribution, OAC, function `flashrush-manual-spa-rewrite` |
| S3 | bucket website `flashrush-manual-web-...` |
| API Gateway | HTTP API `flashrush-manual-api` |
| Lambda | `flashrush-manual-api`, `flashrush-manual-worker`, event source mapping |
| SQS | `flashrush-manual-orders`, `flashrush-manual-dlq` |
| DynamoDB | `flashrush-manual-products`, `flashrush-manual-orders` |
| CloudWatch | ba alarms và ba log groups |
| SNS | topic `flashrush-manual-alerts`, subscription |
| IAM | hai execution roles manual |

Nếu tên hoặc owner không khớp inventory, dừng. `AccessDenied` không phải bằng chứng tài nguyên đã bị xóa.

## 5.6.2 Thứ tự xóa trên AWS Console

1. **Lambda:** mở Worker → Configuration → Triggers → Disable event source mapping. Xác nhận mapping đã tắt.
2. **CloudFront:** Disable distribution → chờ trạng thái Deployed → Delete distribution.
3. **CloudFront:** xóa OAC sau khi không còn distribution dùng; xóa CloudFront Function `flashrush-manual-spa-rewrite` sau khi hết association.
4. **S3:** mở đúng bucket manual → Empty. Nếu bật versioning, xóa cả object versions, delete markers và multipart uploads → Delete bucket.
5. **API Gateway:** xóa HTTP API manual.
6. **Lambda:** xóa event source mapping còn sót, sau đó xóa hai function manual.
7. **SQS:** kiểm tra message cần giữ, rồi xóa queue chính và DLQ.
8. **DynamoDB:** xóa ba bảng Products, Orders, Campaigns manual sau khi đã lưu dữ liệu.
9. **CloudWatch:** xóa ba alarms, rồi xóa ba log groups manual.
10. **SNS:** xóa subscription manual còn tồn tại, sau đó xóa topic manual.
11. **IAM:** kiểm tra không còn Lambda tham chiếu; xóa inline policies và hai execution roles manual. Không xóa IAM user đăng nhập.

Không dùng **Delete CloudFormation stack**: bộ manual được tạo bằng Console và không thuộc stack.

## 5.6.3 Kiểm tra sau khi xóa

- Tìm lại từng ARN/tên trong inventory; xác nhận `NotFound` hoặc mục đã biến mất.
- Kiểm tra CloudFront có thể mất thời gian cập nhật; không kết luận sớm.
- Kiểm tra S3 không còn versions, delete markers hoặc multipart uploads.
- Kiểm tra SQS không còn queue, DynamoDB không còn bảng, Lambda không còn mapping.
- Ghi riêng tài nguyên còn sót, lý do, owner và bước xử lý tiếp theo.
- Mở Billing/Cost Explorer sau khi AWS cập nhật dữ liệu. Tài nguyên đã xóa không làm hóa đơn về 0 ngay; budget không phải hard cap.

## 5.6.4 Bàn giao

- [ ] Inventory và owner đã được xác minh.
- [ ] Evidence, logs và dữ liệu cần giữ đã lưu.
- [ ] Trigger đã tắt trước khi xóa queue.
- [ ] Chỉ tài nguyên `flashrush-manual-*` đã bị xóa.
- [ ] Không xóa `flashrush-lab` hoặc IAM user.
- [ ] Trạng thái sau cleanup và tài nguyên còn sót đã ghi nhận.
- [ ] Billing/Cost Explorer được kiểm tra sau độ trễ cập nhật.

[Quay lại mục kiểm thử và giám sát]({{< relref "/5-Workshop/5.5-Testing-and-monitoring/" >}})


## Cấu hình mở rộng bắt buộc — cập nhật 28/11/2026

Các ảnh/bước guest cũ trên trang này chỉ là nền tảng. Để dựng **đầy đủ project hiện tại**, áp dụng cấu hình bên dưới và [5.3.10 Cognito]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}}). Không dùng User Pool/client/bảng của lab cho bộ manual khác.


## Cleanup phần mở rộng Cognito

Đây là hướng dẫn xóa cho **manual rebuild được duyệt**, không thực hiện trong lần cập nhật tài liệu. Bổ sung Customers/Business, Cognito pool/client/groups, JWT authorizer và log liên quan vào inventory trước demo. Lưu dữ liệu cần giữ, dừng UI/test và giải quyết PENDING trước khi xóa. Khi API đã dừng, xóa route/authorizer/API, Lambda, mapping, queues và các bảng theo phụ thuộc; xóa Cognito app client/pool chỉ sau khi xác nhận không còn frontend/ứng dụng khác dùng chung.

Xóa User Pool làm mất user/group và không phải thao tác có thể khôi phục thông thường. Không xóa pool lab `us-east-1_mIpzTH61t`, IAM users hoặc dữ liệu nhóm khác. Xác minh owner, sao lưu và có duyệt trước thao tác phá hủy. Gỡ CI target/role riêng nếu chủ tài khoản yêu cầu; không vô hiệu hóa pipeline nhóm khác. COST cần cộng Cognito MAU theo loại tài khoản/Free Tier, hai bảng mới và log/requests mới; dùng estimate thực tế, không suy từ con số guest cũ.

### Cognito mapping

Dùng mapping inventory để tìm mọi client/authorizer/Lambda/frontend dùng pool trước khi xóa. Xóa pool không dọn DynamoDB/S3; xóa IAM user không thuộc cleanup Cognito website. [Mapping Cognito]({{< relref "/5-Workshop/5.7-Baseline-and-evidence/" >}})
