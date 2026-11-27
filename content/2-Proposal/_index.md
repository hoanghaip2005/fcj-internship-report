---
title: "Proposal"
weight: 2
chapter: false
pre: "<b>2. </b> "
---

# FLASHRUSH Serverless Flash Sale System on AWS

## 1. Executive summary

FLASHRUSH demonstrates order processing during a sale with limited inventory. The proposal addresses traffic spikes, asynchronous processing, duplicate requests and inventory consistency. React provides the frontend, Python implements the backend, and AWS Serverless services reduce server administration.

The project supports the First Cloud AI Journey learning activities of **Phạm Hoàng Hải, student ID 2302700162, class IT2307V, Cloud AI Intern**. Implementation instructions are available in the [FLASHRUSH Workshop]({{< relref "/5-Workshop/" >}}).

The Console workshop has source code, configuration instructions and screenshots covering nine AWS services. Acceptance requires configuration checks and evidence of the complete ordering flow. This proposal describes the manual workshop; additional features in other deployments require separate validation.

## 2. Problem and objectives

Concurrent customers may read the same stock before separate updates complete, causing overselling. Browser retries can create duplicate orders. Processing every task within one HTTP request couples response time to the entire business operation.

The objectives are to:

- Accept requests through an HTTP API and queue processing work.
- Protect inventory with DynamoDB conditions and transactions.
- Recognize repeated purchase intentions using idempotency keys.
- Let customers distinguish request acceptance from order confirmation.
- Collect logs, monitor queues and notify operators of errors.
- Document configuration, test results and resource cleanup.

## 3. Implementation scope

| Capability | Expected behavior |
|---|---|
| Product catalogue and details | Read DynamoDB data through the API |
| Single-product order | Validate integer `quantity` equal to 1 |
| Asynchronous processing | API Lambda, SQS and Worker Lambda |
| Inventory protection | Transactionally update stock and confirm the order |
| Order lookup | Validate the order-specific `X-Order-Token` |
| Frontend delivery | React build in private S3, delivered through CloudFront |
| Monitoring | CloudWatch logs, metrics and alarms; SNS email notifications |
| Documentation | Nine AWS services, tests, screenshots and cleanup |

Real payments, shipping, production customer accounts, administrative backend features and business analytics are outside this manual workshop's scope. Administrative or monitoring screens in the reference frontend must be checked for simulated data. A frontend countdown alone does not enforce sale timing at the backend.

## 4. Proposed architecture

![FLASHRUSH reference architecture](/images/5-Workshop/FLASHRUSH/flashrush-architecture-v1.1.png)

*Reference architecture supplied by the team. Verify each component against the workshop source and deployed configuration.*

| Service | Responsibility |
|---|---|
| Amazon S3 | Store the frontend build in a private bucket |
| Amazon CloudFront | Deliver HTTPS content; access S3 through OAC |
| Amazon API Gateway | Provide HTTP routes and CORS configuration |
| AWS Lambda | Separate request acceptance from order processing |
| Amazon DynamoDB | Store products and orders; protect inventory updates |
| Amazon SQS | Buffer work, retry failures and isolate messages in a DLQ |
| AWS IAM | Grant API and Worker permissions according to their roles |
| Amazon CloudWatch | Store logs, expose metrics and evaluate alarms |
| Amazon SNS | Deliver alerts to confirmed email subscribers |

### 4.1. Request and ordering flow

1. A customer opens the website through CloudFront, which retrieves content from private S3.
2. The frontend calls API Gateway to read products.
3. An order request carries an idempotency key. The API validates input, records the order and sends a message to SQS.
4. HTTP `202 Accepted` confirms receipt; the purchase is still pending.
5. The Worker processes the message and executes a DynamoDB transaction. Eligible orders become `CONFIRMED`; insufficient stock produces `OUT_OF_STOCK`.
6. The frontend retrieves the final status using the order ID and token.

### 4.2. Consistency and recovery

SQS can deliver a message more than once. The Worker must check order state and update stock safely within the source code's transaction logic. Repeating the same request must not decrement stock again. Reusing a key with a different payload must follow the API's conflict behavior.

Writing an order and sending an SQS message are separate operations. The reference source includes `enqueueState=UNKNOWN`, a 30-second lease and conditional limits on enqueue attempts. A scheduled recovery mechanism is not assumed. These paths require explicit testing.

Partial batch failures allow failed messages to retry. Moving a message into the DLQ does not automatically change its order to `FAILED`; operators must inspect logs and data before redriving it.

## 5. Feasibility

The proposal is feasible as a learning lab: Python/React source, a data schema and configuration guidance are available. Services can be configured and checked in dependency order without dedicated hardware.

Prerequisites include an authorized AWS account, suitable IAM permissions, Node.js for frontend builds and basic HTTP, Python, React, DynamoDB and SQS knowledge. The Console workshop uses `us-east-1` and the `flashrush-manual-*` namespace. Check existing resources before creating new ones.

Commercial operation requires further work on authentication, access controls, sale timing, secret management, reconciliation, load testing and operational procedures. Throughput and availability commitments require measurements.

## 6. Implementation plan

| Planned session | Work | Deliverable |
|---|---|---|
| 1 | Agree scope, inspect source and prepare the account | Inventory, architecture and test criteria |
| 2–3 | Configure DynamoDB, SQS/DLQ, IAM, log groups and Lambda | Configured API/Worker and direct function checks |
| 4 | Configure HTTP API, private S3 and CloudFront/OAC | HTTPS API and frontend distribution |
| 5 | Build frontend, configure API URL and verify CORS | Browser ordering and lookup flow |
| 6 | Configure SNS/CloudWatch; test retries and inventory | Results, logs and screenshots |
| 7 | Review limitations, complete documentation and clean up | Acceptance report and final inventory |

Adjust this plan for permissions, configuration issues and test results. Record completion after verification. See [infrastructure instructions]({{< relref "/5-Workshop/5.3-Infrastructure/" >}}) for the individual steps.

## 7. Budget and cost control

Costs depend on Region, resource lifetime, request volume, storage, data transfer and logging. A validated AWS Pricing Calculator estimate for this manual configuration is not yet available; a fixed total or free-operation guarantee would require that estimate.

| Cost group | Inputs to estimate |
|---|---|
| CloudFront and S3 | Build size, requests and website data transfer |
| API Gateway and Lambda | API calls, execution duration, memory and Worker invocations |
| DynamoDB | Reads, writes, transactions and table storage |
| SQS and SNS | Send, receive and delete requests; retries and notifications |
| CloudWatch | Log ingestion, retention, metrics and alarms |

Prepare an estimate in [AWS Pricing Calculator](https://calculator.aws/), check the account's Free Tier eligibility and agree a lab budget. AWS Budgets provides alerts rather than a hard spending cap. Limit test volume, set log retention and remove resources after acceptance.

## 8. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Overselling or repeated stock reduction | Verify transactions, stock conditions and duplicate-message handling |
| Orders remain pending | Inspect enqueue state, queues and Worker logs; document recovery limits |
| Messages enter the DLQ | Investigate and fix the cause before a safe redrive |
| Excessive permissions or exposed data | Restrict actions/resources, keep S3 private and protect tokens |
| CORS errors or broken route refresh | Verify origins, routes, API URL and CloudFront rewrite behavior |
| Unexpected costs | Track billing, budgets, retention and resource inventory |
| Simulated data mistaken for real results | Label mock data and distinguish diagrams from runtime evidence |

## 9. Acceptance criteria and evidence

- The website works over HTTPS; private S3 content is not publicly accessible.
- The API returns product lists and details.
- Valid orders are accepted and their final state can be retrieved with the correct token.
- Repeated requests do not create extra orders or decrement stock twice.
- Conflicting idempotency payloads, invalid tokens and malformed requests are rejected according to the API contract.
- Confirmed quantities do not exceed initial inventory in controlled tests; stock remains nonnegative.
- Logs, queues, DLQ and alarms can be inspected. Notification delivery has its own test result.
- Cleanup is verified against a resource inventory.

Each scenario needs input conditions, steps, expected and actual results, and evidence. Screenshots cover the nine services; website and final order-state evidence must also support the complete flow. Mark a test as passed only after execution.

## 10. Expected outcome

A repeatable Serverless flash-sale lab with asynchronous ordering, inventory protection and verifiable guidance. The work develops IAM, service integration, data consistency and monitoring skills, while identifying requirements for further development.

## References

- [FLASHRUSH repository](https://github.com/kinnynee/FLASHRUSH-Serverless-Flash-Sale).
- [AWS Console workshop]({{< relref "/5-Workshop/" >}}).
- [DynamoDB transactions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transactions.html).
- [Using Lambda with Amazon SQS](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html).
- [Restricting S3 access with CloudFront OAC](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html).
