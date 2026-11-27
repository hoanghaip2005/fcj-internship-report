---
title: "Week 10 Worklog"
weight: 10
chapter: false
pre: "<b>1.10. </b> "
---

## Week 10: Workshop review and verification

**Period:** 23/11/2026–28/11/2026.

**Progress:** This week is in progress. Unverified work, including the remaining activities for November 28, remains open rather than completed.

### Objectives

Review instructions, screenshots and the AWS verification report; distinguish manual/lab environments and track remaining discrepancies.

### Work log

| Topic | Work and learning notes | Expected output |
|---|---|---|
| Practice screenshots | Classify 192 screenshots from nine team DOCX files by service and operation. | Organized Console evidence. |
| Workshop presentation | Place images after matching steps; correct captions and duplicate headings. | Readable Hugo instructions. |
| Backend verification | Review the recorded two CONFIRMED orders and stock change from 10 to 8. | Verification report with limits. |
| Configuration differences | Track frontend, CORS, alarm missing-data and SQS wait-time findings from the saved report. | Follow-up checklist requiring fresh verification. |
| Worklog review | Align twelve weeks; concentrate workshop work in weeks 8–10. | Consistent weekly learning plan. |

### Study notes

An earlier saved verification report recorded two CONFIRMED orders and stock decreasing from 10 to 8, alongside frontend S3, CORS, alarm missing-data and SQS wait-time findings. These are historical findings requiring comparison with the current environment before marking them unresolved or fixed. Retry safety, overselling prevention, browser E2E and alarm-to-email delivery require separate evidence.

### Detailed work and screenshots

#### 1. Current FLASHRUSH stack state

Inspect the UPDATE_COMPLETE flashrush-lab stack and distinguish it from the manual Console environment.

![Current FLASHRUSH stack state](/images/1-Worklog/aws-practice/week10-stack.png)

*Supplemental Console evidence for this topic; it does not establish the original weekly execution date.*

#### 2. Evidence for a stock condition check

Use the isolated exercise to verify rejection of an excessive decrement; this does not establish complete FLASHRUSH acceptance.

![Evidence for a stock condition check](/images/1-Worklog/aws-practice/week04-dynamodb-items.png)

#### 3. Comparing queues across environments

Distinguish lab, manual and practice prefixes to avoid checking the wrong environment.

![Comparing queues across environments](/images/1-Worklog/aws-practice/week09-sqs.png)

### Results

Produced illustrated instructions and a discrepancy checklist; older findings require rechecking before being marked resolved.

### Lessons and remaining work

Check prefixes, Regions and evidence sources before drawing conclusions. Recheck historical findings against the current state and require new evidence before marking fixes complete.

### Next steps

Continue with [Data storage and analytics on AWS](../1.11-week11/).

### Related material

- [Idempotency and DynamoDB blog]({{< relref "/3-BlogsPosted/3.5-Blog5/" >}})
- [Workshop testing and monitoring]({{< relref "/5-Workshop/5.5-Testing-and-monitoring/" >}})
