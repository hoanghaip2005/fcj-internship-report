---
title: "5.2 Chuẩn bị AWS Console"
weight: 2
draft: false
---





> **Cấu hình demo:** Region `us-east-1`, tài nguyên prefix `flashrush-manual-*`. Mọi chỗ có `YOUR_AWS_ACCOUNT_ID` phải thay bằng Account ID của người thực hành trước khi tạo tài nguyên hoặc dán policy.

## 5.2.1 Chuẩn bị trên AWS Console

### 5.2.1.1 Đăng nhập đúng tài khoản và vùng

1. Mở [Console us-east-1](https://us-east-1.console.aws.amazon.com/console/home?region=us-east-1#).

2. Đăng nhập IAM user đã được cấp. Nếu AWS yêu cầu đổi mật khẩu lần đầu, thực hiện trên trang AWS.

3. Bấm menu tài khoản góc trên bên phải, kiểm tra Account ID **YOUR_AWS_ACCOUNT_ID**.

4. Menu Region → chọn **US East N. Virginia us-east-1**.

5. Dùng ô tìm kiếm phía trên để mở từng dịch vụ. Giữ nhiều tab khi cần copy ARN/URL.

6. Không cần tạo access key; không điền mật khẩu vào Lambda, S3 hoặc file .env.

IAM và CloudFront là dịch vụ toàn cục; các tài nguyên theo vùng trong bài dùng us-east-1. Không đổi region giữa chừng.

### 5.2.1.2 Tên tài nguyên và ghi chú cần lưu

| Nhóm | Tên trong bài |
|---|---|
| DynamoDB | flashrush-manual-products; flashrush-manual-orders |
| SQS | flashrush-manual-orders; flashrush-manual-dlq |
| IAM | flashrush-manual-api-role; flashrush-manual-worker-role |
| Lambda | flashrush-manual-api; flashrush-manual-worker |
| API Gateway | flashrush-manual-api |
| S3 | flashrush-manual-web-YOUR_AWS_ACCOUNT_ID-us-east-1 |
| CloudFront OAC và Function | flashrush-manual-oac; flashrush-manual-spa-rewrite |
| SNS | flashrush-manual-alerts |

Vào danh sách từng dịch vụ, tìm tên trước khi Create. Gắn tag Project=FLASHRUSH, Environment=manual trên tài nguyên hỗ trợ tag. SQS và DynamoDB trùng tên vẫn được vì thuộc hai dịch vụ khác nhau.

Tạo ghi chú local, điền dần: ARN hai bảng; Queue URL và ARN queue chính; ARN DLQ; ARN hai roles; API endpoint; CloudFront Distribution ID và domain; SNS Topic ARN. Không ghi token đơn vào ghi chú chia sẻ.

### 5.2.1.3 Chuẩn bị mã nguồn

Thư mục ứng dụng là `<DUONG_DAN_TOI_THU_MUC_APP>`, bên trong có backend và frontend.

- Dùng `backend/app.py` để dán vào hai Lambda qua editor web.

- Sau khi có API URL, làm mục 5.4.1 để build frontend/dist rồi upload qua S3 Console.

- Không dùng dist cũ mà chưa kiểm tra API URL đã được build vào bundle.

Tìm Service Quotas → AWS Lambda → Concurrent executions để kiểm tra quota. Worker trong bài giới hạn 5 concurrent batches; API và ứng dụng khác cũng cần concurrency. Không tăng tải khi chưa biết quota tài khoản.


## 5.2.2 Kiểm tra trước khi bắt đầu

- [ ] Tài khoản được cấp quyền dùng DynamoDB, SQS, IAM, Lambda, API Gateway, S3, CloudFront, CloudWatch, SNS; nếu không có quyền tạo role hoặc sửa policy thì phải xin cấp quyền trước.
- [ ] Người học đã xác minh Account ID và chuyển Region về `us-east-1`.
- [ ] Kiểm tra tài nguyên `flashrush-manual-*` đã tồn tại hay chưa, không ghi đè tài nguyên của nhóm khác.
- [ ] Có kế hoạch theo dõi chi phí, đồng ý rằng Budget/Alerts không phải hạn mức cứng.
- [ ] Có source `backend/app.py` và thư mục `frontend/` tại application root; có quyền xây dựng frontend trên máy nếu muốn thử giao diện.
- [ ] Ghi lại danh sách tài nguyên sẽ tạo để cleanup ở 5.6.

**Checkpoint:** Chỉ chuyển sang [5.3 Tạo dịch vụ AWS]({{< relref "/5-Workshop/5.3-Infrastructure/" >}}) sau khi các điều kiện trên đã đạt.

## Chọn đúng source, giữ nguyên cấu trúc Git

Giải nén ZIP một lần. Thư mục `source-snapshot` chứa `backend/` và `frontend/`, dùng làm `<DUONG_DAN_TOI_THU_MUC_APP>` cho bài này. Không cần clone rồi di chuyển toàn bộ file; không flatten thư mục Git hiện có.

Snapshot lấy từ working tree trên nền commit `eef9a6fbc9930f3865a93681048b9b3cd35e215b`, gồm thay đổi local chưa push. Link GitHub `main` chỉ để tham khảo; không bảo đảm trùng snapshot. Kiểm tra SHA256 trong `SOURCE_MANIFEST.json` khi bàn giao giữa các nhóm.

| Bộ từng triển khai | Bộ thực hành Console |
|---|---|
| `flashrush-lab-products`, `flashrush-lab-orders` | `flashrush-manual-products`, `flashrush-manual-orders` |
| `flashrush-lab-api`, `flashrush-lab-worker` | `flashrush-manual-api`, `flashrush-manual-worker` |
| Queue/DLQ/SNS/logs prefix `flashrush-lab` | Giữ cùng hậu tố, đổi prefix thành `flashrush-manual` |
| CloudFormation quản lý vòng đời | Người học lưu inventory, tạo/xóa từng tài nguyên |

Namespace manual chỉ thay tên, không thay nghiệp vụ. Nếu nhiều nhóm dùng chung account/region, phân công dùng chung một bộ hoặc thống nhất prefix riêng; đổi đồng bộ tên, ARN, policies, environment, alarms. Không để các nhóm cùng ghi đè một bộ tài nguyên.

Không chạy `deploy.py`, `publish.py`, `verify.py`, `cleanup_inventory.py` của track CloudFormation cho bộ manual: các script đó phụ thuộc stack outputs/guards.
