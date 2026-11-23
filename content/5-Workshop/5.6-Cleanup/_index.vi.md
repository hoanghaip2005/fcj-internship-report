---
title: "5.6 Cleanup"
weight: 6
draft: false
---




> **Trạng thái:** Bản hướng dẫn thực hành thủ công dựa trên source FLASHRUSH; **có ảnh thực hành từng dịch vụ, chưa đủ bằng chứng nghiệm thu toàn bộ luồng**. Không sử dụng CloudFormation/CLI để tạo hạ tầng. Các bước tạo/sửa/xóa tài nguyên AWS có thể phát sinh phí. Chỉ thực hiện trong môi trường demo có quyền hợp lệ; chụp ảnh thực tế khi làm, không thay bằng ảnh giả.

> **Cấu hình demo:** Region `us-east-1`, tài nguyên prefix `flashrush-manual-*`, đối chiếu cấu hình stack `flashrush-lab` trước đây. Mọi chỗ có `YOUR_AWS_ACCOUNT_ID` phải thay bằng Account ID của người thực hành trước khi tạo tài nguyên hoặc dán policy.

**Cảnh báo dữ liệu:** Cleanup xóa dữ liệu demo thật. Không chạy nếu chưa chụp và lưu evidence; không xóa stack CloudFormation `flashrush-lab` hoặc resource không thuộc bộ manual.

## 5.6.1 Cập nhật và dọn dẹp bằng Console

### 5.6.1.1 Cập nhật ứng dụng

Backend: lưu code cũ, mở app.py trong cả hai Lambda, dán bản mới và Deploy; kiểm tra handler/environment; chạy lại test trên fixture riêng. Rollback bằng cách đưa lại code cũ và Deploy.

Frontend: giữ dist cũ, build theo mục 5.4.1, S3 upload assets trước index, CloudFront Invalidations → Create invalidation → `/*`, chờ Completed; kiểm tra website và đơn mới. Không xóa assets cũ khi cache/bản rollback còn dùng.

### 5.6.1.2 Sau mỗi demo

1. DynamoDB Orders, kiểm tra PENDING và thời gian createdAt/updatedAt.

2. Xem enqueueState/enqueueAttemptCount cùng logs và queue; Scan/filter chỉ phù hợp lab nhỏ.

3. Nếu SENT, điều tra Worker/queue trước, không gửi lại ngẫu nhiên.

4. Kiểm tra CloudWatch queue age, DLQ và Worker errors/throttles.

5. Không sửa status thành CONFIRMED hoặc tăng stock để che lỗi.

Tài liệu này không triển khai scheduler hay tự động reconciliation. Billing → Cost Explorer/Budgets giúp theo dõi chi phí; budget notification không phải hard cap. Không cam kết lab luôn dưới một mức tiền cố định.

### 5.6.1.3 Xóa bộ manual khi kết thúc

Đây là thao tác xóa dữ liệu. Trước khi bắt đầu, lưu dữ liệu/evidence cần giữ và danh sách tên/ARN. Chỉ xóa bộ manual đã xác minh, giữ nguyên flashrush-lab và tài nguyên khác.

1. Dừng traffic/demo.

2. Worker → Configuration → Triggers → Disable mapping SQS; kiểm tra message còn cần giữ.

3. CloudFront distribution manual → Disable → chờ deployed → Delete.

4. Xóa OAC và Function manual sau khi hết association.

5. S3 đúng bucket manual → Empty; nếu versioning bật, xử lý cả versions/delete markers. Sau đó Delete bucket.

6. API Gateway → API manual → Delete và xác nhận.

7. Lambda → xóa mapping còn sót và hai functions manual.

8. SQS → xóa queue chính và DLQ khi dữ liệu không còn cần.

9. DynamoDB → xóa hai bảng manual sau khi lưu dữ liệu cần giữ.

10. CloudWatch → xóa ba alarms manual.

11. SNS → xóa subscription của bài lab nếu còn rồi xóa topic manual.

12. CloudWatch → xóa ba log groups manual nếu đã lưu logs cần thiết.

13. IAM → xóa hai roles manual sau khi hết tham chiếu.

14. Đối chiếu inventory ban đầu, kiểm tra mọi tài nguyên đã được xử lý.

15. Xem Billing khi dữ liệu chi phí cập nhật; tài nguyên biến mất không có nghĩa hóa đơn tức thì bằng 0.

Nếu báo resource in use, xử lý association cụ thể; không mở rộng phạm vi xóa sang tài nguyên khác.


## 5.6.2 Bàn giao kết quả cleanup

- [ ] Đã ghi inventory và xác minh quyền sở hữu của từng tài nguyên trước khi xóa.
- [ ] Đã dừng request, tắt SQS trigger, giữ evidence an toàn.
- [ ] Đã xóa đúng resources manual ở từng dịch vụ; không xóa tài nguyên khác.
- [ ] Xác minh trạng thái `NotFound` (khác với `AccessDenied`) đối với các resource được xóa.
- [ ] Ghi thời gian hoàn tất và tài nguyên còn sót nếu có.
- [ ] Kiểm tra Billing sau độ trễ cập nhật; không mặc định chi phí = 0 ngay.

> [CẦN CHỤP ẢNH: danh sách tài nguyên manual sau cleanup, CloudFront distribution đã xóa, CloudWatch alarms đã xóa, trang Billing sau khi cập nhật.]

## Lưu ý khi bàn giao

Bộ manual không có CloudFormation stack và không cần bucket artifacts. Không dùng Delete stack để dọn tài nguyên manual. Khi xóa IAM execution roles, xóa inline policies/detach managed policies theo yêu cầu Console trước; giữ IAM users đăng nhập của thành viên. Sau cleanup ghi riêng tài nguyên còn sót, lý do, người xử lý; Billing có độ trễ, không kết luận chi phí bằng 0.

