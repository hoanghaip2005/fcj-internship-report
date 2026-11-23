---
title: "Application deployment"
weight: 4
chapter: false
flashrush: true
pre: "<b>5.4. </b> "
---

## Objective

Publish catalog and HTTP frontend against the deployed backend.

## Knowledge and inputs

Basic AWS Console, PowerShell and Git knowledge. Use the same approved lab account, region and session variables from 5.2. Provision only through the repository scripts; Console steps inspect resources, not create duplicates. All commands below run from the inner application root unless stated otherwise.

## 1. Backend and artifact

Backend was deployed with infrastructure in5.3.1. After backend changes rerun deploy.py with the same @LabArgs, wait and inspect manifest/hash. Do not mix Console uploads with IaC or deploy stale artifact snapshots. A clean checkout has no .build/catalog.json; export it from demo source first.

## 2. Build/seed/upload — AWS mutations

From application root after npm ci and passing tests:
```powershell
npm run catalog:export --prefix frontend
if ($LASTEXITCODE -ne 0) { throw 'Catalog export failed' }
Get-Item .build/catalog.json
.venv/Scripts/python scripts/deploy/publish.py @LabArgs
if ($LASTEXITCODE -ne 0) { throw 'Publish incomplete; preserve manifests and rollback directory' }
Start-Process $Outputs.WebsiteUrl
$Catalog = Invoke-RestMethod ($Outputs.ApiUrl + '/products')
$Catalog.items | Select-Object productId, stock, saleEndsAt
```
The exporter runs locally with the locked TypeScript compiler. Publish validates catalog before writes, builds HTTP mode with stack ApiUrl, downloads the previous site to .build/rollback/<UTC>, conditionally seeds only missing products with7-day deadlines, and never resets existing stock. Assets precede index; S3 readback verifies hashes; script waits for invalidation Completed and records a completed manifest. Preserve rollback/manifests outside the bucket. Multi-object deployment is not atomic, and HTML rollback does not revert seeding.
[SCREENSHOT REQUIRED: Publish completion, manifest path and CloudFront invalidation; images/5-Workshop/13-publish.png]

## 3. Mock versus HTTP mode

npm run dev defaults to mock. For local HTTP set `$env:VITE_ORDER_MODE='http'` and `$env:VITE_API_BASE_URL=$Outputs.ApiUrl`, then restart Vite. Publish sets build-time values automatically; no secrets belong in .env. Admin/Monitoring remain mock. Storage v2 isolates mode/API URL without migrating old token namespaces. Keep the session for same-key recovery; lost token ownership cannot be restored by an account API.

## 4. Browser checkpoint

WebsiteUrl → Products → in-stock/unexpired product → quantity1 → Checkout → submit → Processing → Result. Network: POST202 after ACK; GET polling carries X-Order-Token; CONFIRMED follows worker processing. Never capture token headers. Check deep-link refresh, missing assets, Console errors and mobile. Place orders only within authorized lab scope.
[SCREENSHOT REQUIRED: HTTP checkout/processing/confirmed without bearer tokens; images/5-Workshop/14-checkout.png]

Expect a nonempty catalog, correct asset hashes/content types, completed invalidation and the chosen ApiUrl. Compare public order/stock with DynamoDB. Unexecuted browser steps remain NOT VERIFIED; mock images are not live evidence.

## Troubleshooting

Missing catalog: export first. Build failure: do not seed/upload. Backup AccessDenied: do not skip backup. Existing stock/deadlines remain unchanged; use new fixtures rather than overwriting active products. Invalidation timeout: preserve prepared manifest and inspect actual status before retry.

## Checkpoint and rollback

Record the expected output, UTC, commit and target. Stop on mismatch; do not label an unexecuted step PASS. Read-only inspection needs no rollback. If a mutation fails, preserve manifests and events; use the rollback/cleanup procedure in 5.6 after ownership checks. No cleanup is executed by reading this page.

[Next step]({{< relref "/5-Workshop/5.5-Testing-and-monitoring/" >}})
