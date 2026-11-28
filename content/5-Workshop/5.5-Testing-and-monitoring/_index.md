---
title: "5.5 Testing and monitoring"
weight: 5
draft: false
---

> **Demo configuration:** Region `us-east-1`, resource prefix `flashrush-manual-*`. Replace `YOUR_AWS_ACCOUNT_ID` before pasting policies. Use only the approved manual lab account.

**Prerequisites:** Complete sections 5.3 and 5.4. Tests can change DynamoDB data and SQS messages. A Lambda invocation succeeding does not prove business success.

**Evidence rule:** Record account, region, fixture product, stock before/after, order ID, final status, logs and alarm history. Redact tokens and idempotency keys. Do not claim a test PASS without evidence from the same run.

## 5.5.1 Test one order in Lambda

1. Open Lambda → `flashrush-manual-api` → **Test** → create a private event named `CreateOrderManual`.
2. Paste the event below, save, then run it once.

```json
{
  "version": "2.0",
  "rawPath": "/orders",
  "headers": {"content-type": "application/json", "idempotency-key": "f2b648ce-807e-47e6-bc5a-968d98fab301"},
  "requestContext": {"requestId": "manual-order-001", "http": {"method": "POST", "path": "/orders"}},
  "body": "{\"productId\":\"manual-sku-001\",\"quantity\":1}",
  "isBase64Encoded": false
}
```

Expect HTTP `202` and an order ID on the first request. A replay with the same key and payload may return `200` after the order reaches a terminal state. A `503` body is a business or connectivity failure even when Lambda reports a successful invocation.

Open DynamoDB → Orders and query the returned order ID. Refresh while it is PENDING. If the initial stock is 10 and no other order exists, expect CONFIRMED with stock 9. Check the Worker log and its SQS trigger before investigating further.

### Read an order with its token

Create a GetOrderManual test event. Replace YOUR_ORDER_ID in both paths:

```json
{
  "version": "2.0",
  "rawPath": "/orders/YOUR_ORDER_ID",
  "headers": {"x-order-token": "f2b648ce-807e-47e6-bc5a-968d98fab301"},
  "requestContext": {"requestId": "manual-read-order", "http": {"method": "GET", "path": "/orders/YOUR_ORDER_ID"}}
}
```

Save and test. Expect 200 with the current order state. Remove the header or use an incorrect token: expect 404.

## 5.5.2 Idempotency and validation

- Replay the exact key and payload: the order ID stays the same and stock is not reduced twice.
- Reuse the key with a different payload: expect `409`.
- Remove or change `x-order-token` when reading an order: expect `404`.
- Use a new UUIDv4 for a genuinely new purchase.
- Invalid quantity should return `400`.

Do not edit order status or stock manually to force a PASS.

## 5.5.3 Browser end-to-end check

Open the manual CloudFront distribution over HTTPS, place one order, and record the order ID. Verify the matching DynamoDB order and one stock decrement. Refresh a product route and `/orders`; both must load without AccessDenied. A missing asset must return an error, not the SPA index with HTTP 200. The S3 object URL must remain private. Use browser Network tools only after masking tokens.

## 5.5.4 Stock, duplicate and retry checks

For a separate fixture with stock 2, submit three unique requests. Expect two CONFIRMED, one OUT_OF_STOCK, and stock 0. Replay one request and verify no second decrement.

For duplicate delivery, send one matching message to the manual queue after the order is CONFIRMED. Find `worker_terminal_noop` in CloudWatch Logs and verify stock and order status remain unchanged.

For DLQ testing, send one deliberately invalid message to the manual main queue. Use visibility 90 seconds, maxReceiveCount 5 and ReportBatchItemFailures. Verify worker_retry logs and the labelled message arriving in the DLQ; this can take several minutes. Do not purge a shared queue or redrive a message that will fail again. DLQ presence does not change an order to FAILED.

## 5.5.5 CloudWatch Alarm → SNS → email

Run this only on the manual fixture after normal orders are complete:

1. Send one labelled test message to `flashrush-manual-dlq`.
2. Open CloudWatch → Alarms → `flashrush-manual-dlqalarm`.
3. Wait for metric evaluation, then record alarm state and successful SNS action.
4. Confirm the email in the inbox or spam folder.
5. Delete only the labelled test message.
6. Wait for the alarm to return to OK.

A direct SNS Publish test proves SNS-to-email delivery only. It does not prove the CloudWatch metric-to-alarm chain. The supplied screenshots show configuration and observed states; they do not prove a current end-to-end run.

## 5.5.6 Monitoring checklist

- DynamoDB: both tables ACTIVE; keys and numeric stock verified.
- SQS: standard queue, DLQ, visibility 90 seconds, maxReceiveCount 5.
- IAM: separate API and Worker roles with Lambda trust.
- Lambda: deployed handlers, enabled SQS mapping, partial batch failures configured.
- API Gateway: four routes, payload 2.0 and correct CORS.
- S3: private bucket, correct root objects and MIME types.
- CloudFront: OAC, HTTPS and SPA refresh function.
- SNS: subscription Confirmed.
- CloudWatch: API/Worker/access logs, seven-day retention, three alarms with correct metrics and SNS action.
- Evidence: same-run order, stock, Worker logs, alarm history and email where applicable.

The three alarms are DLQ visible messages (threshold ≥1), Worker Errors (threshold ≥1) and main-queue oldest-message age (threshold ≥300 seconds). Lambda Errors may stay at zero when partial batch failure is used; inspect logs, queue age and DLQ together.

Historical results from the former lab are not evidence for the manual environment. Manual tests are functional checks, not a 100-request concurrency benchmark.

## Investigate a long-running PENDING order

Record orderId, createdAt/updatedAt, enqueueState and attempt count; hide tokens and hashes in shared images. After approximately 300 seconds, inspect IAM, the Worker trigger, queue, DLQ and logs. This is an investigation threshold, not an SLA.

For SENT, inspect Worker processing first. For UNKNOWN/SENDING, inspect the lease and whether SQS already received the message. Do not send arbitrary replacement messages or change the order to CONFIRMED. Retry POST only with the original key and payload. This manual workshop does not deploy automatic reconciliation.

## Troubleshooting

| Symptom | Check |
|---|---|
| ImportModuleError | app.py at ZIP root, app.api/app.worker handlers, deployed code |
| Successful invocation with body 503 | IAM, environment variables, table and queue names |
| Missing logs | Log groups, log permissions and an actual invocation |
| Worker AccessDenied | GetItem/UpdateItem/ConditionCheckItem on the correct tables |
| Order stays PENDING | Enabled queue trigger, IAM, concurrency and Worker logs |
| Failed message disappears | ReportBatchItemFailures and DLQ redrive policy |
| API 404 | Route method/path, stage and base URL |
| API 500/503 | Integration, payload 2.0, invoke permission and logs |
| Browser CORS error | Exact HTTPS origin and required headers |
| HTTP 429 | Throttling; retain the same key when retrying the same intent |
| CloudFront 403 | REST origin, OAC, SourceArn and root index object |
| Route refresh fails | LIVE function and Viewer request association |
| JavaScript returns HTML | MIME types, asset handling and SPA rewrite |
| Website calls old API | Build configuration, uploaded build and invalidation |
| No alert email | Confirmed subscription, topic policy, alarm action/history and spam |

Diagnose one layer at a time: Lambda Test, HTTP API, then website. Do not use the mock React dashboard as AWS evidence.

[Next step]({{< relref "/5-Workshop/5.6-Cleanup/" >}})
