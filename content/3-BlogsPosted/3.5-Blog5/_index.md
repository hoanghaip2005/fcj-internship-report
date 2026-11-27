---
title: "Blog 5"
date: 2026-11-23
weight: 5
chapter: false
pre: "<b>3.5. </b> "
---

## Preventing duplicate orders and protecting inventory with Amazon DynamoDB

A user submits an order, waits and sees a timeout. The request might not have arrived, might still be processing, or might already have succeeded with a lost response. Creating a new order on every retry can multiply orders and stock decrements for one purchase intention.

Idempotency lets a valid request repeat without unintended additional business effects. DynamoDB conditional writes and transactions support this design. FLASHRUSH provides the design example and verification context.

### 1. Architectural components

![DynamoDB idempotency and inventory architecture](/images/3-BlogsPosted/blog5-dynamodb-idempotency.png)

- **Client and Idempotency-Key:** retain the key and payload for retries of the same intent.
- **API/Lambda:** validate input and authorization.
- **Request record:** associate the key with a payload fingerprint and `orderId`.
- **DynamoDB transaction:** group changes that must succeed together.
- **Order and inventory:** enforce business conditions at write time.

The diagram illustrates a design rather than a deployed-system screenshot.

### 2. System workflow

**Define the same request**

The client creates an `Idempotency-Key` before its first submission and retains it after network failures. The server associates it with the authenticated subject or appropriate session scope and a normalized payload fingerprint.

- Same key and payload: return the existing order or recorded result.
- Same key with different payload: reject the conflict without silently changing the order.
- New key for a new purchase intent: treat it as an independent request under business rules.
- Someone else's key: possession of the key alone must not grant data access.

Using the entire payload as the key can merge two intentional purchases of identical products. Generating a new UUID after every timeout defeats idempotency.

**Why read-then-write is insufficient**

Two Workers can read stock `1`, both approve a purchase and both write `0`. The final stock looks plausible but two orders have consumed one item. Strongly consistent reads do not make separate reads and writes atomic. The condition must be checked by DynamoDB during the write.

An `UpdateItem` example would require an existing product and `stock >= quantity` before decrementing stock. First validate that quantity is a positive integer within the allowed range. A conditional stock update alone does not make order and inventory changes atomic together.

**Use transactions for coupled changes**

If a process decrements stock and stops before confirming the order, the records become inconsistent. A confirmation transaction can include:

- Update the product: decrement `stock` subject to `stock >= quantity`.
- Update the order: change `PENDING` to `CONFIRMED` only while its current state remains `PENDING`.

After a successful transaction, duplicate delivery cannot confirm the same order again. The Worker should inspect the recorded result rather than interpret every conditional failure as insufficient stock. Distinguish stock failures, state conflicts, transaction conflicts and throttling to decide whether to record a business outcome, inspect again or retry with backoff.

### 3. Implementation considerations

**Claim the key before processing**

A conditional put with `attribute_not_exists` can claim the idempotency record, which may store the key, fingerprint, `orderId`, state and expiry. Only the successful creator owns the initial processing attempt. Other processes read the record to return an existing result or reject a payload conflict.

Define behavior for in-progress, completed and abandoned work. A separate `processed=true` flag written after decrementing inventory creates a failure gap: writing too early can lose work; writing too late can duplicate effects. Atomically coupled changes belong in a transaction or need an explicit recovery mechanism.

**The DynamoDB/SQS gap**

Writing an order and sending SQS are separate cross-service operations. A DynamoDB transaction does not include `SendMessage`. A successful `PENDING` write followed by a failed send can leave an order stalled. A successful send with a lost response can cause duplicate messages on retry. Worker idempotency addresses duplicates, while stalled work still requires reliable delivery or reconciliation.

Transactional outbox is one possible extension: write the order and outbox record atomically, then relay events through a process or DynamoDB Streams. The relay still needs duplicate tolerance, monitoring and recovery. This is an option to evaluate, not a completed FLASHRUSH feature claim.

**TTL is not an exact deletion clock**

DynamoDB removes expired TTL records asynchronously. An expired record may remain for some time. Applications must evaluate expiry where required instead of assuming immediate deletion.

Key retention should cover expected client retries and message redrives. Expiring a record too soon can make an old request appear new. The `TransactWriteItems` `ClientRequestToken` also has a service-limited idempotency window and cannot replace a longer-lived business record. Consult current limits and specify retention in the API contract.

### 4. When to use conditional writes and transactions

**Conditional writes:** protect conditions on one item, such as creating an unused key or permitting a valid state transition.

**Transactions:** group changes that must succeed or fail together, such as order confirmation and stock reduction. Evaluate cost, conflicts and service limits against the workload.

**Verification scenarios:**

An HTTP `200` or `202` alone does not establish correct duplicate handling. Check final data effects:

- Concurrent same-key, same-payload requests: the same `orderId` and only one inventory effect.
- Same key with a changed quantity: reject under the contract and preserve the existing request.
- Competing orders for limited stock: confirmed quantity must not exceed initial inventory.
- Redelivery of a confirmed order: no further stock decrement.
- Failure after writing the order but before sending SQS: detect and recover stalled work.
- Retry after an uncertain timeout: retrieve the existing order without silently creating a new intent.

Check invariants: nonnegative stock, confirmed quantity within the initial limit and one business effect per valid purchase intent. For load tests, record concurrency, request count and measurement period; total run duration is not p95 latency.

### 5. Summary

Persist the client purchase intent before calling the API so retries retain the same key and payload. A client timeout ends waiting; it does not prove server-side failure.

Browser state is a historical snapshot and must be checked against the API for current status. An idempotency key does not replace an order lookup token or ownership checks. Client and backend must agree on retries, conflicts and pending-state behavior.

### References

- [DynamoDB condition expressions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html)
- [DynamoDB transaction APIs](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html)
- [DynamoDB TTL](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html)
- [Transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html)

### Publication evidence

The article was shared in the AWS Study Group VN community.

![DynamoDB idempotency article publication evidence](/images/3-BlogsPosted/evidence/blog5-dynamodb-idempotency-published.png)
