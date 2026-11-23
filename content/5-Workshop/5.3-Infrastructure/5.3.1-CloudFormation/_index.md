---
title: "CloudFormation and artifacts"
weight: 1
chapter: false
flashrush: true
pre: "<b>5.3.1. </b> "
---

## Objective

Create/update the stack and connect artifact/template/Lambda configuration through manifests.

## Knowledge and inputs

Basic AWS Console, PowerShell and Git knowledge. Use the same approved lab account, region and session variables from 5.2. Provision only through the repository scripts; Console steps inspect resources, not create duplicates. All commands below run from the inner application root unless stated otherwise.

## IaC deployment — AWS mutation

Run only within authorized deployment scope. Script validates STS and stack tags, builds deterministic LF `.build/backend.zip` from backend/app.py, and addresses it by SHA256. boto3 is not bundled; Lambda supplies its runtime SDK. The private `flashrush-lab-artifacts-<account>-<region>` bucket is outside CloudFormation. Existing bucket owner and Project=FLASHRUSH/Environment=lab tags must match.

`template()` currently creates 30 resources including a CloudFront Function. The script validates, records `.build/change-set.json`, executes, waits for completion and records a completed manifest with outputs and Lambda configurations. Prepared is not completed. Generated template is `.build/flashrush.generated.json`; student targets do not rewrite the committed snapshot. For no-change, inspect existing outputs; do not infer a new deployment.
```powershell
.venv/Scripts/python scripts/deploy/deploy.py @LabArgs
if ($LASTEXITCODE -ne 0) { throw 'Deployment incomplete; inspect CloudFormation Events' }
aws cloudformation describe-stacks --stack-name $Stack @AwsArgs --query 'Stacks[0].[StackStatus,Outputs]'
$StackInfo = (aws cloudformation describe-stacks --stack-name $Stack @AwsArgs | ConvertFrom-Json).Stacks[0]
if ($LASTEXITCODE -ne 0) { throw 'Cannot read stack outputs' }
$Outputs = @{}
$StackInfo.Outputs | ForEach-Object { $Outputs[$_.OutputKey] = $_.OutputValue }
$Outputs
```
## Console and expected output

Console → CloudFormation → Stacks → flashrush-lab → Events: no *_FAILED. Resources: compare logical/physical IDs. Outputs: ApiUrl, WebsiteUrl, WebsiteBucket, DistributionId, ProductsTable, OrdersTable, QueueUrl, DLQUrl, AlertsTopicArn. Expect CREATE_COMPLETE or UPDATE_COMPLETE. Website may lack index until 5.4.
[SCREENSHOT REQUIRED: flashrush-lab CloudFormation Events, Resources and Outputs; images/5-Workshop/04-cloudformation.png]

Permissions: CloudFormation, IAM PassRole/role creation, and underlying service provisioning listed in 5.2. Costs arise from resources and artifacts; standard stack management does not replace checking service pricing. Empty website bucket before stack deletion; handle the external artifact bucket separately.

## Troubleshooting

Artifact tags mismatch: stop and verify ownership, never retag an unrelated bucket. Quota/concurrency: inspect Events. No updates is not failure. Preserve rollback failures; do not force-delete outside inventory.

## Checkpoint and rollback

Record the expected output, UTC, commit and target. Stop on mismatch; do not label an unexecuted step PASS. Read-only inspection needs no rollback. If a mutation fails, preserve manifests and events; use the rollback/cleanup procedure in 5.6 after ownership checks. No cleanup is executed by reading this page.

[Next step]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.2-DynamoDB/" >}})

## Official references

- [CloudFormation change sets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html)
