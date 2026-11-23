---
title: "Testing and monitoring"
weight: 5
chapter: false
flashrush: true
pre: "<b>5.5. </b> "
---

## Objective

Verify idempotency, stock and recovery using correctly defined metrics.

## Knowledge and inputs

Basic AWS Console, PowerShell and Git knowledge. Use the same approved lab account, region and session variables from 5.2. Provision only through the repository scripts; Console steps inspect resources, not create duplicates. All commands below run from the inner application root unless stated otherwise.

## A–H test matrix

Save setup, commit/hashes/target, UTC, expected/actual and public snapshots. Never include raw keys/tokens in evidence or PowerShell transcripts.

| Test | Setup / action | PASS / limitation |
|---|---|---|
| A success | Approved stock≥1 lab SKU, POST quantity1, token polling | CONFIRMED, stock decreases once |
| B sold out | Authorized stock0 fixture, valid POST | OUT_OF_STOCK, stock0; never zero an active product |
| C same key | Two same UUIDv4/payload requests, including timeout retries | Same orderId, one decrement; concurrent offline test exists |
| D conflict | Same key, different productId, quantity1 | HTTP409, original order/stock unchanged |
| E duplicate | Verifier stock2 SKU, confirmed-message replay, wait for terminal-noop log | Consumption log observed, stock1, terminal unchanged; timeout fails |
| F retry/DLQ | Offline poison/throttle/conflict injection; scoped live fixture only with approval | Failed item not ACKed, retried then DLQ; fix cause before redrive and validate invariant; live NOT VERIFIED |
| G pending | Reconciliation dry-run and age/attempt inspection | Exit0 no overdue; exit2 overdue remains; SENT needs queue/log investigation; resend only expired unsent lease, max3 sends |
| H100/10 | Unique stock10 SKU,100 keys,max_workers10 |100 accepted/terminal,10 confirmed,90 OOS,stock0,all checks true |

## One order and replay
```powershell
# MUTATION: one approved lab order. Select a known in-stock lab SKU.
$ProductId = Read-Host 'Approved lab productId'
$Key = [guid]::NewGuid().ToString().ToLowerInvariant()
$Body = @{ productId=$ProductId; quantity=1 } | ConvertTo-Json -Compress
$Headers = @{ 'Idempotency-Key'=$Key }
$Order = Invoke-RestMethod ($Outputs.ApiUrl + '/orders') -Method Post -ContentType 'application/json' -Headers $Headers -Body $Body
$Order | Select-Object orderId, status, accepted
$OrderId = $Order.orderId
$Until = (Get-Date).AddSeconds(90)
do {
  Start-Sleep -Seconds 2
  $Current = Invoke-RestMethod ($Outputs.ApiUrl + '/orders/' + $OrderId) -Headers @{ 'X-Order-Token'=$Key }
} while ($Current.status -eq 'PENDING' -and (Get-Date) -lt $Until)
$Current | Select-Object orderId, status, quantity
# Replay the exact key and payload, never generate a new key for a timeout retry.
$Replay = Invoke-RestMethod ($Outputs.ApiUrl + '/orders') -Method Post -ContentType 'application/json' -Headers $Headers -Body $Body
if ($Replay.orderId -ne $OrderId) { throw 'Replay created a different order' }
```
Expect POST202 or200 terminal replay, followed by a terminal state after processing. Test D reuses Headers with a different productId body: expect409 without changing key. PowerShell5 may throw for409; inspect Exception.Response.StatusCode in catch. Missing/incorrect X-Order-Token must return404. Do not print $Key.
[SCREENSHOT REQUIRED: Public order result and DynamoDB stock before/after; images/5-Workshop/15-single-order.png]

## Reconciliation and load verification
```powershell
# Read-only catalog and recovery inspection
$Catalog = Invoke-RestMethod ($Outputs.ApiUrl + '/products')
$Catalog.items | Select-Object productId, stock
.venv/Scripts/python scripts/ops/reconcile_pending.py @LabArgs --min-age-seconds 300
$RecoveryExit = $LASTEXITCODE
if ($RecoveryExit -notin @(0,2)) { throw 'Recovery inspection failed' }
```

```powershell
# MUTATION: run ONLY after specific live-load/duplicate-test authorization
.venv/Scripts/python scripts/deploy/verify.py @LabArgs
if ($LASTEXITCODE -ne 0) { throw 'Live verification failed; inspect evidence' }
Get-ChildItem tests/evidence/aws-*.json | Sort-Object LastWriteTime -Descending | Select-Object -First 1
```
--resend is a separate mutation: do not append it automatically. Obtain authorization and use the same target/threshold. Exit2 after resend may still be correct until worker completion; inspect again. Do not set FAILED or reset stock.

Live F needs a scoped fixture and rollback plan; do not disable a shared worker, poison production queues or redrive merely for screenshots. This guide provides a checklist, not an execution claim. Verify actual DLQ arrival, receive counts, redrive task/state, terminal order and stock invariant. Count0 alone is insufficient.
[SCREENSHOT REQUIRED: 100/10 report with maxWorkers10 and DynamoDB invariant; images/5-Workshop/16-load.png]

[SCREENSHOT REQUIRED: Authorized real retry/DLQ/redrive and reconciliation; images/5-Workshop/17-dlq-recovery.png]

## Interpret the report

submittedUnique=100 intents; acceptedUnique=ACKed orders; terminal=completed orders; httpAttempts counts intake retries only, not all GET/check traffic. states lists CONFIRMED/OUT_OF_STOCK/PENDING/FAILED. Stock fields belong to the load SKU; the separate duplicate fixture is excluded from100/10. Client max_workers10 differs from mapping maximum concurrency5. Seconds includes auxiliary checks, not latency percentiles.

Historical aws-3bf9033f.json on18 November:100 accepted,10/90/0/0,113 intake attempts (100×202,13×429),224.26s. Its duplicate assertion had limitations now fixed in source; history does not validate the revised verifier. The20 November12-check smoke is not a load/fault test. Keep new evidence separate and preserve historical results.

## Troubleshooting

Failures: preserve redacted report/manifests/logs and inspect missing ACK/overdue/stock.202 is not a successful sale.429 indicates throttling; do not infer peak throughput from this run.

## Checkpoint and rollback

Record the expected output, UTC, commit and target. Stop on mismatch; do not label an unexecuted step PASS. Read-only inspection needs no rollback. If a mutation fails, preserve manifests and events; use the rollback/cleanup procedure in 5.6 after ownership checks. No cleanup is executed by reading this page.

[Next step]({{< relref "/5-Workshop/5.6-Cleanup/" >}})
