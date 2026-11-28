---
title: "5.3.10 Amazon Cognito and full-project setup"
weight: 10
draft: false
---

## Scope and dependency order

Cognito is service 10 for the current customer/staff/cart/voucher features. Nine-service guest instructions alone do not configure these features. Use an approved manual target inventory; do not create duplicate pools in the existing lab, send invitations or change live resources just for screenshots.

Create base DynamoDB/SQS first. Complete Cognito steps 1–6 below before final IAM/Lambda/API configuration. Then build and publish the frontend, test permitted flows and retain evidence. Service numbering does not override these dependencies.

## Reference configuration read from AWS on 28 November 2026

| Setting | Existing lab reference |
|---|---|
| Region | us-east-1 |
| User Pool | us-east-1_mIpzTH61t, flashrush-customers |
| Public client | 5h7dn6hr6iub9ghat5jiir4ipg; no secret |
| Username | email |
| Auto verification / recovery | verified email |
| Password | minimum 12 characters; uppercase, lowercase, numbers and symbols |
| Access token | 10 minutes |
| Auth flows | ALLOW_USER_PASSWORD_AUTH, ALLOW_REFRESH_TOKEN_AUTH |
| Groups | owner, manager, warehouse, support |
| Issuer | https://cognito-idp.us-east-1.amazonaws.com/us-east-1_mIpzTH61t |
| JWT audience | public client ID |
| Required access-token scope | aws.cognito.signin.user.admin |

These values document the reference lab, not a new student's manual target. [Read-only configuration evidence](/downloads/flashrush-extended/verified-lab-config-20261128.json) contains no passwords, tokens or private user records. This is configuration evidence, not proof of executing the creation wizard.

## Console steps

1. Console → Cognito → User pools → Create user pool/application. Choose email sign-in, allow customer self-registration only when intended, and automatic email verification. For an existing pool, inspect rather than recreate immutable username choices.
2. Set password policy minimum 12 with uppercase/lowercase/number/symbol. Use verified email recovery. Delivery settings must be reviewed for the account and region. Do not use arbitrary mail recipients for tests.
3. App client → public/single-page app, no client secret. Verify explicit password auth and refresh auth; a wizard default supporting only SRP is insufficient for the current SDK flow. Enable token revocation and PreventUserExistenceErrors; access token validity 10 minutes.
4. Client read attributes: email, email_verified, name, sub. Write attributes: email, name. Do not make email_verified writable by the browser. Record pool/client IDs and issuer in inventory. A hosted domain/callback is not required by the current direct USER_PASSWORD_AUTH form.
5. Groups → create owner, manager, warehouse and support. Group names alone do not assign a user. With owner approval, add only the intended verified staff identity to its least-privilege group. Registered customers have no staff group.
6. Verify existing staff membership without changing it. Never mark an unverified address verified merely for a screenshot, publish passwords or send invitations without authorization.
7. DynamoDB: add Customers with String partition userId and String sort recordId; Business with String partition id. Use on-demand/encryption and wait ACTIVE. Preserve Products/Orders/Campaigns.
8. IAM: use the [extended API policy](/downloads/flashrush-extended/api-role-policy.json) and [Worker policy](/downloads/flashrush-extended/worker-role-policy.json) after replacing manual account/pool placeholders. Runtime roles are not AdministratorAccess. Read the full-project section in 5.3.3.
9. Lambda: deploy all five modules from the same reviewed revision. Configure USER_POOL_ID, USER_POOL_CLIENT_ID, CUSTOMER_CLIENT_ID, CUSTOMER_ISSUER, CUSTOMERS_TABLE and BUSINESS_TABLE along with Products/Orders/Campaigns/Queue settings. API also needs monitoring environment names. Read 5.3.4.
10. API Gateway → Authorizers → JWT: identity source $request.header.Authorization, correct issuer and audience. Attach authorizer plus aws.cognito.signin.user.admin scope to protected /me/*, /admin/*, GET /auth/me and POST /auth/logout. Keep public catalog/guest/authentication routes configured as documented in the route matrix. This scope is not an admin role: backend checks current groups.
11. CORS: exact target CloudFront origin, authorization/content-type/idempotency-key/x-order-token; GET/POST/PUT/PATCH/DELETE/OPTIONS. Save/Deploy and verify preflight. Do not reuse another environment's client/API or expect a bearer-only browser to satisfy AWS_IAM signing.
12. Build frontend with HTTP mode, same-target API URL and public Cognito client/region. Publish assets before index and invalidate CloudFront. SPA rewrite must cover /auth, /staff/login, /account/*, /cart/* and /admin/*. The old staff login path redirects to the shared /auth form.

## Roles and features

| Feature | Data and authorization |
|---|---|
| Shared login | Cognito access token, then live /auth/me role verification |
| Profile/cart/customer orders | Customers table; owner-private /me/* |
| Voucher wallet/quote/redemption | Business table and server-validated checkout transaction |
| Stock adjustments | Product update and movement journal transaction |
| Staff/customer administration | Cognito live groups plus backend RBAC |
| Monitoring | actual CloudWatch metrics/alarms via staff JWT |

Owner and manager/support land in admin; warehouse lands in inventory; customers land in account. Endpoint permissions still differ: support cannot manage staff, warehouse cannot modify campaigns/products, and customers cannot write admin routes. Never use decoded client claims or a hidden menu as authorization.

## Required screenshots — pending authenticated Console session

Capture the saved User Pool overview, sign-in/password policy, public app client/auth flows, group list, Gateway JWT authorizer, redacted Lambda environment and Customers/Business key schemas. Also capture the shared /auth form and authorized destination without exposing credentials. Store images under static/images/5-Workshop/FLASHRUSH/evidence/5.3.10-Cognito and link the exact filenames.

CLI configuration reads succeeded, but this automated browser has no valid AWS Console session. No mock screenshot is substituted. Screenshots of existing resources must be labelled existing-configuration verification, not resource creation. A form before Save does not prove persisted setup.

## Validation and cleanup

Without signing in: products 200; protected profile 401. With authorized test identities: customer private reads work and admin write attempts return 403; staff receive the documented endpoint permissions; logout revokes/clears the session. A checkout test requires isolated fixtures and permission because it writes orders/stock/voucher usage. Do not send email or create purchases merely for screenshots.

Add Cognito clients/pool/groups and Customers/Business to the cleanup inventory. Deleting a pool removes users and is destructive; never delete the reference/shared pool. Cost needs actual Cognito MAU/tier and additional table/request/log assumptions. [Evidence and cost status]({{< relref "/5-Workshop/5.7-Baseline-and-evidence/" >}}).

## Official references

- [Cognito user pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html)
- [App client configuration](https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-client-apps.html)
- [User pool groups](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools-user-groups.html)
- [HTTP API JWT authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html)

## Console evidence captured — 2026-11-28

Read-only captures from the existing lab. Remaining API/Lambda/DynamoDB integration evidence is pending.

![Cognito User Pool overview](/images/5-Workshop/FLASHRUSH/evidence/5.3.10-Cognito/01-pool-overview.png)

![Cognito sign-in](/images/5-Workshop/FLASHRUSH/evidence/5.3.10-Cognito/02-sign-in.png)

![Cognito sign-up](/images/5-Workshop/FLASHRUSH/evidence/5.3.10-Cognito/03-sign-up.png)

![Cognito app client](/images/5-Workshop/FLASHRUSH/evidence/5.3.10-Cognito/04-app-client.png)

![Cognito groups](/images/5-Workshop/FLASHRUSH/evidence/5.3.10-Cognito/05-groups.png)

![Cognito app client detail: public client, flows, token settings](/images/5-Workshop/FLASHRUSH/evidence/5.3.10-Cognito/06-app-client-detail.png)

### Cognito mapping

Complete pool/client/groups first, then return to IAM, Lambda and API integration. Captured images show existing lab configuration; they are not proof of a new manual deployment. [Mapping Cognito]({{< relref "/5-Workshop/5.7-Baseline-and-evidence/" >}})
