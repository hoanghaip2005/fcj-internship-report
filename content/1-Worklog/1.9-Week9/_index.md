---
title: "Week 9 Worklog"
weight: 9
chapter: false
pre: "<b>1.9. </b> "
---

## Week 9: Writing the FLASHRUSH workshop

**Period:** 16/11/2026–21/11/2026.

### Objectives

Document nine AWS services in dependency order and identify the screenshots/results needed at each integration checkpoint.

### Work log

| Topic | Work and learning notes | Expected output |
|---|---|---|
| DynamoDB and SQS | Document tables, sample data, the main queue and DLQ. | Data and queue instructions. |
| IAM and Lambda | Separate API/Worker permissions and describe runtime, handler, variables and mapping. | Backend configuration instructions. |
| API Gateway | Document routes, integrations, stage and CORS. | Client/backend integration steps. |
| S3 and CloudFront | Describe frontend build, upload, private origin, OAC and distribution. | Frontend delivery instructions. |
| SNS and CloudWatch | Prepare subscription, metric and alarm guidance with separate delivery tests. | Monitoring instructions and evidence checklist. |

### Study notes

Instructions follow prerequisites, operations and expected checks. Lambda requires permission, environment and mapping review; the frontend requires API endpoint and CORS review. Configuration evidence must be distinguished from application behavior.

### Detailed work and screenshots

#### 1. Sample data for reviewing instructions

Inspect sample DynamoDB data and its matching position in the instructions.

![Sample data for reviewing instructions](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-14.png)

*Source: team-supplied practice screenshot.*

#### 2. Queues and the SQS practice result

The isolated practice queue uses SSE-SQS, 20-second long polling and 60-second visibility timeout. The sent MessageId was received and deleted after processing.

![Queues and the SQS practice result](/images/1-Worklog/aws-practice/week09-sqs.png)

*Supplemental Console evidence for this topic; it does not establish the original weekly execution date.*

#### 3. Reviewing the Worker event source mapping

Inspect the SQS source in the Triggers tab; configuration evidence is separate from business tests.

![Reviewing the Worker event source mapping](/images/1-Worklog/aws-practice/lambda-triggers.png)

### Results

Prepared service instructions; the isolated SQS exercise verified sending, receiving and deleting the same message.

### Lessons and remaining work

Place screenshots after their corresponding steps and show saved values when concluding configuration correctness. An isolated queue test does not replace Worker/DynamoDB integration tests.

### Next steps

Continue with [Workshop review and verification](../1.10-week10/).

### Related material

- [Workshop infrastructure instructions]({{< relref "/5-Workshop/5.3-Infrastructure/" >}})
