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
