---
title: "Lambda API and Worker"
weight: 5
chapter: false
flashrush: true
pre: "<b>5.3.5. </b> "
---

## Objective

Verify backend code package, runtime and mapping.

## Knowledge and inputs

Basic AWS Console, PowerShell and Git knowledge. Use the same approved lab account, region and session variables from 5.2. Provision only through the repository scripts; Console steps inspect resources, not create duplicates. All commands below run from the inner application root unless stated otherwise.

## IaC functions

Api=flashrush-lab-api, handler app.api; Worker=flashrush-lab-worker, handler app.worker. Both use app.py ZIP, Python3.12 ARM64,256MB,15s timeout. Environment names: PRODUCTS_TABLE, ORDERS_TABLE, QUEUE_URL; no credential keys. Mapping connects queue to worker; API permission permits API Gateway invocation.

Console → Lambda → Functions → Code/Runtime settings; Configuration → General configuration, Environment variables, Permissions, Triggers; Monitor → View CloudWatch logs. Expect Active and Successful. CodeSha256 is base64 SHA256 of the ZIP, not source hex; compare matching encodings.
```powershell
aws lambda get-function-configuration --function-name flashrush-lab-api @AwsArgs --query '{State:State,Update:LastUpdateStatus,Runtime:Runtime,Architecture:Architectures,Handler:Handler,Timeout:Timeout,Memory:MemorySize,Role:Role,CodeSha256:CodeSha256}'
aws lambda get-function-configuration --function-name flashrush-lab-worker @AwsArgs --query '{State:State,Update:LastUpdateStatus,Runtime:Runtime,Architecture:Architectures,Handler:Handler,Timeout:Timeout,Memory:MemorySize,Role:Role,CodeSha256:CodeSha256}'
```
[SCREENSHOT REQUIRED: API/Worker runtime, environment names, role and trigger; images/5-Workshop/08-lambda.png]

Inspection needs GetFunctionConfiguration/ListEventSourceMappings and log reads. Runtime permissions are in 5.3.4. Never invoke fake worker payloads in the live lab just to capture images. Invocation/duration, polling and retained logs can cost money. Function/mapping/log groups are stack-owned; artifacts are not. boto3 remains runtime-provided, so pinned local SDK tests do not prove deployed SDK version equality; record live runtime metadata separately.

## Troubleshooting

Handler missing: ZIP root must contain app.py. Timeouts: inspect transactions/retries and queue age before tuning. Avoid Console uploads that diverge from the release manifest.

## Checkpoint and rollback

Record the expected output, UTC, commit and target. Stop on mismatch; do not label an unexecuted step PASS. Read-only inspection needs no rollback. If a mutation fails, preserve manifests and events; use the rollback/cleanup procedure in 5.6 after ownership checks. No cleanup is executed by reading this page.

[Next step]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.6-API-Gateway/" >}})

## Official references

- [Python deployment packages](https://docs.aws.amazon.com/lambda/latest/dg/python-package.html)
