---
title: "Prerequisites"
weight: 2
chapter: false
flashrush: true
pre: "<b>5.2. </b> "
---

## Objective

Prepare tools, permissions and a guarded target before mutations.

## Knowledge and inputs

Basic AWS Console, PowerShell and Git knowledge. Use the same approved lab account, region and session variables from 5.2. Provision only through the repository scripts; Console steps inspect resources, not create duplicates. All commands below run from the inner application root unless stated otherwise.

## 1. Tools and checkout

Install Git, AWS CLI v2 with `aws login` or your organization's temporary-credential flow, Python 3.12 and Node.js 22/npm. Hugo extended 0.134.3 builds docs only. Avoid root login and never place access keys in source. Use existing organizational SSO if applicable; do not create Identity Center for this lab.
```powershell
git clone https://github.com/kinnynee/FLASHRUSH-Serverless-Flash-Sale.git
Set-Location FLASHRUSH-Serverless-Flash-Sale/FLASHRUSH-Serverless-Flash-Sale
Get-Location
git rev-parse --show-toplevel
git rev-parse HEAD
git status --short
Test-Path backend/app.py
Test-Path scripts/deploy/deploy.py
aws --version
python --version
node --version
npm --version
hugo version
```
Expect both Test-Path results True, Python 3.12 and Node 22. Git root is one level above the application root; retain the nested repository structure. Record the actual commit; old evidence does not validate a newer checkout.

## 2. Credentials and guarded target

Use your own authorized lab account. Do not copy the author's account ID. Sign in and Allow CLI access. For an organization using SSO, use `aws sso login --profile $AwsProfile` instead of aws login, retaining the STS check. Keep these variables in the same PowerShell session; recreate them in a new terminal.
```powershell
$AwsProfile = Read-Host 'AWS profile for this authorized lab'
$AwsRegion = 'us-east-1'
$ExpectedAccount = Read-Host 'Expected 12-digit AWS account ID'
$Stack = 'flashrush-lab'
if ($ExpectedAccount -notmatch '^\d{12}$') { throw 'Invalid account ID' }
$AwsArgs = @('--profile', $AwsProfile, '--region', $AwsRegion, '--no-cli-pager')
$LabArgs = @('--profile', $AwsProfile, '--region', $AwsRegion, '--account', $ExpectedAccount, '--stack', $Stack)
aws login --profile $AwsProfile --region $AwsRegion
if ($LASTEXITCODE -ne 0) { throw 'AWS login failed' }
$Identity = aws sts get-caller-identity @AwsArgs | ConvertFrom-Json
if ($LASTEXITCODE -ne 0 -or $Identity.Account -ne $ExpectedAccount) { throw 'Wrong AWS target' }
$Identity.Account
```
[SCREENSHOT REQUIRED: Verified STS account and region; redact UserId/ARN when publishing; images/5-Workshop/02-target.png]

## 3. Permissions, quotas and budget

Deployment requires CloudFormation validate/change-set/execute/describe; IAM creation/passing of execution roles; Lambda/function/mapping; S3/bucket/object/encryption/tagging; CloudFront/distribution/OAC/Function/invalidation; API Gateway; DynamoDB; SQS; CloudWatch Logs/Alarms; SNS/topic/policy. CAPABILITY_IAM acknowledges role creation, not operator authorization. See `docs/security/permissions.md`; check SCPs, permission boundaries and quotas.

Console → Service Quotas → AWS Lambda → Concurrent executions. Mapping maximum concurrency is 5; the historical account value 10 must not be assumed in your account. Check CloudFront Function/distribution and IAM quotas. Billing and Cost Management → Budgets → Create budget is an operator task requiring authorization; use your organization-approved threshold/email. No Budget resource exists in the template. Budgets notify rather than cap spending; costs below USD 5 are unverified.
[SCREENSHOT REQUIRED: Lambda quota and configured AWS budget notification; images/5-Workshop/03-quota-budget.png]

## Windows path length

Moto contains deeply nested modules. For pip WinError206, use a short clone location (e.g. D:/fr), or create the virtualenv at a short external path and replace every .venv/Scripts/python with that interpreter. Do not flatten the repository or change OS policy merely to hide the failure.

## 4. Offline baseline
```powershell
python -m venv .venv
.venv/Scripts/python -m pip install -r backend/requirements-lock.txt
if ($LASTEXITCODE -ne 0) { throw 'Python dependency installation failed' }
.venv/Scripts/python -B -m unittest discover -s backend -p 'test_*.py' -v
if ($LASTEXITCODE -ne 0) { throw 'Backend tests failed' }
.venv/Scripts/python -B -m unittest discover -s scripts/deploy -p 'test_*.py' -v
if ($LASTEXITCODE -ne 0) { throw 'Deployment tests failed' }
npm ci --prefix frontend
if ($LASTEXITCODE -ne 0) { throw 'npm ci failed' }
npm test --prefix frontend
if ($LASTEXITCODE -ne 0) { throw 'Frontend tests failed' }
npm run build --prefix frontend
if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed' }
```
Expect every exit code to be zero. Offline CI runs Windows/Python3.12/Node22 without AWS credentials. Do not deploy yet. Save tool versions and redacted test output with the run evidence.

## Troubleshooting

No boto3: use .venv/Scripts/python. Session expired: reauthenticate. AccessDenied: review role/SCP with the administrator; do not silently broaden permissions. Wrong directory: inspect Test-Path. Never ignore failed npm ci/tests.

## Checkpoint and rollback

Record the expected output, UTC, commit and target. Stop on mismatch; do not label an unexecuted step PASS. Read-only inspection needs no rollback. If a mutation fails, preserve manifests and events; use the rollback/cleanup procedure in 5.6 after ownership checks. No cleanup is executed by reading this page.

[Next step]({{< relref "/5-Workshop/5.3-Infrastructure/" >}})

## Official references

- [AWS CLI sign-in](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sign-in.html)
- [AWS budgets](https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html)
