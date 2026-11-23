---
title: "CloudWatch and SNS"
weight: 8
chapter: false
flashrush: true
pre: "<b>5.3.8. </b> "
---

## Objective

Observe technical failures, queue age and the notification path.

## Knowledge and inputs

Basic AWS Console, PowerShell and Git knowledge. Use the same approved lab account, region and session variables from 5.2. Provision only through the repository scripts; Console steps inspect resources, not create duplicates. All commands below run from the inner application root unless stated otherwise.

## Template configuration

Log groups: /aws/lambda/flashrush-lab-api, /aws/lambda/flashrush-lab-worker, /aws/apigateway/flashrush-lab,7-day retention. Alarms period60s/evaluation1: DLQ visible≥1, Worker Errors≥1, oldest queue message≥300s; TreatMissingData=notBreaching. SNS Alerts=flashrush-lab-alerts allows CloudWatch publish from the same account/alarm prefix.

Console → CloudWatch → Log groups → worker → streams; Metrics → SQS/Lambda/API Gateway; Alarms → All alarms → flashrush-lab-* alarms. SNS → Topics → AlertsTopicArn → Subscriptions. Partial batch failures return successfully from the handler and do not automatically increase Lambda Errors; inspect queue age/DLQ and worker_retry logs. Never-enqueued orders require reconciliation rather than these alarms.
```powershell
aws cloudwatch describe-alarms --alarm-name-prefix flashrush-lab- @AwsArgs
aws sns list-subscriptions-by-topic --topic-arn $Outputs.AlertsTopicArn @AwsArgs
aws logs describe-log-groups --log-group-name-prefix /aws/lambda/flashrush-lab @AwsArgs
```
[SCREENSHOT REQUIRED: Worker logs and all three CloudWatch alarm settings; images/5-Workshop/11-cloudwatch.png]

Email subscription is outside IaC. If needed, an authorized operator uses SNS → topic → Create subscription → Email, then confirms AWS email. No subscription/operator role is silently created here. PendingConfirmation is inactive. Successful alarm action proves SNS action, **not inbox receipt**. Synthetic set-alarm-state requires separate mutation approval, clear synthetic labeling and appropriate restoration.
[SCREENSHOT REQUIRED: SNS subscription state and alarm action history; redact email as needed; images/5-Workshop/12-sns.png]

Read permissions: logs Describe/Get/Filter, cloudwatch Describe/Get/List and sns ListSubscriptionsByTopic/GetTopicAttributes. Log ingest/storage, metrics/alarms and SNS incur costs;7-day retention does not remove alarms/topics. Stack cleanup removes groups/alarms/topic; inspect orphan subscriptions and never delete unrelated logs.

## Troubleshooting

OK/INSUFFICIENT_DATA is not a passed test. Missing email: inspect confirmation, topic policy/action and inbox separately. Inspect orphan orders with reconciliation dry-run.

## Checkpoint and rollback

Record the expected output, UTC, commit and target. Stop on mismatch; do not label an unexecuted step PASS. Read-only inspection needs no rollback. If a mutation fails, preserve manifests and events; use the rollback/cleanup procedure in 5.6 after ownership checks. No cleanup is executed by reading this page.

[Next step]({{< relref "/5-Workshop/5.4-Application-deployment/" >}})

## Official references

- [SNS email subscriptions](https://docs.aws.amazon.com/sns/latest/dg/sns-email-notifications.html)
