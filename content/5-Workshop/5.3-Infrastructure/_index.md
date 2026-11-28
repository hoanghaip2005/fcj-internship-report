---
title: "5.3 Configure nine AWS services"
weight: 3
draft: false
---

## Manual dependency order

Create resources through AWS Console only. Complete prerequisites and verify account/region before each service. Create log groups early when preparing scoped IAM logging permissions.

1. [DynamoDB]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.1-DynamoDB/" >}})
2. [SQS]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.2-SQS/" >}})
3. [IAM]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.3-IAM/" >}})
4. [Lambda]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.4-Lambda/" >}})
5. [API Gateway]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.5-API-Gateway/" >}})
6. [S3]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.6-S3/" >}})
7. [CloudFront]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.7-CloudFront/" >}})
8. [SNS]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.8-SNS/" >}})
9. [CloudWatch]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.9-CloudWatch/" >}})

Checkpoint: owned resources exist, both handlers use the correct source/modules, public GET /products returns JSON, and Campaigns contains a currently active fixture campaign. Website publication follows in 5.4. A screenshot of a form before Save is not proof of persisted configuration. Use the service pages for current settings and capture missing saved-state evidence.
