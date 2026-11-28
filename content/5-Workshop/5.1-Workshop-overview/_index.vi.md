---
title: "5.1 Tổng quan FLASHRUSH"
weight: 1
draft: false
---

Workshop sử dụng vùng **US East (N. Virginia)**, mã vùng **us-east-1**. Các tài nguyên được đặt tên bắt đầu bằng **flashrush-manual-** để dễ nhận biết khi thực hành và dọn dẹp.

## Mục tiêu

- Hiểu kiến trúc hệ thống Flash Sale không bán vượt tồn kho.
- Nhận biết đúng vai trò của 9 dịch vụ AWS và thứ tự thiết lập thủ công.
- Phân biệt `202 Accepted` với đơn hàng `CONFIRMED`.

![Kiến trúc Serverless FLASHRUSH v1.1 sơ đồ tham chiếu do nhóm cung cấp](/images/5-Workshop/FLASHRUSH/flashrush-architecture-v1.1.png)

*Hình 5.1.1 Sơ đồ kiến trúc tham chiếu v1.1 (bản nhóm cung cấp, không phải ảnh chụp tài nguyên AWS đang chạy; cần người thực hiện xác nhận tác giả và đối chiếu với baseline ba bảng hiện tại).*

## 5.1.1 Lộ trình dựng từ nhỏ đến lớn

| Thứ tự | Dịch vụ | Tài nguyên | Kết quả |
|---|---|---|---|
| 1 | DynamoDB | Products, Orders và Campaigns | Lưu sản phẩm, tồn kho và đơn |
| 2 | SQS | Queue chính và DLQ | Hàng đợi xử lý và giữ message lỗi |
| 3 | IAM | Hai execution roles | Quyền riêng cho API và Worker |
| 4 | Lambda | API và Worker | Logic nghiệp vụ hoạt động |
| 5 | API Gateway | HTTP API, routes, stage | API có địa chỉ HTTPS |
| 6 | S3 | Bucket private | Lưu frontend đã build |
| 7 | CloudFront | Distribution, OAC, Function | Website HTTPS, refresh route đúng |
| 8 | SNS | Topic và email subscription | Nhận thông báo |
| 9 | CloudWatch | Logs, metrics, alarms | Theo dõi và cảnh báo |

Thứ tự theo phụ thuộc: Lambda cần bảng/queue; frontend cần API URL. Log groups của CloudWatch được tạo sớm ở mục 5.3.3.1 để giới hạn quyền ghi log; cấu hình giám sát đầy đủ ở mục 5.3.9.

Luồng website: Browser → CloudFront → S3. Luồng mua: Browser → API Gateway → Lambda API → Orders PENDING + SQS → Worker → DynamoDB transaction. Luồng cảnh báo: CloudWatch → SNS → email đã xác nhận.

HTTP 202 chỉ xác nhận tiếp nhận, chưa phải mua thành công. Worker mới xác nhận hoặc ghi OUT_OF_STOCK. DLQ không tự chuyển order thành FAILED.

Dùng prefix **flashrush-manual** cho bài thực hành để tách khỏi bộ **flashrush-lab** trước đây. Nếu tên manual đã tồn tại, kiểm tra trước khi dùng lại. Không sửa/xóa tài nguyên khác trong bài này.

Bài Console cơ bản giới hạn ở mua không đăng nhập, không thanh toán/giao hàng thật. Source đầy đủ có Cognito, admin, giỏ hàng, voucher và monitoring thật; các chức năng mở rộng này không được provision trong track chín dịch vụ. Không dùng màn hình ngoài phạm vi làm tiêu chí nghiệm thu. Backend kiểm tra thời gian sale và chiến dịch; countdown UI không thay thế kiểm tra server.

## 5.1.2 Mã nguồn và tài liệu AWS tham khảo

### 5.1.2.1 Source project
- [Backend app.py để dán vào Lambda](https://github.com/kinnynee/FLASHRUSH-Serverless-Flash-Sale/blob/d6b3b2568bb2d9bea05d03391c9c7cb624f75f19/FLASHRUSH-Serverless-Flash-Sale/backend/app.py).
- [Schema sản phẩm](https://github.com/kinnynee/FLASHRUSH-Serverless-Flash-Sale/blob/d6b3b2568bb2d9bea05d03391c9c7cb624f75f19/FLASHRUSH-Serverless-Flash-Sale/frontend/src/types/product.ts).
- [Template đối chiếu cấu hình](https://github.com/kinnynee/FLASHRUSH-Serverless-Flash-Sale/blob/d6b3b2568bb2d9bea05d03391c9c7cb624f75f19/FLASHRUSH-Serverless-Flash-Sale/infrastructure/templates/flashrush.json): chỉ dùng để đọc, không cần deploy trong bài này.
- [Runbook AWS hiện có](https://github.com/kinnynee/FLASHRUSH-Serverless-Flash-Sale/blob/d6b3b2568bb2d9bea05d03391c9c7cb624f75f19/FLASHRUSH-Serverless-Flash-Sale/docs/operations/aws-lab.md).

### 5.1.2.2 Tài liệu AWS chính thức
- [Tạo HTTP API với Lambda và DynamoDB bằng Console](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html).
- [Lambda execution role](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html).
- [SQS mapping và visibility timeout](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-configure.html).
- [Partial batch failures](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html).
- [IAM cho DynamoDB transaction](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis-iam.html).
- [HTTP API CORS](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-cors.html).
- [S3 Block Public Access](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingBucket.html).
- [CloudFront OAC](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html).
- [SNS email](https://docs.aws.amazon.com/sns/latest/dg/sns-email-notifications.html).
- [CloudWatch missing data](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/alarms-and-missing-data.html).

## Đối chiếu kiến trúc với code đang bàn giao

Sơ đồ v1.1 đi kèm vẫn mang nhãn thiết kế đề xuất. Khi thực hành, ưu tiên cấu hình trong từng chương và code snapshot:

- Có sáu public routes: GET `/products`, GET `/products/{productId}`, GET `/campaigns`, GET `/campaigns/{campaignId}`, POST `/orders`, GET `/orders/{orderId}`. GET order cần `X-Order-Token` là key gốc.
- Backend nhận quantity nguyên 1–100; chiến dịch đặt maxQtyPerOrder=1 cho demo cơ bản. Có API admin trong source nhưng ngoài phạm vi bài guest.
- Send exception giữ `enqueueState=UNKNOWN`; chưa phân loại `RETRY_REQUIRED`. Lease 30 giây, tối đa 3 lần gửi có điều kiện; không có scheduler tự khôi phục.
- Worker xử lý lỗi kỹ thuật bằng partial batch failure. Không tự chuyển `FAILED`; DLQ không đồng nghĩa đơn thất bại nghiệp vụ.
- S3 private/OAC, SPA Function, ba alarms là cấu hình đã có trong implementation; ảnh đề xuất không chứng minh trạng thái AWS hiện tại.
- Source có backend quản trị/monitoring/Cognito; không mô tả các tính năng đó là mock. Guest workshop chưa provision Cognito/Customers/Business; chỉ nghiệm thu sáu route công khai và quan sát CloudWatch trên Console.


## Cấu hình mở rộng bắt buộc — cập nhật 28/11/2026

Các ảnh/bước guest cũ trên trang này chỉ là nền tảng. Để dựng **đầy đủ project hiện tại**, áp dụng cấu hình bên dưới và [5.3.10 Cognito]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}}). Không dùng User Pool/client/bảng của lab cho bộ manual khác.


Project đầy đủ dùng 10 dịch vụ: 9 dịch vụ serverless cơ bản và Cognito. Năm bảng DynamoDB gồm Products, Orders, Campaigns, Customers (userId+recordId), Business (id). Cognito xác thực khách/nhân viên; API Gateway JWT và backend RBAC kiểm tra quyền. Giỏ, profile và history dùng Customers; voucher/redemption và lịch sử điều chỉnh kho dùng Business. Worker cập nhật tồn kho, trạng thái checkout và redemption trong transaction; không dựa vào role client tự gửi.

Sơ đồ cũ hai bảng/guest cần được người vẽ cập nhật Cognito, JWT, Customers và Business. Không thay ảnh cũ bằng hình tổng hợp rồi gọi đó là bằng chứng setup.
