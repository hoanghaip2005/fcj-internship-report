---
title: "5.6 Resource cleanup"
weight: 6
draft: false
---

## Scope and prerequisites

Destructive procedure: execute only after approval and evidence/backup capture, on your owned flashrush-manual resources in the verified account/region. Do not delete flashrush-lab, unrelated buckets, shared users or resources belonging to others. Do not run cleanup merely to obtain screenshots. Manual resources are not removed using Delete CloudFormation stack.

Stop traffic/tests. Resolve or preserve pending orders and messages; save logs, alarm history, data, inventory and owner. Inventory includes distribution/OAC/function, private bucket, HTTP API, two Lambdas/mapping, main queue/DLQ, Products/Orders/Campaigns, three alarms/log groups, SNS subscription/topic and two execution roles.

## Console deletion order

1. Worker → Triggers → disable owned event source mapping; verify disabled.
2. CloudFront → disable distribution, wait Deployed, delete; remove OAC/function only after no remaining association.
3. S3 → Empty owned bucket, including object versions/delete markers/incomplete multipart uploads when applicable; delete bucket.
4. Delete owned HTTP API.
5. Delete remaining mapping and both Lambdas.
6. Preserve needed messages, then delete main queue/DLQ.
7. Preserve data, then delete Products, Orders and Campaigns tables.
8. Delete three alarms and owned log groups.
9. Remove owned SNS subscription/topic.
10. Verify no functions reference roles; delete owned inline policies and execution roles, not the human sign-in user.

## Verify and hand over

Search inventory names/ARNs again; require absent/NotFound, not AccessDenied. Record leftovers, owner and next action. CloudFront propagation may take time. Check Billing/Cost Explorer after reporting delay: deleting resources does not erase accrued cost or instantly reduce a bill to zero. Mark cleanup complete only after actual evidence. Preserve the original local cleanup edits and reconcile them before publication if multiple authors are editing the guide.


## Required full-project configuration — 28 November 2026

Earlier guest screenshots/steps on this page are the foundation only. A full-feature rebuild must apply the configuration below and [5.3.10 Cognito]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}}). Do not mix the reference lab pool/client/tables with another manual deployment.


## Cognito extension cleanup

These deletion instructions apply only to an approved manual rebuild; no cleanup runs during documentation edits. Add Customers/Business, Cognito pool/client/groups, JWT authorizer and related logs to inventory. Preserve needed data, stop tests/UI and resolve PENDING first. Remove dependencies deliberately: stopped API/routes/authorizer, functions/mapping/queues/tables, then Cognito client/pool only after confirming no other frontend or app shares it.

Deleting a User Pool removes users/groups and is not ordinarily reversible. Never delete the reference lab pool us-east-1_mIpzTH61t, IAM sign-in users or other teams' data. Verify ownership, backups and approval before destructive steps. Remove a dedicated CI target/role only at the account owner's request. Cost estimates must include Cognito MAU/pricing tier, two additional tables and extra logs/requests, not reuse the old guest total.

### Cognito mapping

Use the inventory mapping to find every client/authorizer/Lambda/frontend dependency before deleting a pool. Deleting the pool does not clean DynamoDB or S3; deleting an IAM user is unrelated to website Cognito cleanup. [Mapping Cognito]({{< relref "/5-Workshop/5.7-Baseline-and-evidence/" >}})
