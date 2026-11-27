---
title: "Week 4 Worklog"
weight: 4
chapter: false
pre: "<b>1.4. </b> "
---

## Week 4: Databases, containers and blog outlines

**Period:** 12/10/2026–17/10/2026.

### Objectives

Compare RDS, DynamoDB and ElastiCache; understand keys, conditional writes and container/DNS fundamentals.

### Work log

| Date | Work and learning notes |
|---|---|
| 12/10/2026 | Review Database Essentials with Amazon RDS: DB instances, application connectivity, backup and recovery.<br>Distinguish Multi-AZ availability from read-replica read scaling and note database access controls. |
| 13/10/2026 | Study DynamoDB tables, partition/sort keys and access patterns; compare NoSQL with RDS.<br>Sketch simple application data and note key selection and uneven-load risks. |
| 14/10/2026 | Review ElastiCache: cache-aside, TTL, cache hits and misses.<br>Analyze reduced database load, stale data and update requirements when source data changes. |
| 15/10/2026 | Study Lightsail/Containers, images and service ports.<br>Outline Karpenter on EKS: unscheduled Pods, EC2 selection and consolidation; record deeper-research questions. |
| 16/10/2026 | Study Route 53 hosted zones, DNS records and application routing; connect DNS, servers and data.<br>Review the three initial blog topics, Karpenter/EKS, S3 Express One Zone and Cognito, and add research questions. |
| 17/10/2026 | No internship session scheduled in the plan. |

### Detailed work and screenshots

#### 1. Practice DynamoDB table configuration

The fcj-worklog-practice table uses a String id partition key and on-demand capacity.

![Practice DynamoDB table configuration](/images/1-Worklog/aws-practice/week04-dynamodb.png)

*Supplemental Console evidence for this topic; it does not establish the original weekly execution date.*

#### 2. Conditional inventory update result

Initial stock 2 decreases to 1. A further decrement of 2 is rejected with ConditionalCheckFailedException; a consistent read confirms stock remains 1.

![Conditional inventory update result](/images/1-Worklog/aws-practice/week04-dynamodb-items.png)

#### 3. Connecting container learning to Karpenter

The blog diagram explains node scaling based on Pod demand; it does not establish an EKS deployment.

![Connecting container learning to Karpenter](/images/3-BlogsPosted/blog2-karpenter-eks.png)

*Conceptual diagram, not deployment-result evidence.*

### Results

Distinguished database/cache roles and verified a DynamoDB conditional update on isolated data.

### Lessons and remaining work

Separate reads and writes can race; conditions must be enforced in the write. A single-item exercise does not establish multi-table transaction correctness or load-test results.

### Next steps

Continue with [DropIt analysis and proposed FitJoy architecture](../1.5-week5/).

### Related material

- [Karpenter/EKS blog]({{< relref "/3-BlogsPosted/3.1-Blog1/" >}})
- [DynamoDB write conditions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html)
