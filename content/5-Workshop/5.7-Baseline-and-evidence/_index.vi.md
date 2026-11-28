---
title: "5.7 Baseline, Cognito, chi phí và bằng chứng"
weight: 7
draft: false
---

## Phạm vi mở rộng

Track guest chín dịch vụ dùng sáu public route, không Cognito. Project hiện tại có phần mở rộng Cognito thứ 10 cho đăng nhập chung khách/admin, nhóm owner/manager/warehouse/support, cart/profile/orders, voucher wallet/quote, inventory và monitoring. Hai track phải có inventory và ảnh riêng; không lấy ảnh lab để đánh dấu manual đã dựng.

## Cấu hình lab đã đọc (read-only, 28/11/2026)

- User Pool `us-east-1_mIpzTH61t`, name `flashrush-customers`, region `us-east-1`.
- Public app client `5h7dn6hr6iub9ghat5jiir4ipg`, không dùng secret.
- Email username, email auto-verification, password tối thiểu 12 ký tự gồm hoa/thường/số/ký hiệu, recovery bằng email đã xác minh.
- Groups: `owner`, `manager`, `warehouse`, `support`.
- Access token 10 phút, refresh token bật, PreventUserExistenceErrors bật.
- API JWT issuer là User Pool issuer; audience là client ID; scope `aws.cognito.signin.user.admin`.
- Bảng mở rộng: `flashrush-lab-customers` (`userId` + `recordId`) và `flashrush-lab-business` (`id`).
- API Gateway hiện có JWT cho `/me/*` và `/admin/*`; `/products`, `/campaigns`, `/orders` guest routes vẫn public.

File cấu hình đọc-only đã lưu: `/downloads/flashrush-extended/verified-lab-config-20261128.json`. File này không chứa user, password, token hay secret.

## Bổ sung cấu hình Console

1. Cognito → User pools → tạo/kiểm tra email sign-in, auto verification và password policy.
2. App client → public client, không secret; bật password auth và refresh auth.
3. Groups → owner, manager, warehouse, support; phân quyền theo least privilege.
4. API Gateway → JWT authorizer: issuer + audience; gắn JWT scope vào `/me/*` và `/admin/*`.
5. Lambda → environment: `USER_POOL_ID`, `USER_POOL_CLIENT_ID`, `CUSTOMER_CLIENT_ID`, `CUSTOMER_ISSUER`, `CUSTOMERS_TABLE`, `BUSINESS_TABLE` cùng Products/Orders/Campaigns/Queue.
6. DynamoDB → tạo Customers và Business theo key ở trên, on-demand/encryption; không seed password/token.
7. CORS → `authorization`, content-type, idempotency-key và CloudFront origin đúng target.
8. Frontend → dùng màn `/auth` chung; sau login gọi `/auth/me`; role server-side quyết định `/admin`, `/admin/inventory` hoặc `/account`.

## Feature mapping

| Feature | AWS/API | Bằng chứng cần chụp |
|---|---|---|
| Đăng ký/đăng nhập | Cognito + `/auth/*` | User Pool, app client, browser `/auth` |
| Cart/profile/orders | Customers + `/me/*` | bảng key/schema, JWT route |
| Voucher | Business + `/me/vouchers*` | bảng Business, route, quote server |
| Admin/inventory/staff | Cognito groups + Business + `/admin/*` | groups, authorizer, role response |
| Monitoring | CloudWatch + `/admin/monitoring` | alarm/log/monitoring response |

Checkout phải quote lại server; stock và voucher redemption phải được transaction kiểm tra. Không dùng tổng tiền/trạng thái browser làm bằng chứng.

## Ảnh setup bắt buộc

Chụp sau khi Console hiển thị trạng thái đã lưu:

- User Pool Overview: name, ID, region.
- Sign-in experience: email username/verification.
- Password policy và app client: public/no secret, auth flows.
- Groups list.
- API Gateway JWT authorizer: issuer, audience, scope.
- Lambda environment variables, che secret/token.
- DynamoDB Customers/Business ACTIVE + key schema.
- Browser `/auth` và `/admin` sau login; không chụp password/token.

Ảnh hiện **CHƯA XÁC MINH** vì phiên AWS Console chưa đăng nhập được bằng federated link. Không đánh dấu PASS hoặc dùng ảnh mô phỏng. Khi chụp, lưu tại `static/images/5-Workshop/FLASHRUSH/evidence/5.3.10-Cognito/` và cập nhật tên file vào bảng trên.

## COST và architecture

COST chỉ PASS khi có AWS Pricing Calculator estimate URL/ID với workload, thời gian sống resource, Lambda/API, DynamoDB, S3/CloudFront, SQS/SNS, CloudWatch và Free Tier assumptions. Bảng USD 1.30/1.95/5 trong Proposal chỉ là planning allocation.

Sơ đồ phải có file editable, tác giả/ngày, AWS official icons và mapping với Cognito, Customers, Business, API JWT và sáu guest routes. Hình nhóm cung cấp hiện chỉ là reference.
