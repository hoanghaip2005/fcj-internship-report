---
title: "FLASHRUSH overview"
weight: 1
chapter: false
flashrush: true
pre: "<b>5.1. </b> "
---

## Objective

Understand asynchronous intake and stock invariants.

## Knowledge and inputs

Basic AWS Console, PowerShell and Git knowledge. Use the same approved lab account, region and session variables from 5.2. Provision only through the repository scripts; Console steps inspect resources, not create duplicates. All commands below run from the inner application root unless stated otherwise.

## Problem and request flow

A product has 10 units and receives 100 independent purchase intents. A separate read-then-update can oversell. FLASHRUSH uses conditional DynamoDB transactions and asynchronous SQS processing.

1. Browser fetches CloudFront content backed by private S3 through OAC.
2. Catalog reads use API Gateway → API Lambda → Products.
3. POST /orders conditionally creates PENDING, stores key/payload hashes, claims a 30-second send lease and sends SQS. HTTP 202 follows an ACK; **it is not CONFIRMED**.
4. Worker reads the authoritative order and atomically decrements stock with CONFIRMED. A separate conditional transaction verifies shortage before OUT_OF_STOCK.
5. Browser polls GET /orders/{orderId} with X-Order-Token. Terminal replay does not decrement again. Technical failures use partial batch retry; DLQ does not automatically set FAILED.
6. CloudWatch logs/alarms observe the system and notify SNS. Pending reconciliation is manual; no scheduler exists.

## Nine services

| Service | Purpose / logical IDs |
|---|---|
| S3 | Private Website; artifact bucket outside stack |
| CloudFront | Distribution, OAC, SpaRewrite (a CloudFront Function) |
| API Gateway | HttpApi, Integration, Route0–3, Stage |
| Lambda | Api, Worker, Mapping |
| SQS | Queue, DLQ |
| DynamoDB | Products, Orders |
| CloudWatch | ApiLog, WorkerLog, AccessLog, three alarms |
| SNS | Alerts, AlertsPolicy; subscription is not in the template |
| IAM | ApiRole, WorkerRole |

CloudFormation is deployment tooling, not a tenth application service. No EC2, RDS, Cognito, EventBridge or VPC is added.

## Architecture baseline

The team's Architecture v1.1 image was not found in the inspected repository. `docs/architecture/baseline.md` is a supporting Mermaid draft, not approved artwork. Requirements approvals remain Pending. Compare any supplied image with lease/recovery, routes/token, private S3/OAC and monitoring before adopting it.
[SCREENSHOT REQUIRED: Team-approved AWS Icons Architecture v1.1; images/5-Workshop/01-architecture-v1-1.png]

## Expected result and MVP limits

For 100 unique valid orders completed without technical failures: 10 CONFIRMED, 90 OUT_OF_STOCK, 0 PENDING/FAILED and stock 0. `verify.py` uses **max_workers=10**, not concurrency 100. Retries/429 can produce more than 100 intake HTTP attempts. Elapsed time is not p95 latency.

MVP supports quantity=1, no payment/shipping/account authentication. The order token is a bearer capability. Admin/Monitoring screens are simulated. Catalog merchandise prices/images are illustrative; HTTP stock/order state is on AWS. Never use mock KPIs as live acceptance evidence.

**Read-only verification:** `Get-Content backend/app.py`; `Select-String -Path scripts/deploy/verify.py -Pattern max_workers`. Expect API/worker implementation and max_workers=10; compare with `tests/evidence/aws-3bf9033f.json`.

## Troubleshooting

Record diagram/source differences; do not relabel Pending as Approved.

## Checkpoint and rollback

Record the expected output, UTC, commit and target. Stop on mismatch; do not label an unexecuted step PASS. Read-only inspection needs no rollback. If a mutation fails, preserve manifests and events; use the rollback/cleanup procedure in 5.6 after ownership checks. No cleanup is executed by reading this page.

[Next step]({{< relref "/5-Workshop/5.2-Prerequisite/" >}})
