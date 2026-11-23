---
title: "Deploy and inspect AWS infrastructure"
weight: 3
chapter: false
flashrush: true
pre: "<b>5.3. </b> "
---

## Objective

Use a single IaC stack and inspect each service after completion.

## Knowledge and inputs

Basic AWS Console, PowerShell and Git knowledge. Use the same approved lab account, region and session variables from 5.2. Provision only through the repository scripts; Console steps inspect resources, not create duplicates. All commands below run from the inner application root unless stated otherwise.

## Sequence

5.3.1 deploys infrastructure and backend (mutation). 5.3.2–5.3.8 inspect Console/CLI configuration; catalog is seeded in 5.4. Do not recreate tables, queues or functions manually.

1. [CloudFormation and artifacts]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.1-CloudFormation/" >}})
2. [DynamoDB Products/Orders]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.2-DynamoDB/" >}})
3. [SQS queue and DLQ]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.3-SQS/" >}})
4. [IAM execution roles]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.4-IAM/" >}})
5. [Lambda API and Worker]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.5-Lambda/" >}})
6. [API Gateway HTTP API]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.6-API-Gateway/" >}})
7. [Private S3 and CloudFront]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.7-S3-CloudFront/" >}})
8. [CloudWatch and SNS]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.8-CloudWatch-SNS/" >}})

Source of truth: `scripts/deploy/deploy.py:template()`. Committed JSON is a snapshot; scripts generate `.build/flashrush.generated.json` for the chosen target. Artifact bucket is outside the stack and needs separate cleanup.

## Troubleshooting

Do not directly deploy a snapshot pointing to another account artifact. Inspect stack Events before retrying failures.

## Checkpoint and rollback

Record the expected output, UTC, commit and target. Stop on mismatch; do not label an unexecuted step PASS. Read-only inspection needs no rollback. If a mutation fails, preserve manifests and events; use the rollback/cleanup procedure in 5.6 after ownership checks. No cleanup is executed by reading this page.

[Next step]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.1-CloudFormation/" >}})
