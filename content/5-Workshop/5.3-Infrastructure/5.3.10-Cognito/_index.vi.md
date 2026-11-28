---
title: "5.3.10 Amazon Cognito và feature mở rộng"
weight: 10
draft: false
---

> **Phạm vi:** Đây là phần mở rộng của project FLASHRUSH hiện tại, không phải track guest 9 dịch vụ. Chỉ làm trên User Pool/table/API đã được owner xác nhận. Không tạo User Pool mới hoặc gửi email mời khi chưa được duyệt.

## Cấu hình đã kiểm tra trên lab

- Region: `us-east-1`
- User Pool: `us-east-1_mIpzTH61t`
- Pool name: `flashrush-customers`
- Client: `5h7dn6hr6iub9ghat5jiir4ipg`, public client, không dùng secret
- Email là username, email auto-verify, password tối thiểu 12 ký tự gồm hoa/thường/số/ký hiệu
- Groups: `owner`, `manager`, `warehouse`, `support`
- Access token: 10 phút; refresh token bật; PreventUserExistenceErrors bật
- API JWT issuer: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_mIpzTH61t`
- JWT audience: client ID ở trên; scope `aws.cognito.signin.user.admin`

Đây là kết quả đọc cấu hình hiện có ngày 28/11/2026. Không coi là bằng chứng người học đã tự tạo User Pool.

## Console setup cho nhóm dựng lại

1. Cognito → User pools → Create user pool → email sign-in, email auto-verification.
2. Password policy: tối thiểu 12; uppercase/lowercase/number/symbol; recovery bằng verified email.
3. App client: public client, không tạo secret; bật `ALLOW_USER_PASSWORD_AUTH` và `ALLOW_REFRESH_TOKEN_AUTH`.
4. Tạo groups theo least privilege: owner, manager, warehouse, support.
5. Không đặt mật khẩu thật trong Markdown. Tạo staff bằng quy trình owner đã phê duyệt; xác minh email trước khi demo.
6. API Gateway → JWT authorizer: issuer của pool, audience client; gắn JWT và scope cho `/me/*` và `/admin/*`.
7. Lambda environment: `USER_POOL_ID`, `USER_POOL_CLIENT_ID`, `CUSTOMER_CLIENT_ID`, `CUSTOMER_ISSUER`, `CUSTOMERS_TABLE`, `BUSINESS_TABLE`.
8. DynamoDB: Customers key `userId` + `recordId`; Business key `id`; bật encryption/on-demand; giữ dữ liệu theo inventory.
9. CORS: `authorization`, content-type và origin CloudFront đúng target.

## Feature mapping

| Feature | API/data | Quyền |
|---|---|---|
| Đăng ký/đăng nhập | Cognito + `/auth/*` | public auth routes |
| Giỏ hàng/profile/orders | Customers + `/me/*` | JWT customer |
| Voucher wallet/quote | Business + `/me/vouchers*` | JWT customer; mỗi tài khoản một lần tùy rule |
| Customers/staff/inventory | Business/Cognito + `/admin/*` | owner/manager/warehouse/support |
| Monitoring | CloudWatch `/admin/monitoring` | staff JWT |

Checkout phải quote lại server; trừ stock và ghi redemption trong transaction. Không coi số tiền/trạng thái từ browser là bằng chứng.

## Ảnh setup bắt buộc

Chụp từ AWS Console sau khi Save/Deploy, che account-sensitive identifiers khi chia sẻ:

- `[SCREENSHOT REQUIRED]` User pool Overview: pool ID/name, region.
- `[SCREENSHOT REQUIRED]` Sign-in experience: email username/verification.
- `[SCREENSHOT REQUIRED]` App client: public/no secret, auth flows.
- `[SCREENSHOT REQUIRED]` Groups list.
- `[SCREENSHOT REQUIRED]` API Gateway JWT authorizer: issuer/audience/scope.
- `[SCREENSHOT REQUIRED]` Lambda environment variables, che token/secret.
- `[SCREENSHOT REQUIRED]` DynamoDB Customers/Business tables ACTIVE + key schema.
- `[SCREENSHOT REQUIRED]` Browser `/auth` và `/admin` sau login; không chụp password/token.

Ảnh phải thể hiện trạng thái đã lưu; ảnh màn hình nhập liệu trước Save chỉ là thao tác chưa xác nhận. Không dùng ảnh của lab để đánh dấu nhóm manual đã cấu hình.

## Kiểm tra sau setup

- Anonymous `/products` vẫn 200; `/me/profile` không token trả 401.
- Customer token đọc được profile/cart, không đọc admin nếu thiếu role.
- Warehouse đọc inventory nhưng không sửa product/campaign; owner/manager được cấp đúng endpoint.
- Đăng nhập admin và khách dùng cùng màn `/auth`; `/auth/me` quyết định role server-side.
- Logout làm token cũ trả 401.
- Không tạo đơn thật trong bài kiểm tra nếu chưa có fixture/approval.

## Bổ sung chi tiết app client và thứ tự phụ thuộc

Tạo pool/client/groups sau bảng/queue và trước IAM/Lambda/API. Trong wizard chọn public/single-page app, không secret. Kiểm tra rõ USER_PASSWORD_AUTH và REFRESH_TOKEN_AUTH; mặc định chỉ SRP không đủ cho source hiện tại. Bật token revocation, chống user-existence disclosure, access token 10 phút. Client Read attributes: email, email_verified, name, sub; Write: email, name; không cho browser tự ghi email_verified. Direct SDK password auth hiện tại không bắt buộc hosted domain/callback URL.

Scope aws.cognito.signin.user.admin cho phép hoạt động access-token của Cognito, không cấp role admin. `/auth/me` đọc group thật; owner/manager/support đến admin, warehouse đến inventory; khách đến account. Backend vẫn kiểm tra role từng endpoint. Không dùng role tự gửi hoặc hidden menu để bảo vệ API.

## Tài liệu AWS chính thức

- [Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html)
- [App client](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-client-apps.html)
- [User groups](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-user-groups.html)
- [JWT authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html)
