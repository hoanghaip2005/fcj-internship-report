---
title: "5.7 Cognito, configuration, cost and evidence"
weight: 7
draft: false
---

## Current scope

The current extended FLASHRUSH adds Cognito as service 10, customer/staff shared login, live groups/RBAC, customer carts/history, vouchers and real monitoring. The original nine-service guest instructions alone do not provision these features. Use [5.3.10]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}}) and each service page's full-project configuration section. Keep separate lab and manual inventories.

## Read-only AWS evidence, 28 November 2026

[Download sanitized reference lab configuration](/downloads/flashrush-extended/verified-lab-config-20261128.json). This includes public pool/client identifiers, route authorization types and CORS. It excludes users/passwords/tokens/secrets. The existing lab uses us-east-1_mIpzTH61t with public client 5h7dn6hr6iub9ghat5jiir4ipg, email sign-in/verification/recovery, 12-character mixed password policy, 10-minute access tokens and owner/manager/warehouse/support groups. Protected /me and /admin routes use JWT with required access-token scope; public guest/catalog routes remain public.

## Configuration to reproduce

1. Cognito email sign-in/verification/password policy and public client; password and refresh auth flows; correct attributes and revocation.
2. Customers table (userId, recordId) and Business table (id), on-demand/encryption.
3. Scoped runtime policies: [API](/downloads/flashrush-extended/api-role-policy.json), [Worker](/downloads/flashrush-extended/worker-role-policy.json). Replace placeholders, do not paste manual policies into stack-managed lab roles.
4. Five Lambda modules with same-target pool/client/issuer, five table names and queue URL; API monitoring environment.
5. JWT authorizer, scopes, full route matrix and exact-origin CORS; public auth routes remain explicit.
6. Matching frontend API/Cognito settings, full SPA rewrites, upload/invalidation and separate public/authenticated validation.

## Screenshot acceptance

Required: saved pool overview, sign-in/password policy, public app client and auth flows, groups, Gateway JWT, redacted Lambda env and Customers/Business key schemas. Also capture shared /auth and role-correct destination. Console captures now exist for pool overview, sign-in, sign-up, app client and groups; Gateway JWT, Lambda env, DynamoDB schemas and browser role routing remain PENDING. Existing-resource screenshots must not be described as creation wizard execution. Never fabricate evidence.

## Cost and diagram acceptance

Save a real Pricing Calculator estimate URL/ID using workload, lifetime, requests/durations/storage/transfer/logs/alarms and Cognito MAU/tier assumptions. The Proposal's USD 1.30/1.95/5 is planning allocation, not a verified quote. Include the two additional tables and authentication usage.

Architecture needs editable source, student author/date, official AWS icon provenance and mapping to Cognito/JWT/Customers/Business. The old team figure is reference material until reviewed. Do not invent author or approval details.

## Demo and cleanup

Reference extended website: https://d1jcrzj4650vey.cloudfront.net . Each manual team must record and verify its own domain, not reuse lab evidence. Check /auth, /account/orders, /admin and /cart/checkout deep links, then authorized role flows. New registrations/invites/purchases require an approved test scope. Deletion of Cognito/users/data is destructive: preserve data and verify ownership/dependencies first.

## Cognito cross-section mapping

The lab references below are for comparison only. Record your own pool/client/issuer in one manual inventory and use it consistently across every section.

| Source | Consumer / equality rule | Reference lab |
|---|---|---|
| User Pool ID | USER_POOL_ID; IAM userpool ARN | us-east-1_mIpzTH61t |
| Public client ID | USER_POOL_CLIENT_ID = CUSTOMER_CLIENT_ID = VITE_COGNITO_CLIENT_ID = JWT audience | 5h7dn6hr6iub9ghat5jiir4ipg |
| Issuer | CUSTOMER_ISSUER = API JWT issuer | https://cognito-idp.us-east-1.amazonaws.com/us-east-1_mIpzTH61t |
| Region | VITE_COGNITO_REGION; Cognito SDK/Lambda region; issuer region | us-east-1 |
| Access token scope | JWT route scopes; business.identity checks | aws.cognito.signin.user.admin |
| Groups | Live AdminListGroupsForUser; backend authorize; frontend destination | owner / manager / warehouse / support |
| Customer identity | Cognito sub = Customers.userId; not email or Identity Pool ID | Customers: userId + recordId |
| Business storage | BUSINESS_TABLE; redemption/stock transactions | Business: id |

Order: DynamoDB/SQS → Cognito pool/client/groups → IAM → Lambda → API JWT → frontend/CloudFront → tests → cleanup. API/JWT instructions in the Cognito page refer to later integration, not early API creation.

Website sign-in uses User Pools, not Identity Pools/STS or IAM console users. The owner group does not grant AWS AdministratorAccess. Backend reads live groups; /admin/users is owner-only. Inventory: owner/manager/warehouse; customers: owner/manager/support; monitoring: owner/manager. Support may enter the admin UI without full access.

For login 401, check email_verified, access rather than ID token, issuer/client/scope, Enabled state and revocation. For 403, check group/endpoint permissions; do not bypass RBAC using an API key or CORS changes. Missing IAM produces AccessDenied in CloudWatch, a different failure.

[Cognito setup and Console evidence]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}})
