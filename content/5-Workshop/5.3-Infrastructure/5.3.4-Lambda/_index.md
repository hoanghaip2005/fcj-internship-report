---
title: "5.3.4 AWS Lambda"
weight: 4
draft: false
---

## Create API and Worker

Console → Lambda → Create function → Author from scratch. API name flashrush-manual-api, Python 3.12, ARM64, existing API execution role. In Code create app.py, business.py, customer.py, monitoring.py and vouchers.py at root; paste exact content from the pinned baseline and Deploy. Runtime settings → Handler app.api → Save. Configuration → General → memory 256 MB, timeout 15 seconds.

Configuration → Environment variables → Edit: PRODUCTS_TABLE=flashrush-manual-products, ORDERS_TABLE=flashrush-manual-orders, CAMPAIGNS_TABLE=flashrush-manual-campaigns, QUEUE_URL=main queue URL. Save and verify all four. Historical images with three variables describe an older source and are not the current target.

Create flashrush-manual-worker using the same five modules and four variables, Worker role, Python 3.12/ARM64, 256 MB/15 seconds; handler app.worker. Runtime boto3 is available. Do not copy just app.py from moving main: imports may fail or require different configuration.

## Trigger and direct read test

Worker → Add trigger → SQS → main queue ARN → batch size 1, window 0, maximum concurrency 5 subject to quota → enable partial batch item failures → Add. Wait for Enabled; do not create duplicate mappings while Creating.

API → Test → private synchronous test event with rawPath=/products, requestContext.http.method=GET, headers={}, body empty. Expect statusCode=200 and items JSON. Execution succeeded with a body 503 is not a passing API test. Compare function ARN, handler, code Deploy status, env, role and logs. Direct Lambda Test does not verify HTTP Gateway/CORS; test those separately.


## Historical Console screenshots

These shared images document the original manual exercise. Settings before Save and older three-variable/two-table/four-route layouts are not the current target; compare the service configuration tables. Screenshots do not prove the new baseline has been executed.

![Historical Console evidence 1](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-01.png)

*Figure 1. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 2](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-02.png)

*Figure 2. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 3](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-03.png)

*Figure 3. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 4](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-04.png)

*Figure 4. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 5](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-05.png)

*Figure 5. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 6](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-06.png)

*Figure 6. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 7](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-07.png)

*Figure 7. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 8](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-08.png)

*Figure 8. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 9](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-09.png)

*Figure 9. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 10](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-10.png)

*Figure 10. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 11](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-11.png)

*Figure 11. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 12](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-12.png)

*Figure 12. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 13](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-13.png)

*Figure 13. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 14](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-14.png)

*Figure 14. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 15](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-15.png)

*Figure 15. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 16](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-16.png)

*Figure 16. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 17](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-17.png)

*Figure 17. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 18](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-18.png)

*Figure 18. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 19](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-19.png)

*Figure 19. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 20](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-20.png)

*Figure 20. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 21](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-21.png)

*Figure 21. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 22](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-22.png)

*Figure 22. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 23](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-23.png)

*Figure 23. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 24](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-24.png)

*Figure 24. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 25](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-25.png)

*Figure 25. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 26](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-26.png)

*Figure 26. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 27](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-27.png)

*Figure 27. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 28](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-28.png)

*Figure 28. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 29](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-29.png)

*Figure 29. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 30](/images/5-Workshop/FLASHRUSH/evidence/5.3.4-Lambda/image-30.png)

*Figure 30. Historical Console evidence; verify the saved configuration against the steps above.*


## Required full-project configuration — 28 November 2026

Earlier guest screenshots/steps on this page are the foundation only. A full-feature rebuild must apply the configuration below and [5.3.10 Cognito]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}}). Do not mix the reference lab pool/client/tables with another manual deployment.


Both API and Worker packages must include app.py, business.py, customer.py, monitoring.py and vouchers.py at package root from one reviewed revision. Handlers remain app.api/app.worker. Configure both functions from the manual inventory:

```dotenv
PRODUCTS_TABLE=flashrush-manual-products
ORDERS_TABLE=flashrush-manual-orders
CAMPAIGNS_TABLE=flashrush-manual-campaigns
CUSTOMERS_TABLE=flashrush-manual-customers
BUSINESS_TABLE=flashrush-manual-business
QUEUE_URL=YOUR_MANUAL_MAIN_QUEUE_URL
USER_POOL_ID=YOUR_MANUAL_POOL_ID
USER_POOL_CLIENT_ID=YOUR_MANUAL_PUBLIC_CLIENT_ID
CUSTOMER_CLIENT_ID=YOUR_MANUAL_PUBLIC_CLIENT_ID
CUSTOMER_ISSUER=https://cognito-idp.us-east-1.amazonaws.com/YOUR_MANUAL_POOL_ID
```

API also needs MONITORING_API_FUNCTION, MONITORING_WORKER_FUNCTION, MONITORING_QUEUE_NAME, MONITORING_DLQ_NAME and MONITORING_ALARM_NAMES for the manual namespace. Environment names do not grant IAM permissions. Do not enable legacy API-key bypass to avoid JWT, or place secrets in VITE variables. Retain SQS partial batch failures and visibility settings.

### Cognito mapping

USER_POOL_CLIENT_ID and CUSTOMER_CLIENT_ID must equal frontend client ID and authorizer audience. CUSTOMER_ISSUER must be the exact pool issuer. Business identity reads live Cognito groups; customer identity requires verified email. [Mapping Cognito]({{< relref "/5-Workshop/5.7-Baseline-and-evidence/" >}})
