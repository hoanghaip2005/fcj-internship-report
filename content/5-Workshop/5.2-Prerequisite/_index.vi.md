---
title: "5.2 Chuẩn bị AWS Console"
weight: 2
draft: false
---

## 5.2.1 Chuẩn bị trên AWS Console

Các tài nguyên theo vùng được tạo tại **US East (N. Virginia)**, mã vùng **us-east-1**. Tên tài nguyên bắt đầu bằng **flashrush-manual-** để nhận biết bộ thực hành. Trong các mẫu policy, thay **YOUR_AWS_ACCOUNT_ID** bằng mã tài khoản AWS gồm 12 chữ số của bạn.

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
| DynamoDB | flashrush-manual-products; flashrush-manual-orders; flashrush-manual-campaigns |
| SQS | flashrush-manual-orders; flashrush-manual-dlq |
| IAM | flashrush-manual-api-role; flashrush-manual-worker-role |
| Lambda | flashrush-manual-api; flashrush-manual-worker |
| API Gateway | flashrush-manual-api |
| S3 | flashrush-manual-web-YOUR_AWS_ACCOUNT_ID-us-east-1 |
| CloudFront OAC và Function | flashrush-manual-oac; flashrush-manual-spa-rewrite |
| SNS | flashrush-manual-alerts |

Vào danh sách từng dịch vụ, tìm tên trước khi Create. Gắn tag Project=FLASHRUSH, Environment=manual trên tài nguyên hỗ trợ tag. SQS và DynamoDB trùng tên vẫn được vì thuộc hai dịch vụ khác nhau.

Tạo ghi chú local, điền dần: ARN ba bảng; Queue URL và ARN queue chính; ARN DLQ; ARN hai roles; API endpoint; CloudFront Distribution ID và domain; SNS Topic ARN. Không ghi token đơn vào ghi chú chia sẻ.

### 5.2.1.3 Chuẩn bị mã nguồn

Thư mục ứng dụng là `<DUONG_DAN_TOI_THU_MUC_APP>`, bên trong có backend và frontend.

- Tạo đủ năm file app.py, business.py, customer.py, monitoring.py và vouchers.py trong gốc editor Lambda; dán nội dung cùng commit. Hai handler là app.api và app.worker.

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

Baseline Console guest dùng commit `d6b3b2568bb2d9bea05d03391c9c7cb624f75f19`; đây là phiên bản cố định của workshop, không phải cam kết luôn bằng main mới nhất. Không dùng snapshot local không có manifest. Lấy đúng commit bằng Git trên máy (không tạo tài nguyên AWS):

```powershell
git clone https://github.com/kinnynee/FLASHRUSH-Serverless-Flash-Sale.git
Set-Location FLASHRUSH-Serverless-Flash-Sale
git checkout --detach d6b3b2568bb2d9bea05d03391c9c7cb624f75f19
if ($LASTEXITCODE -ne 0) { throw 'Khong lay duoc baseline' }
git rev-parse HEAD
Set-Location FLASHRUSH-Serverless-Flash-Sale
Test-Path backend/app.py
Test-Path frontend/package-lock.json
```

Hai Test-Path phải True. Thư mục bên trong là application root; không flatten repository. Nếu đã có clone, giữ thay đổi của bạn trước khi checkout; không chạy reset --hard.

Chạy Node.js 22.12+ và npm ci theo package-lock. Python 3.12 là runtime Lambda. Git/Node chỉ dùng lấy source/build; hạ tầng vẫn tạo trên AWS Console. Source cần ba bảng Products/Orders/Campaigns, sáu public routes và đủ module Lambda. Không tạo Cognito/Customers/Business cho bài guest; muốn trình diễn đăng nhập/voucher/admin phải dùng một hướng dẫn mở rộng riêng.

Tên tài nguyên cùng prefix flashrush-manual. Nếu dùng account chung, thống nhất namespace với owner trước khi tạo. Không chạy scripts/deploy/deploy.py hoặc xóa stack để thay cho các bước Console.


## Cấu hình mở rộng bắt buộc — cập nhật 28/11/2026

Các ảnh/bước guest cũ trên trang này chỉ là nền tảng. Để dựng **đầy đủ project hiện tại**, áp dụng cấu hình bên dưới và [5.3.10 Cognito]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}}). Không dùng User Pool/client/bảng của lab cho bộ manual khác.


Chốt source tại commit `a870b73` cho frontend đăng nhập chung và các module hiện tại; dùng full SHA từ git rev-parse để bàn giao. Đọc release notes: deployment lab có các scoped release, không mặc định mọi module trên AWS bằng main.

Inventory đầy đủ cần thêm: UserPoolId, UserPoolClientId, JWT authorizer ID, CustomersTable, BusinessTable. Không hardcode ID lab vào bản dựng manual. Thứ tự: DynamoDB/SQS → tạo Cognito pool/client/groups (5.3.10 bước 1–6) → IAM → Lambda → API/JWT → S3/CloudFront → SNS/CloudWatch → test. Cognito được đánh số 5.3.10 theo dịch vụ bổ sung nhưng phải có trước khi tích hợp Lambda/API.
