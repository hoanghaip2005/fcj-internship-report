---
title: "Week 3 Worklog"
weight: 3
chapter: false
pre: "<b>1.3. </b> "
---

## Week 3: EC2, S3 and application architecture

**Period:** 05/10/2026–10/10/2026.

### Objectives

Understand EC2 lifecycle, EBS and instance profiles; distinguish S3 origins, CloudFront and OAC; verify versioning on isolated practice data.

### Work log

| Date | Work and learning notes |
|---|---|
| 05/10/2026 | Study EC2 instance types, AMIs and lifecycle; distinguish stop, start, reboot and terminate.<br>Review instance preparation, key pairs, security groups, sizing and cost controls. |
| 06/10/2026 | Study EBS volumes/snapshots, SSH access and permitted source IP ranges.<br>Identify routing, security-group and key-pair causes of connectivity errors; prepare a lab checklist. |
| 07/10/2026 | Review Instance Profiling with IAM Roles for EC2 and application access to S3.<br>Analyze temporary credential delivery and least-privilege object read/write checks. |
| 08/10/2026 | Study S3 website hosting, buckets, objects, permissions, versioning and encryption.<br>Outline S3 Express One Zone and compare AZ scope, latency and workloads with S3 Standard.<br>Attend AWS for Software & Financial Services Companies Day and summarize agents, data quality and AWS Transform. |
| 09/10/2026 | Study CloudFront distributions, origins and caching; distinguish S3 website endpoints from REST origins and document OAC.<br>Outline storage diagrams and data flows among compute, S3 Express One Zone and S3 Standard. |
| 10/10/2026 | No internship session scheduled in the plan. |

### Detailed work and screenshots

#### 1. Two versions of an S3 object

Write two different contents to the same object and successfully read the original and current versions.

![Two versions of an S3 object](/images/1-Worklog/aws-practice/week03-s3.png)

*Supplemental Console evidence for this topic; it does not establish the original weekly execution date.*

#### 2. Bucket versioning and properties

Inspect enabled versioning and SSE-S3 encryption on the isolated practice bucket.

![Bucket versioning and properties](/images/1-Worklog/aws-practice/s3-properties.png)

#### 3. Block public access to S3

Review Block Public Access and Object Ownership to understand private storage.

![Block public access to S3](/images/1-Worklog/aws-practice/s3-permissions.png)

### Results

Consolidated EC2/S3/CloudFront; the supplemental exercise verified reading two S3 object versions.

### Lessons and remaining work

Versioning retains object versions but does not replace a backup strategy. Separate practice/application buckets and check read permissions and version-storage costs.

### Next steps

Continue with [Databases, containers and blog outlines](../1.4-week4/).

### Related material

- [S3 Express One Zone blog]({{< relref "/3-BlogsPosted/3.2-Blog2/" >}})
- [AWS for Software & Financial Services Companies Day]({{< relref "/4-EventParticipated/4.3-Event3/" >}})
