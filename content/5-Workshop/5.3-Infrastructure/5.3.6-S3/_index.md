---
title: "5.3.6 Amazon S3"
weight: 6
draft: false
---

## Private frontend bucket

Console → S3 → Create bucket → general purpose, us-east-1, unique name flashrush-manual-web-YOUR_AWS_ACCOUNT_ID-us-east-1. Keep Block Public Access enabled, Object Ownership bucket owner enforced and SSE-S3. Do not enable public website hosting. CloudFront uses the S3 REST origin with OAC.

After CloudFront exists, attach a bucket policy allowing only cloudfront.amazonaws.com s3:GetObject on this bucket's objects with AWS:SourceArn equal to the exact owned distribution ARN. Keep all other principals denied. Use [the S3 OAC policy](/downloads/flashrush-console/s3-oac-policy.json) after replacing bucket/account/distribution placeholders.

Upload only contents of frontend/dist after the explicit HTTP build, not src, package.json, .env or an unextracted ZIP. index.html belongs at bucket root. Save MIME types: text/html for index, JavaScript for .js, text/css for .css. Upload assets before index and retain older hashed assets for clients with cached index. Do not delete existing site objects without an owner-approved rollback plan. Direct anonymous S3 access must fail; CloudFront access must succeed.


## Historical Console screenshots

These shared images document the original manual exercise. Settings before Save and older three-variable/two-table/four-route layouts are not the current target; compare the service configuration tables. Screenshots do not prove the new baseline has been executed.

![Historical Console evidence 1](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-01.png)

*Figure 1. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 2](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-02.png)

*Figure 2. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 3](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-03.png)

*Figure 3. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 4](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-04.png)

*Figure 4. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 5](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-05.png)

*Figure 5. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 6](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-06.png)

*Figure 6. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 7](/images/5-Workshop/FLASHRUSH/evidence/5.3.6-S3/image-07.png)

*Figure 7. Historical Console evidence; verify the saved configuration against the steps above.*

### Cognito mapping

Keep the website bucket private behind CloudFront OAC. Cognito login does not require public S3, Identity Pools or direct browser AWS credentials. Do not upload .env or session artifacts. [Mapping Cognito]({{< relref "/5-Workshop/5.7-Baseline-and-evidence/" >}})
