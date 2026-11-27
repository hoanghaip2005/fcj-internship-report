---
title: "Week 8 Worklog"
weight: 8
chapter: false
pre: "<b>1.8. </b> "
---

## Week 8: FLASHRUSH workshop analysis and design

**Period:** 09/11/2026–14/11/2026.

### Objectives

Define FLASHRUSH scope, asynchronous ordering, data model and verification criteria before preparing implementation instructions.

### Work log

| Topic | Work and learning notes | Expected output |
|---|---|---|
| Application scope | Analyze browsing, ordering and status lookup; distinguish acceptance from confirmation. | Functions and workshop limits. |
| Serverless architecture | Map CloudFront/S3, API Gateway/Lambda, SQS/Worker and DynamoDB responsibilities. | Component diagram and request flow. |
| Data design | Analyze productId, orderId, stock, order state and idempotency. | Data model and state conditions. |
| Queues and failures | Study visibility timeout, retries, DLQ and duplicate delivery. | Integration configuration checklist. |
| Documentation preparation | Order service instructions by dependency and define required evidence. | Workshop outline and checkpoints. |

### Study notes

HTTP 202 confirms acceptance; the Worker processes the message and updates order state. The frontend must retrieve the final state. Writing Orders and sending SQS are separate operations with uncertain-enqueue cases. Same-key retries, duplicate messages and insufficient stock form the week 10 test criteria.

### Detailed work and screenshots

#### 1. FLASHRUSH workshop architecture

Analyze the CloudFront/S3, API Gateway/Lambda, SQS/Worker and DynamoDB flow.

![FLASHRUSH workshop architecture](/images/5-Workshop/FLASHRUSH/flashrush-architecture-v1.1.png)

*Conceptual diagram, not deployment-result evidence.*

#### 2. Designing the Products table key

Compare the table name and productId partition key with product access patterns.

![Designing the Products table key](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-02.png)

*Source: team-supplied practice screenshot.*

#### 3. Planning queue configuration

A queue configuration image from team materials supports analysis of asynchronous processing and retries.

![Planning queue configuration](/images/5-Workshop/FLASHRUSH/evidence/5.3.2-SQS/image-03.png)

*Source: team-supplied practice screenshot.*

### Results

Established the workshop architecture, data model and verification criteria.

### Lessons and remaining work

HTTP 202 means acceptance; CONFIRMED is a business outcome. Design for duplicate delivery and the gap between writing Orders and sending SQS before acceptance.

### Next steps

Continue with [Writing the FLASHRUSH workshop](../1.9-week9/).

### Related material

- [FLASHRUSH proposal]({{< relref "/2-Proposal/" >}})
- [Workshop overview]({{< relref "/5-Workshop/5.1-Workshop-overview/" >}})
