---
title: "5.3.5 Amazon API Gateway"
weight: 5
draft: false
---

## Create HTTP API

Console → API Gateway → Create API → HTTP API → Build. Integration Lambda flashrush-manual-api, payload format 2.0, name flashrush-manual-api. Create six public routes:

| Method | Path |
|---|---|
| GET | /products |
| GET | /products/{productId} |
| GET | /campaigns |
| GET | /campaigns/{campaignId} |
| POST | /orders |
| GET | /orders/{orderId} |

All integrations target API Lambda. Guest routes use NONE authorization; order reads require the application X-Order-Token. Do not create protected admin or /me routes in this guest track. Lambda resource-based permission must allow this API to invoke the correct function; Console normally creates it, verify SourceArn.

Stages → $default → auto-deploy enabled; copy Invoke URL without adding /prod. CORS: actual CloudFront HTTPS origin and only needed local development origins; methods GET/POST/OPTIONS; headers content-type/idempotency-key/x-order-token. Add each origin then Save. Update with your distribution domain after 5.3.7. Public frontend variables are not secrets.

Enable JSON access logs to the owned log group, omitting request bodies/authorization tokens. Test /products and /campaigns over HTTPS before testing browser purchases. Four-route historical images must be updated with both campaign routes. Debug 404 at routes/stage, 500/503 at permission/handler/env, and CORS in saved settings and Network responses.


## Historical Console screenshots

These shared images document the original manual exercise. Settings before Save and older three-variable/two-table/four-route layouts are not the current target; compare the service configuration tables. Screenshots do not prove the new baseline has been executed.

![Historical Console evidence 1](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-01.png)

*Figure 1. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 2](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-02.png)

*Figure 2. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 3](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-03.png)

*Figure 3. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 4](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-04.png)

*Figure 4. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 5](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-05.png)

*Figure 5. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 6](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-06.png)

*Figure 6. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 7](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-07.png)

*Figure 7. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 8](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-08.png)

*Figure 8. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 9](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-09.png)

*Figure 9. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 10](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-10.png)

*Figure 10. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 11](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-11.png)

*Figure 11. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 12](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-12.png)

*Figure 12. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 13](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-13.png)

*Figure 13. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 14](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-14.png)

*Figure 14. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 15](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-15.png)

*Figure 15. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 16](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-16.png)

*Figure 16. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 17](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-17.png)

*Figure 17. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 18](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-18.png)

*Figure 18. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 19](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-19.png)

*Figure 19. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 20](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-20.png)

*Figure 20. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 21](/images/5-Workshop/FLASHRUSH/evidence/5.3.5-API-Gateway/image-21.png)

*Figure 21. Historical Console evidence; verify the saved configuration against the steps above.*


## Required full-project configuration — 28 November 2026

Earlier guest screenshots/steps on this page are the foundation only. A full-feature rebuild must apply the configuration below and [5.3.10 Cognito]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}}). Do not mix the reference lab pool/client/tables with another manual deployment.


Create the JWT authorizer from 5.3.10: pool issuer, public-client audience, identity source `$request.header.Authorization`. Protected routes require scope `aws.cognito.signin.user.admin`; this is an access-token scope, **not an admin role grant**. Backend verifies live group membership and per-endpoint roles.

Attach the authorizer to each JWT route, Save/Deploy, and use payload 2.0 integration with the API Lambda. CORS: exact CloudFront origin; content-type, authorization, idempotency-key, x-order-token headers; GET/POST/PUT/PATCH/DELETE/OPTIONS methods. Sending a token to a NONE route does not make it protected.

Read-only reference lab route inventory, 28 Nov 2026; reproduce equivalent paths in your approved manual target and verify them independently:

| Method | Path | Authorization |
|---|---|---|
| DELETE | `/admin/campaigns/{campaignId}` | JWT |
| GET | `/admin/customers` | JWT |
| GET | `/admin/inventory` | JWT |
| GET | `/admin/inventory/movements` | JWT |
| GET | `/admin/monitoring` | JWT |
| GET | `/admin/orders` | JWT |
| GET | `/admin/overview` | JWT |
| GET | `/admin/users` | JWT |
| GET | `/admin/vouchers` | JWT |
| GET | `/auth/me` | JWT |
| GET | `/campaigns` | NONE |
| GET | `/campaigns/{campaignId}` | NONE |
| GET | `/me/cart` | JWT |
| GET | `/me/checkout-quote` | JWT |
| GET | `/me/checkouts/{checkoutId}` | JWT |
| GET | `/me/orders` | JWT |
| GET | `/me/orders/{orderId}` | JWT |
| GET | `/me/profile` | JWT |
| GET | `/me/vouchers` | JWT |
| GET | `/orders/{orderId}` | NONE |
| GET | `/products` | NONE |
| GET | `/products/{productId}` | NONE |
| PATCH | `/admin/campaigns/{campaignId}` | JWT |
| PATCH | `/admin/customers` | JWT |
| PATCH | `/admin/products/{productId}` | JWT |
| PATCH | `/admin/users` | JWT |
| PATCH | `/admin/vouchers` | JWT |
| POST | `/admin/campaigns` | JWT |
| POST | `/admin/inventory/adjustments` | JWT |
| POST | `/admin/products` | JWT |
| POST | `/admin/users` | JWT |
| POST | `/admin/vouchers` | JWT |
| POST | `/auth/confirm` | NONE |
| POST | `/auth/forgot-password` | NONE |
| POST | `/auth/login` | NONE |
| POST | `/auth/logout` | JWT |
| POST | `/auth/new-password` | NONE |
| POST | `/auth/register` | NONE |
| POST | `/auth/reset-password` | NONE |
| POST | `/me/checkout-quote` | JWT |
| POST | `/me/checkouts` | JWT |
| POST | `/me/vouchers` | JWT |
| POST | `/me/vouchers/quote` | JWT |
| POST | `/me/vouchers/save` | JWT |
| POST | `/orders` | NONE |
| PUT | `/me/cart` | JWT |
| PUT | `/me/profile` | JWT |

Protected anonymous requests must return 401; customer attempts at admin writes must return 403. Hidden UI controls are not authorization. Do not require AWS_IAM from a bearer-only browser unless a deliberate SigV4 path exists.
