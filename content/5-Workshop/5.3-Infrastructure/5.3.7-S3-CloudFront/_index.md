---
title: "Private S3 and CloudFront"
weight: 7
chapter: false
flashrush: true
pre: "<b>5.3.7. </b> "
---

## Objective

Inspect private origin, HTTPS and SPA rewrites that preserve asset errors.

## Knowledge and inputs

Basic AWS Console, PowerShell and Git knowledge. Use the same approved lab account, region and session variables from 5.2. Provision only through the repository scripts; Console steps inspect resources, not create duplicates. All commands below run from the inner application root unless stated otherwise.

## Source and Console

Website bucket flashrush-lab-web-<account>-<region> enables all four public-access blocks and AES256 SSE. Do not enable public website hosting. Distribution uses S3 regional REST origin, OAC sigv4 always; bucket policy allows CloudFront GetObject only for the distribution SourceArn and denies non-TLS. Viewer redirects HTTP to HTTPS, default index.html, PriceClass_100, managed cache policy.

SpaRewrite viewer-request CloudFront Function rewrites extensionless products/checkout/orders/admin/monitoring routes to index.html, retaining extension-bearing asset errors. Broad 403/404→200 fallback is absent. Console → S3 → Permissions/Properties; CloudFront → Distributions → Origins/Behaviors/General; Functions → flashrush-lab-spa-rewrite and LIVE association.
```powershell
aws s3api get-public-access-block --bucket $Outputs.WebsiteBucket --expected-bucket-owner $ExpectedAccount @AwsArgs
aws s3api get-bucket-encryption --bucket $Outputs.WebsiteBucket --expected-bucket-owner $ExpectedAccount @AwsArgs
aws cloudfront get-distribution --id $Outputs.DistributionId @AwsArgs --query 'Distribution.{Status:Status,Domain:DomainName,Config:DistributionConfig}'
```
[SCREENSHOT REQUIRED: Private S3, OAC, bucket policy and CloudFront Function association; images/5-Workshop/10-s3-cloudfront.png]

Expect Deployed after waiting. Direct unauthenticated S3 access is denied; WebsiteUrl works after publication; deep application links return HTML; missing assets return403/404. Root403 before publication is possible. Operators need S3 config reads/CloudFront get; publication needs object put/get/list and invalidation. Storage, requests, transfer, CDN/Function calls and invalidations may cost money. Empty website objects before stack deletion; CloudFront removal takes time.

## Troubleshooting

Root403 after publishing: inspect index/OAC/policy/SourceArn. Asset HTML: inspect Function and cache rather than restoring broad fallback. Use Outputs, not an S3 website endpoint.

## Checkpoint and rollback

Record the expected output, UTC, commit and target. Stop on mismatch; do not label an unexecuted step PASS. Read-only inspection needs no rollback. If a mutation fails, preserve manifests and events; use the rollback/cleanup procedure in 5.6 after ownership checks. No cleanup is executed by reading this page.

[Next step]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.8-CloudWatch-SNS/" >}})

## Official references

- [CloudFront OAC](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html)
