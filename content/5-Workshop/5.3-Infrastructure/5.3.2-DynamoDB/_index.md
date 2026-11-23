---
title: "DynamoDB Products/Orders"
weight: 2
chapter: false
flashrush: true
pre: "<b>5.3.2. </b> "
---

## Objective

Verify keys, on-demand billing and atomic stock/order invariants.

## Knowledge and inputs

Basic AWS Console, PowerShell and Git knowledge. Use the same approved lab account, region and session variables from 5.2. Provision only through the repository scripts; Console steps inspect resources, not create duplicates. All commands below run from the inner application root unless stated otherwise.

## Source and configuration

`template()` creates Products/Orders named flashrush-lab-products/orders with String HASH keys productId/orderId, PAY_PER_REQUEST and SSE. No sort key, GSI or TTL. Conditional order Put prevents duplicate intent; stock>=quantity decrement and PENDING→CONFIRMED are transactional. A separate transaction verifies OUT_OF_STOCK. Never reset stock to manufacture passing results.

Console → DynamoDB → Tables → Overview: ACTIVE, correct partition key and on-demand billing. Explore table items is inspection; tables may be empty before 5.4. Capture public fields rather than hashes, leaseOwner or tokens.
```powershell
aws dynamodb describe-table --table-name $Outputs.ProductsTable @AwsArgs --query 'Table.[TableStatus,KeySchema,BillingModeSummary]'
aws dynamodb describe-table --table-name $Outputs.OrdersTable @AwsArgs --query 'Table.[TableStatus,KeySchema,BillingModeSummary]'
```
[SCREENSHOT REQUIRED: Products/Orders keys and public order status/stock fields; images/5-Workshop/05-dynamodb.png]

Operator needs describe/get/scan. ApiRole reads Products and gets/puts/updates Orders. WorkerRole gets/updates/condition-checks both tables for transactions. Publish conditionally seeds missing products, never resets stock. On-demand requests and storage cost money; full scans suit a small lab only. Stack cleanup deletes tables after preserving evidence.

## Troubleshooting

ResourceNotFound: check region/output. Transaction conflicts require technical retry, not OUT_OF_STOCK. Missing or mistyped stock requires fixture/catalog investigation.

## Checkpoint and rollback

Record the expected output, UTC, commit and target. Stop on mismatch; do not label an unexecuted step PASS. Read-only inspection needs no rollback. If a mutation fails, preserve manifests and events; use the rollback/cleanup procedure in 5.6 after ownership checks. No cleanup is executed by reading this page.

[Next step]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.3-SQS/" >}})

## Official references

- [DynamoDB transactions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html)
