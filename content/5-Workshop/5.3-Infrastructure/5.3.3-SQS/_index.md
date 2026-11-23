---
title: "SQS queue and DLQ"
weight: 3
chapter: false
flashrush: true
pre: "<b>5.3.3. </b> "
---

## Objective

Verify the retry chain, DLQ and event-source mapping.

## Knowledge and inputs

Basic AWS Console, PowerShell and Git knowledge. Use the same approved lab account, region and session variables from 5.2. Provision only through the repository scripts; Console steps inspect resources, not create duplicates. All commands below run from the inner application root unless stated otherwise.

## Source and configuration

Queue flashrush-lab-orders is Standard with managed SSE, visibility90s, retention345600s (4 days), long poll20s. DLQ flashrush-lab-dlq retains1209600s (14 days); maxReceiveCount5; RedriveAllowPolicy permits only the main queue. Mapping: batch1/window0, ReportBatchItemFailures, maximum concurrency5. Lambda timeout15s.

Console → SQS → Queues → main → Details/Configuration/Dead-letter queue; DLQ → Redrive allow policy. Lambda → worker → Configuration → Triggers: Enabled. **Do not poll Send and receive messages for inspection**; receiving changes visibility/count and competes with the worker.
```powershell
aws sqs get-queue-attributes --queue-url $Outputs.QueueUrl --attribute-names All @AwsArgs
aws sqs get-queue-attributes --queue-url $Outputs.DLQUrl --attribute-names All @AwsArgs
aws lambda list-event-source-mappings --function-name flashrush-lab-worker @AwsArgs
```
[SCREENSHOT REQUIRED: Main queue/DLQ configuration and Lambda trigger; images/5-Workshop/06-sqs.png]

Standard SQS is at-least-once; DynamoDB transactions enforce idempotency. Worker returns failed itemIdentifiers so Lambda retains those messages. Business OOS is successful processing; technical errors retry before DLQ. DLQ does not change Orders automatically. API needs SendMessage; worker ReceiveMessage/DeleteMessage/GetQueueAttributes; operator inspection and approved redrive permissions are separate. Requests/polling incur costs; both queues are removed by stack cleanup. Empty DLQ is not a passed redrive test.

## Troubleshooting

Growing queue age: inspect mapping/concurrency/logs/permissions and poison messages. Do not raise timeouts/counts to hide failures or redrive before fixing the cause.

## Checkpoint and rollback

Record the expected output, UTC, commit and target. Stop on mismatch; do not label an unexecuted step PASS. Read-only inspection needs no rollback. If a mutation fails, preserve manifests and events; use the rollback/cleanup procedure in 5.6 after ownership checks. No cleanup is executed by reading this page.

[Next step]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.4-IAM/" >}})

## Official references

- [SQS Lambda configuration](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-configure.html)
- [Partial batch handling](https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html)
