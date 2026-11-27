---
title: "Week 7 Worklog"
weight: 7
chapter: false
pre: "<b>1.7. </b> "
---

## Week 7: Security and application authentication

**Period:** 02/11/2026–07/11/2026.

### Objectives

Consolidate IAM policies, data protection and Cognito flows; distinguish user authentication from AWS resource access permissions.

### Work log

| Topic | Work and learning notes | Expected output |
|---|---|---|
| IAM | Compare identity, resource and trust policies with permission boundaries. | Policy comparison notes. |
| Data protection | Study KMS, Secrets Manager and handling of sensitive information in logs/screenshots. | Data-protection checklist. |
| Access protection | Study WAF, VPC endpoints and CloudFront/OAC access patterns. | Applicability notes for each approach. |
| Amazon Cognito | Study User Pools, Identity Pools, tokens and authentication flows. | Material for the Cognito blog. |
| Technical writing | Review architecture, terms and sources; distinguish proposals from deployed applications. | Reviewed learning material. |

### Detailed work and screenshots

#### 1. Amazon Cognito user pool

Verify that flashrush-customers exists; this alone does not establish successful sign-in tests.

![Amazon Cognito user pool](/images/1-Worklog/aws-practice/week07-cognito.png)

*Supplemental Console evidence for this topic; it does not establish the original weekly execution date.*

#### 2. User pool configuration overview

Identify the user pool and related application configuration; distinguish user authentication from service IAM permissions.

![User pool configuration overview](/images/1-Worklog/aws-practice/cognito-overview.png)

#### 3. Connecting security to private storage

Inspect the practice bucket public-access controls as a data-protection example.

![Connecting security to private storage](/images/1-Worklog/aws-practice/s3-permissions.png)

### Results

Consolidated IAM, data protection and Cognito; screenshots establish configuration existence, not successful sign-in tests.

### Lessons and remaining work

User Pools authenticate and issue tokens; Identity Pools provide temporary AWS credentials governed by IAM. Backends still enforce data and business authorization.

### Next steps

Continue with [FLASHRUSH workshop analysis and design](../1.8-week8/).

### Related material

- [Cognito blog]({{< relref "/3-BlogsPosted/3.3-Blog3/" >}})
- [IAM policies](https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies.html)
