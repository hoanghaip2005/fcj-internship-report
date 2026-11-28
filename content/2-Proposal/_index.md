---
title: "Proposal (Workshop Solution Proposal)"
weight: 2
chapter: false
pre: "<b>2. </b> "
---

## FLASHRUSH AWS Workshop Proposal

### 1. Problem and solution overview

FLASHRUSH is a hands-on Workshop for building a flash-sale application with AWS Serverless services. Many customers may submit purchase requests while inventory is limited; the system must accept requests, process orders and protect stock when clients retry or messages are duplicated.

The proposed solution uses React for the interface, API Gateway and Lambda to accept requests, SQS to coordinate processing, and DynamoDB for products and orders. S3/CloudFront deliver the website; IAM, CloudWatch and SNS support permissions, monitoring and alerts. Learners configure the components through the AWS Management Console to understand each service and its integration points.

The Workshop delivers a small, explainable and testable flow: access the website, read products, submit a request, confirm an order and inspect the resulting data.

### 2. Objectives and scope

#### Objectives

- Understand asynchronous ordering and distinguish HTTP `202 Accepted` from `CONFIRMED`.
- Configure and connect nine AWS services in dependency order.
- Apply least privilege, private S3 and CloudFront OAC.
- Test repeated requests, conditional inventory updates and failed messages.
- Record configuration, test results and cleanup steps so another learner can repeat the lab.

#### Workshop scope

| In scope | Expected output |
|---|---|
| Product catalogue and details | API reads product data from DynamoDB |
| One product per order request | Validate input and `quantity = 1` |
| Asynchronous order processing | API Lambda, SQS and Worker Lambda |
| Data protection | Idempotency key, order lookup token and inventory transaction |
| Frontend delivery | React build in private S3, accessed through CloudFront HTTPS |
| Monitoring and alerts | CloudWatch logs/metrics/alarms and SNS notifications |
| Practice documentation | Console guide, step screenshots, test cases and cleanup |

This Workshop excludes real payments, shipping, commercial operation, a complete production admin backend and production customer accounts. Simulated reference functions must be labelled when used.

**Audience:** students or beginners with basic AWS, HTTP, Python and JavaScript knowledge. **Prerequisites:** an authorized AWS account, suitable creation permissions, Node.js for the frontend build and a pinned FLASHRUSH source version.

The Workshop uses an isolated `us-east-1` environment with the `flashrush-manual-*` prefix. The `flashrush-lab` CloudFormation environment and other project extensions are outside this practice scope.

### 3. Problem statement

| Problem | Impact | Proposed response |
|---|---|---|
| Requests arrive faster than processing capacity | Slow requests and pressure on downstream components | Buffer work in SQS and limit Worker concurrency to service capacity |
| Multiple orders compete for scarce inventory | Separate reads/writes can confirm too much stock | DynamoDB transactions and write-time stock conditions |
| A client retries after a timeout | Duplicate orders or stock effects | Retain the same idempotency key/payload and process redelivery safely |
| Technical failures interrupt processing | Orders remain pending and causes are hard to trace | Order-ID logs, bounded retries, DLQ and reconciliation |
| The UI reports success too early | Customers misunderstand the purchase result | Show processing after HTTP 202 and retrieve the final state with a token |
| Instructions diverge from code/configuration | Learners cannot reproduce the lab | Pin a source version, use a configuration checklist and matching screenshots |

### 4. Preliminary solution architecture

![Preliminary FLASHRUSH Workshop architecture](/images/5-Workshop/FLASHRUSH/flashrush-architecture-v1.1.png)

*Reference architecture for the Workshop design; not acceptance evidence for a live system.*

| Component group | Services | Responsibility |
|---|---|---|
| Frontend | S3, CloudFront | Store the build and deliver HTTPS; keep S3 private through OAC |
| Intake | API Gateway, API Lambda | Validate requests, record orders and send messages |
| Processing | SQS, Worker Lambda | Buffer work, process orders, retry and isolate failures in a DLQ |
| Data | DynamoDB | Store Products/Orders and protect state/inventory transitions |
| Permissions | IAM | Separate API and Worker actions/resources |
| Observability | CloudWatch, SNS | Logs, metrics, alarms and confirmed-email notifications |

**Main flow:** the customer opens CloudFront, reads products through the API and submits an order with an idempotency key. The API records `PENDING` and sends SQS. The Worker runs the transaction and records `CONFIRMED` or `OUT_OF_STOCK`. The frontend retrieves the order with its ID and token.

**Design boundary:** writing DynamoDB and sending SQS are separate operations; the Workshop must include a way to detect or reconcile an order that was not queued. A DLQ does not automatically change order state. These limits belong in the test and failure-handling instructions.

### 5. Implementation plan and timeline

Workshop work is planned across **weeks 8–10**. This is an expected allocation; execution results are tracked separately in the worklog.

| Stage | Expected time | Work | Required output |
|---|---:|---|---|
| Week 8: requirements | 1 session, 3 hours | Confirm problem, scope, source version, diagram and cost assumptions | Proposal, preliminary architecture and prerequisites checklist |
| Week 9: infrastructure/backend | 2 sessions, 8 hours | Create DynamoDB, SQS/DLQ, IAM, Lambda and API Gateway | Connected API/Worker and component checks |
| Week 9: frontend | 1 session, 4 hours | Build React, configure API URL, private S3, OAC and CloudFront | Website calls the API; CORS and routes checked |
| Week 10: tests/monitoring | 2 sessions, 4 hours | SNS/CloudWatch, orders, retries, insufficient stock and failed messages | Expected/actual table, logs and evidence |
| Week 10: handover | 1 session, 3 hours | Review bilingual guidance, limitations and cleanup | Repeatable guide, test results and post-cleanup inventory |
| **Total** | **7 sessions, 22 hours** | Adjust for errors and learning pace | A repeatable Workshop |

**Completion conditions:** product reads work, an order can be created and retrieved, tested retries do not decrement stock twice, S3 remains private, logs/alerts have a recorded check and the resource inventory is reviewed after cleanup. Untested cases are not marked passed.

### 6. Budget and cost estimation

#### Estimation assumptions

One lab environment for **one month**, up to **10,000 API requests**, **1,000 order requests**, a **100 MB** frontend, about **1 GB** website transfer, up to **0.5 GB** logs, **3 standard alarms** and up to **100 alert emails**. Lambda uses **256 MB** and averages **200 ms/invocation**; retries are bounded and monitored. No EC2, NAT Gateway, custom domain or other paid service outside this table is assumed.

The table below uses the same workload inputs intended for AWS Pricing Calculator; it is not an invoice. The reference estimate is approximately **USD 0.73/month before Free Tier** and **USD 0.00–0.48/month after Free Tier**, depending on account eligibility. Enter the inputs again, save the share URL and verify current prices before accepting COST.

| Service | Planning basis | USD/month allocation |
|---|---|---:|
| S3 | 100 MB frontend, objects and build/upload/read requests | 0.10 |
| CloudFront | About 1 GB website transfer and HTTPS requests | 0.20 |
| HTTP API Gateway | About 10,000 requests | 0.05 |
| Lambda | API/Worker, 256 MB, 200 ms average, retry headroom | 0.10 |
| DynamoDB | Two small tables, reads/writes and transactions | 0.15 |
| SQS | Send/receive/delete and polling within lab limits | 0.05 |
| SNS | Up to 100 alert emails and related requests | 0.05 |
| CloudWatch | Up to 0.5 GB logs, short retention and 3 alarms | 0.60 |
| **Allocated total** | | **1.30** |
| **50% contingency** | Retries, corrections and volume variation | **0.65** |
| **Estimated with contingency** | | **1.95** |
| **Proposed working budget** | Rounded lab-management amount | **5.00** |

The **USD 5** value is a monitoring budget, not an automatic cap. Open [AWS Pricing Calculator](https://calculator.aws/), enter the same assumptions, save the share URL and set AWS Budgets before the lab. Limit test volume, set log retention and clean up after evidence capture. IAM has no separate charge in this table.

Personnel and personal equipment are excluded. A learning Workshop does not imply profit or payback.

### 7. Risks and mitigation plan

| Risk | Impact | Mitigation | Check |
|---|---|---|---|
| Incorrect stock or duplicate order | High | Write conditions/transactions and idempotency in API/Worker | Same key, duplicate messages and competing orders for scarce stock |
| Order remains PENDING | High | Track enqueue state, queue, logs and reconciliation | Inject a failure between order write and queue send; inspect recovery |
| Message retries indefinitely | Medium | Bounded retry, DLQ and investigation before redrive | Inspect receive count, DLQ and post-fix processing |
| Excessive permissions or data exposure | High | Least-privilege IAM, private S3/OAC, protected tokens and redaction | Check denied access and direct S3 access |
| CORS or route errors | Medium | Verify origin, endpoint, CloudFront behavior and build | Call API in a browser and refresh detail routes |
| Unexpected cost | Medium | Budget, load limits, retention and inventory | Compare cost/resources during and after the lab |
| Source, image and instruction drift | Medium | Pin source snapshot and review saved configuration | Have another learner repeat the documented steps |

When an error threatens order correctness or security, stop the test, retain relevant logs/data, fix the cause and rerun the check. Deletion and redrive follow the agreed lab scope.
