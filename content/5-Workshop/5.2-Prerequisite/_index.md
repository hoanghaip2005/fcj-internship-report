---
title: "5.2 AWS Console prerequisites"
weight: 2
draft: false
---

## Account and tools

Use an authorized IAM identity, not root. Verify your own 12-digit account ID and us-east-1 in Console. Do not create access keys for this Console lab. Check Lambda concurrency quotas; API and other workloads share the account quota. Agree a namespace and budget with the owner before creating resources. Never overwrite another team's flashrush-manual resources.

Required local tools: Git, Node.js 22.12+ and npm; Lambda runtime Python 3.12. No CLI credentials are needed to create infrastructure in this track. Source revision is pinned, not a claim that this is the newest main:

```powershell
git clone https://github.com/kinnynee/FLASHRUSH-Serverless-Flash-Sale.git
Set-Location FLASHRUSH-Serverless-Flash-Sale
git checkout --detach d6b3b2568bb2d9bea05d03391c9c7cb624f75f19
if ($LASTEXITCODE -ne 0) { throw 'Baseline checkout failed' }
git rev-parse HEAD
Set-Location FLASHRUSH-Serverless-Flash-Sale
Test-Path backend/app.py
Test-Path frontend/package-lock.json
```

Both Test-Path checks must return True. Keep the nested Git/application structure. Preserve local edits before changing revision; do not reset --hard. Do not rely on an unshipped source-snapshot or SOURCE_MANIFEST.json.

## Inventory

Use flashrush-manual-products/orders/campaigns tables; flashrush-manual-orders/dlq queues; flashrush-manual-api/worker functions; separate execution roles; HTTP API; private bucket flashrush-manual-web-YOUR_AWS_ACCOUNT_ID-us-east-1; CloudFront OAC/rewrite; SNS alerts topic. Replace account placeholders consistently. Save table/queue/role ARNs, queue URL, API endpoint, bucket, distribution ID/domain, topic ARN and owner in a private inventory.

Both functions require app.py, business.py, customer.py, monitoring.py and vouchers.py at the ZIP/editor root from this revision. Dependencies must not be taken from another revision. Guest baseline requires PRODUCTS_TABLE, ORDERS_TABLE, CAMPAIGNS_TABLE and QUEUE_URL. Do not provision Cognito/Customers/Business unless following a separate extension guide.

Operator permissions include the nine services and IAM role creation/PassRole; execution policies are narrower. Check permission boundaries/SCPs with the owner, not by granting unrestricted policies to runtime roles. Cost notifications are not spending caps. Record resources for cleanup.
