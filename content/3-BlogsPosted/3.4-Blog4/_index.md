---
title: "Blog 4"
date: 2026-11-23
weight: 4
chapter: false
pre: "<b>3.4. </b> "
---

## Asynchronous order processing with Amazon SQS and AWS Lambda

During a flash sale, requests can arrive faster than the system processes orders. If inventory checks, order writes and subsequent tasks all run inside one HTTP request, a slow component delays the whole user experience.

SQS buffers work between acceptance and processing. Lambda consumes messages through an event source mapping. This controls processing rate but requires explicit states, retries and duplicate handling. FLASHRUSH is the design example used here; the article proposes verification steps rather than claiming every test has passed.

### 1. Architectural components

![SQS and Lambda architecture](/images/3-BlogsPosted/blog4-sqs-lambda.png)

- **Client/API Gateway:** submit and receive HTTP requests.
- **API Lambda:** validate input, record the order and enqueue work.
- **SQS and DLQ:** buffer tasks and isolate messages exceeding the retry threshold.
- **Worker Lambda:** process messages and record business results.
- **DynamoDB:** store orders, state and inventory.

### 2. System workflow

1. The client calls `POST /orders` through API Gateway.
2. The API validates the request, identifies it and records `PENDING`.
3. It sends a message containing `orderId` to SQS.
4. The Worker checks current state and performs conditional business updates in DynamoDB.
5. The client retrieves the eventual `CONFIRMED` or `OUT_OF_STOCK` result.

HTTP `202 Accepted` means the request was accepted under the API contract; it does not establish purchase success. The UI should show processing and poll for a final result or a client-side timeout.

Stopping polling does not stop the Worker. A timeout message should allow lookup of the existing order instead of encouraging a new purchase request.

### 3. Implementation considerations

**A queue buffers work; it does not create inventory**

SQS absorbs bursts within service and configuration limits. It does not guarantee every order succeeds or automatically increase downstream DynamoDB capacity. When arrivals exceed completions, backlog grows. Monitor both message count and the oldest message age: a large fast-moving queue differs from a small queue containing stalled work.

For a flash sale, correctness takes priority. Unbounded concurrency can throttle downstream services, increasing retries and cost.

**Visibility timeout and redelivery**

Received messages are hidden for the visibility timeout. The event source mapping deletes successful messages. Failures or expiry without deletion can cause redelivery. Standard queues provide at-least-once delivery and best-effort ordering, so another Lambda invocation must not automatically mean another business transaction.

AWS recommends a visibility timeout of at least six times the Lambda timeout, plus the batch window when applicable. This is a configuration starting point; measure processing and throttling recovery. Too short can redeliver in-flight work; too long can delay recovery.

**Batch processing and partial failures**

A Lambda invocation can receive multiple messages. If the entire invocation fails, successfully processed messages may also be delivered again. Enable `ReportBatchItemFailures` and return `batchItemFailures`, with each `itemIdentifier` set to the failed `messageId`. Correct configuration and response structure are both required.

For FIFO queues, preserve message-group ordering. AWS recommends stopping after the first failure and reporting failed and unprocessed messages. Do not copy a Standard-queue parallel-processing strategy without considering ordering.

**Business outcomes versus technical errors**

`OUT_OF_STOCK` is a valid business outcome. Persist it and complete the message rather than repeatedly throwing an error for an unfulfillable order. Transient connection errors, throttling or service failures may require retries. Malformed messages need controlled logging and an explicit handling policy.

Read the existing state. Redelivery of an already `CONFIRMED` order must finish safely without another stock decrement. Combine this with conditional writes or transactions; a separate read alone does not prevent races.

**DLQ and redrive**

A redrive policy can move messages exceeding `maxReceiveCount` to a DLQ. The DLQ isolates failures without fixing their cause. Investigate alarms, correlate `orderId`, inspect data, fix the issue and then assess safe redrive. Blindly replaying the entire DLQ can recreate failures or overload services.

Retain messages long enough for investigation. For Standard queues, expiry relates to the original enqueue timestamp, so AWS recommends longer retention for the DLQ than the source queue.

### 4. Applicability and verification scenarios

- **Duplicate message:** an order must not decrement inventory twice.
- **One failed batch item:** retry only failed messages when partial responses are enabled.
- **Interrupted Worker:** redelivery must recover safely.
- **Insufficient stock:** record `OUT_OF_STOCK` without endless business retries.
- **Persistent technical failure:** reach the DLQ under the configured policy and generate an alert.
- **Client stops polling:** the order may still finish and remain retrievable.

Monitor SQS, Lambda and DynamoDB together: message age, backlog, errors, throttling, duration and DLQ size. Correlate logs by `orderId`, avoiding tokens and sensitive data.

**Suitable when:** tasks tolerate asynchronous latency and require buffering and safe retries.

**Consider alternatives when:** immediate final results are required or the task cannot be made idempotent. Queues add state tracking and operational responsibilities.

### 5. Summary

Asynchronous architecture separates acceptance rate from processing rate. Correct transactions still require explicit state, conditional operations and safe replay. The queue coordinates work; business logic determines valid outcomes.

### References

- [Using Lambda with SQS](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html)
- [Configuring SQS event source mappings](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-configure.html)
- [Lambda/SQS error handling](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html)
- [SQS dead-letter queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html)

### Publication evidence

The article was shared in the AWS Study Group VN community.

![SQS and Lambda article publication evidence](/images/3-BlogsPosted/evidence/blog4-sqs-lambda-published.png)
