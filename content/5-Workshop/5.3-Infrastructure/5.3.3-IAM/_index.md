---
title: "5.3.3 AWS IAM"
weight: 3
draft: false
---

## Prepare logs and separate runtime roles

CloudWatch → Log groups → Create /aws/lambda/flashrush-manual-api, /aws/lambda/flashrush-manual-worker and the API access-log group. Set retention 7 days. IAM → Roles → Create role → AWS service → Lambda. Create flashrush-manual-api-role and flashrush-manual-worker-role with Lambda trust, not AdministratorAccess.

API permissions: Products GetItem/Scan, Orders GetItem/PutItem/UpdateItem, Campaigns GetItem/Scan, main queue SendMessage, own log group's CreateLogStream/PutLogEvents. Worker: Products and Orders GetItem/UpdateItem/ConditionCheckItem; Campaigns GetItem/Scan/ConditionCheckItem; main queue ReceiveMessage/DeleteMessage/GetQueueAttributes; own logs CreateLogStream/PutLogEvents. Use [API policy](/downloads/flashrush-console/api-policy.json) and [Worker policy](/downloads/flashrush-console/worker-policy.json), replacing the account placeholders. Do not grant a fictitious dynamodb:TransactWriteItems action: authorize the item-level transaction operations.

Use account/region-specific table, queue and log ARNs. No Products PutItem runtime permission is needed when seed data is created through Console. Guest functions do not need Cognito administration or Business table permissions. Do not attach full-access policies to hide AccessDenied.

Console → each role → Permissions → Create inline policy → JSON → replace account placeholders → validate → create. Verify the policy was saved and role trust is Lambda. PassRole for the human operator is separate from runtime permissions. Check denied actions and CloudWatch logs when invocation fails.


## Historical Console screenshots

These shared images document the original manual exercise. Settings before Save and older three-variable/two-table/four-route layouts are not the current target; compare the service configuration tables. Screenshots do not prove the new baseline has been executed.

![Historical Console evidence 1](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-01.png)

*Figure 1. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 2](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-02.png)

*Figure 2. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 3](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-03.png)

*Figure 3. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 4](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-04.png)

*Figure 4. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 5](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-05.png)

*Figure 5. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 6](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-06.png)

*Figure 6. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 7](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-07.png)

*Figure 7. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 8](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-08.png)

*Figure 8. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 9](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-09.png)

*Figure 9. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 10](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-10.png)

*Figure 10. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 11](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-11.png)

*Figure 11. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 12](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-12.png)

*Figure 12. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 13](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-13.png)

*Figure 13. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 14](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/update-006.png)

*Figure 14. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 15](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/update-007.png)

*Figure 15. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 16](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/update-008.png)

*Figure 16. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 17](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/update-009.png)

*Figure 17. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 18](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/update-010.png)

*Figure 18. Historical Console evidence; verify the saved configuration against the steps above.*


## Required full-project configuration — 28 November 2026

Earlier guest screenshots/steps on this page are the foundation only. A full-feature rebuild must apply the configuration below and [5.3.10 Cognito]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}}). Do not mix the reference lab pool/client/tables with another manual deployment.


Use the [complete API policy](/downloads/flashrush-extended/api-role-policy.json) and [complete Worker policy](/downloads/flashrush-extended/worker-role-policy.json), replacing YOUR_AWS_ACCOUNT_ID and YOUR_USER_POOL_ID before saving. These policies target manual resources, not stack-managed lab roles.

API needs Customers Query/Get/Put/Update and Business Get/Put/Scan; inventory transactions require Products Update and Business Put. Staff identity/management requires scoped Cognito user/group actions for the chosen pool. Worker needs Customers Update, Business Get/Put/Update and Campaigns ConditionCheckItem. Monitoring requires CloudWatch GetMetricData (no individual resource ARN restriction for this action) plus prefix-scoped DescribeAlarms. Human IAM provisioning permissions differ from runtime permissions. A JWT scope does not replace backend RBAC.

### Cognito mapping

Replace YOUR_USER_POOL_ID with the same pool used by Lambda USER_POOL_ID. Scope Cognito Admin*/ListUsers actions to that pool ARN. Browser users receive no IAM runtime credentials. [Mapping Cognito]({{< relref "/5-Workshop/5.7-Baseline-and-evidence/" >}})
