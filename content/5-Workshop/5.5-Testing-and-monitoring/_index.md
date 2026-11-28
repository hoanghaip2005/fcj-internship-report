---
title: "5.5 Testing and monitoring"
weight: 5
draft: false
---

## Scope and evidence

Tests below mutate isolated manual fixtures. Obtain owner approval first; do not modify lab/shared catalog for screenshots. Record UTC, source commit, account/region, namespace, stock before/after, order ID, expected/actual, HTTP/status and matching logs. Store keys/tokens privately; redact screenshots. Never label an unrun test PASS.

## Direct Lambda intake and replay

Use a currently active manual-demo campaign containing manual-sku-001, maxQtyPerOrder=1, initial stock 10. API Lambda → Test → private event:

```json
{"version":"2.0","rawPath":"/orders","headers":{"idempotency-key":"f2b648ce-807e-47e6-bc5a-968d98fab301"},"requestContext":{"requestId":"manual-intake","http":{"method":"POST","path":"/orders"}},"body":"{\"productId\":\"manual-sku-001\",\"quantity\":1}","isBase64Encoded":false}
```

Use a new UUIDv4 for a new intent, never recycle a real order token. Expect intake 202, then inspect exact Orders item and Worker logs until CONFIRMED; if no other orders, stock 10→9. Replay same key/body: same orderId, no second decrement. Read /orders/ID with x-order-token equal to original key: 200; missing/wrong token:404. Change a previously used key's payload:409 conflict. With a new key, quantity=0/fractional tests invalid input; quantity=2 against maxQtyPerOrder=1 tests a 409 campaign limit.

Lambda Test bypasses Gateway/CORS. Repeat a permitted guest purchase through CloudFront and compare API Network, DynamoDB and logs. Refresh product/order routes and verify private S3/missing static asset behavior.

## Stock and duplicate delivery

Create a new fixture stock=2, initialStock=2, active dates, and add it to campaign.productIds. Submit three unique intents. Expect two CONFIRMED and stock=0; the third may be rejected at intake with 409 or accepted then OUT_OF_STOCK. Replay intent A without another decrement. This is a sequential functional test, not a concurrent benchmark.

For duplicate Worker testing, create a separate stock=2 fixture, confirm one order, then send its exact schemaVersion=1.0/orderId/productId/quantity/correlationId to main queue. Wait for Worker terminal-noop evidence and verify stock remains 1. Merely reading stock before processing is insufficient.

## Retry/DLQ and notification tests

Only when isolated and time permits: send one tagged invalid-schema message to main queue. Observe Worker retry and eventual DLQ after receive limit; visibility=90s and max receives=5 imply minutes, not an exact SLA. Capture evidence; delete only that test message. Do not redrive deliberate poison messages. This message has no order and does not prove PENDING recovery.

For metric→alarm→SNS: with permission send one tagged notification-only message directly to owned DLQ; wait for metric/alarm evaluation, SNS action and actual email receipt. This proves alert routing, not redrive from main queue. Delete only the tagged message, then verify recovery without forcing OK to hide real backlog. SNS Publish alone only tests SNS→email.

## PENDING investigation and acceptance

If PENDING exceeds a reference 300 seconds, inspect enqueueState/attempts/lease, trigger Enabled, IAM, queue, DLQ and logs. This threshold is operational guidance, not a business SLA. Retry only original intent/key; do not edit stock/status or send arbitrary messages. DLQ does not auto-fail orders. No automatic reconciliation scheduler is provisioned by this track.

Acceptance requires six public routes, three tables, five Lambda modules/four env vars, trigger partial failure, confirmed subscription, correct alarm dimensions, one verified confirmed purchase/replay and recorded alert result. Use the test evidence checklist. Historical 100-order reports do not prove the current deployment.


## Required full-project configuration — 28 November 2026

Earlier guest screenshots/steps on this page are the foundation only. A full-feature rebuild must apply the configuration below and [5.3.10 Cognito]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}}). Do not mix the reference lab pool/client/tables with another manual deployment.


## Additional feature acceptance

Start read-only: public products/campaigns 200, anonymous protected profile 401, correct JWT scope and CORS. Login/logout changes authentication sessions; purchases change data. Use owner-approved accounts and isolated fixtures.

- Verified customer signs in at /auth and reaches /account; profile/cart/history remain owner-private.
- Owner uses the same form and reaches /admin. Warehouse cannot edit products/campaigns, support cannot manage staff and customers cannot write admin endpoints.
- Add cart, quote vouchers, checkout with exact same key/payload on retry; compare server subtotal/discount/net and saved order.
- Last voucher use: competing intents consume at most one redemption; failed orders do not consume quota/stock and replay does not decrement again.
- Logout clears both customer/staff sessions; monitoring uses actual CloudWatch source/region and does not fabricate zeros for missing data.

Do not send registration/invitation email or create real orders merely for screenshots without an approved scope. Capture redacted evidence with commit/time/namespace and expected/actual.

### Cognito mapping

Separate 401 token/email/client failures from 403 role failures and 5xx IAM/config failures. Verify owner, customer and restricted staff independently; a 200 SPA deep link proves no authorization result. [Mapping Cognito]({{< relref "/5-Workshop/5.7-Baseline-and-evidence/" >}})
