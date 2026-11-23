---
title: "Cleanup and rollback"
weight: 6
chapter: false
flashrush: true
pre: "<b>5.6. </b> "
---

## Objective

Remove only owned lab resources, preserve evidence and verify residual resources/costs.

## Knowledge and inputs

Basic AWS Console, PowerShell and Git knowledge. Use the same approved lab account, region and session variables from 5.2. Provision only through the repository scripts; Console steps inspect resources, not create duplicates. All commands below run from the inner application root unless stated otherwise.

## Scope and preconditions — cleanup has not run

Cleanup destroys tables, queues, logs and the website. Run only after specific teardown authorization, never merely to obtain screenshots. Stop traffic/tests; preserve manifests/reports/public snapshots and frontend rollback outside buckets being deleted. Recheck STS and the5.2 account/region/stack.

The inventory script is **read-only**: verifies account/stack tags, website physical ID, bucket owner, artifact tags, versions/delete markers/multipart and subscriptions. AccessDenied is not NotFound. Do not delete artifacts referenced by other stacks.
```powershell
# READ ONLY: approved target from 5.2
.venv/Scripts/python scripts/ops/cleanup_inventory.py @LabArgs
if ($LASTEXITCODE -ne 0) { throw 'Ownership inventory failed; do not delete' }
aws cloudformation list-stack-resources --stack-name $Stack @AwsArgs
aws s3api get-bucket-versioning --bucket $Outputs.WebsiteBucket --expected-bucket-owner $ExpectedAccount @AwsArgs
```
[SCREENSHOT REQUIRED: Verified target inventory and bucket ownership/versioning before deletion; images/5-Workshop/18-cleanup-inventory.png]

## Operator-authorized teardown sequence

1. Refresh $Resources from list-stack-resources. Record physical IDs, mapping UUID, distribution/OAC/Function, topic/subscriptions and external artifact bucket. Administrative IAM users are outside the stack.
2. Disable the exact mapping; preserve queue/DLQ/pending counts and account for in-flight processing.
3. Verify website bucket owner/versioning. For Unversioned only, empty using commands below. For Enabled/Suspended, S3 → bucket → Empty must remove all versions and delete markers; re-list versions and multipart uploads. s3 rm alone is insufficient. Abort owned incomplete multipart uploads.
4. Delete the stack and wait. For DELETE_FAILED inspect Events and resolve the specific blocker without broadening deletion scope.
```powershell
# DESTRUCTIVE: only after the operator authorizes this exact inventory
$ConfirmStack = Read-Host "Type $ExpectedAccount/$AwsRegion/$Stack to authorize stack teardown"
if ($ConfirmStack -ne "$ExpectedAccount/$AwsRegion/$Stack") { throw 'Cleanup cancelled' }
$Identity = aws sts get-caller-identity @AwsArgs | ConvertFrom-Json
if ($LASTEXITCODE -ne 0 -or $Identity.Account -ne $ExpectedAccount) { throw 'Wrong target' }
$Resources = (aws cloudformation list-stack-resources --stack-name $Stack @AwsArgs | ConvertFrom-Json).StackResourceSummaries
if ($LASTEXITCODE -ne 0) { throw 'Cannot refresh resources' }
$VerifiedWebsite = ($Resources | Where-Object LogicalResourceId -eq 'Website').PhysicalResourceId
if ($VerifiedWebsite -ne $Outputs.WebsiteBucket) { throw 'Website output mismatch' }
$Versioning = aws s3api get-bucket-versioning --bucket $VerifiedWebsite --expected-bucket-owner $ExpectedAccount @AwsArgs | ConvertFrom-Json
if ($LASTEXITCODE -ne 0 -or $Versioning.Status) { throw 'Stop: use version-aware bucket empty procedure' }
$MappingId = ($Resources | Where-Object LogicalResourceId -eq 'Mapping').PhysicalResourceId
if (-not $MappingId) { throw 'Missing mapping physical ID; refresh inventory' }
aws lambda update-event-source-mapping --uuid $MappingId --no-enabled @AwsArgs
if ($LASTEXITCODE -ne 0) { throw 'Mapping disable failed' }
# For an unversioned website bucket ONLY, after owner/version checks:
aws s3 rm "s3://$($Outputs.WebsiteBucket)/" --recursive @AwsArgs
if ($LASTEXITCODE -ne 0) { throw 'Bucket empty failed' }
aws cloudformation delete-stack --stack-name $Stack @AwsArgs
if ($LASTEXITCODE -ne 0) { throw 'Stack delete request failed' }
aws cloudformation wait stack-delete-complete --stack-name $Stack @AwsArgs
if ($LASTEXITCODE -ne 0) { throw 'Inspect stack DELETE_FAILED events' }
```
[SCREENSHOT REQUIRED: Completed stack deletion and absent website bucket; images/5-Workshop/19-cleanup-stack.png]

5. External artifact bucket: reverify ownership/tags and zero references, empty versions/markers/multipart and delete exactly that bucket. Never use an account-wide prefix. Inspect owned orphan SNS subscriptions; PendingConfirmation is not a deletable ARN.
6. Check every inventory physical ID: DynamoDB, SQS, Lambda/mapping, API Gateway, CloudFront distribution/OAC/**SpaRewrite Function**, S3, IAM execution roles, CloudWatch groups/alarms, SNS topic/subscriptions. CloudFront removal can take time. Distinguish AccessDenied from NotFound and record unresolved resources.
7. Review Bills/Cost Explorer after AWS refresh, filtering account/region/service/date. Do not assert immediate USD0 or that budgets prevent charges. Record inspection time and residual costs.
[SCREENSHOT REQUIRED: Residual resource checks and delayed Billing/Cost Explorer review; images/5-Workshop/20-billing.png]

## Frontend rollback without teardown

Choose the preserved .build/rollback/<UTC> and verify its API target. Upload assets then index using publication ContentType/CacheControl, invalidate CloudFront and verify hashes/deep links. Retain older hashed assets required for rollback. Rolling back HTML does not reseed or revert catalog. See docs/operations/cleanup-runbook.md; no automated rollback rehearsal is claimed.

**Final checkpoint:** lab resources absent or exceptions recorded, evidence preserved and billing limits/time documented. Cleanup rehearsal remains NOT VERIFIED until actually executed. Return to contents to review evidence gaps.

## Troubleshooting

DELETE_FAILED may involve nonempty buckets or CloudFront dependencies; resolve the event-specific resource. Never delete unrelated buckets/users. Frontend rollback cannot restore destroyed database data.

## Checkpoint and rollback

Record the expected output, UTC, commit and target. Stop on mismatch; do not label an unexecuted step PASS. Read-only inspection needs no rollback. If a mutation fails, preserve manifests and events; use the rollback/cleanup procedure in 5.6 after ownership checks. No cleanup is executed by reading this page.

## Official references

- [Stack deletion](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-delete-stack.html)
- [S3 version deletion](https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html)
