---
title: "IAM execution roles"
weight: 4
chapter: false
flashrush: true
pre: "<b>5.3.4. </b> "
---

## Objective

Inspect actual policies instead of granting AdministratorAccess to runtime roles.

## Knowledge and inputs

Basic AWS Console, PowerShell and Git knowledge. Use the same approved lab account, region and session variables from 5.2. Provision only through the repository scripts; Console steps inspect resources, not create duplicates. All commands below run from the inner application root unless stated otherwise.

## Template-managed roles

CloudFormation generates ApiRole/WorkerRole physical names with lambda.amazonaws.com trust. Inline flashrush-runtime policy targets stack tables/queue/log groups. ApiRole: Products GetItem/Scan; Orders GetItem/PutItem/UpdateItem; main SendMessage. WorkerRole: queue Receive/Delete/GetAttributes and both tables GetItem/UpdateItem/ConditionCheckItem. Logs CreateLogStream/PutLogEvents target the function groups. Operator permissions are separate.

Console → CloudFormation Resources → role physical name → IAM → Roles → Permissions/Trust relationships. Do not attach AdministratorAccess to runtime. No operator role is silently added; permission requirements are documented for administrator review in docs/security/permissions.md.
```powershell
$Resources = (aws cloudformation list-stack-resources --stack-name $Stack @AwsArgs | ConvertFrom-Json).StackResourceSummaries
$ApiRoleName = ($Resources | Where-Object LogicalResourceId -eq 'ApiRole').PhysicalResourceId
$WorkerRoleName = ($Resources | Where-Object LogicalResourceId -eq 'WorkerRole').PhysicalResourceId
aws iam get-role-policy --role-name $ApiRoleName --policy-name flashrush-runtime @AwsArgs
aws iam get-role-policy --role-name $WorkerRoleName --policy-name flashrush-runtime @AwsArgs
```
[SCREENSHOT REQUIRED: ApiRole/WorkerRole inline permissions and trust; images/5-Workshop/07-iam.png]

Inspection needs iam:GetRole/GetRolePolicy; deployment needs role/policy lifecycle and scoped PassRole. Ordinary IAM roles have no separate charge; their AWS calls can incur costs. Delete stack roles through CloudFormation, not administrative IAM users or local profiles.

## Troubleshooting

AccessDenied: compare action/resource ARN and region; do not reflexively add Resource:*. Obtain physical role names from stack resources.

## Checkpoint and rollback

Record the expected output, UTC, commit and target. Stop on mismatch; do not label an unexecuted step PASS. Read-only inspection needs no rollback. If a mutation fails, preserve manifests and events; use the rollback/cleanup procedure in 5.6 after ownership checks. No cleanup is executed by reading this page.

[Next step]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.5-Lambda/" >}})

## Official references

- [Lambda execution roles](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)
