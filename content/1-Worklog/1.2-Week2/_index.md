---
title: "Week 2 Worklog"
weight: 2
chapter: false
pre: "<b>1.2. </b> "
---

## Week 2: IAM, VPC and community activities

**Period:** 28/09/2026–03/10/2026.

### Objectives

Distinguish IAM users, groups, roles and policies; explain VPC subnets, routing and traffic controls; document community activities.

### Work log

| Date | Work and learning notes |
|---|---|
| 28/09/2026 | Study IAM users, groups, roles and policies; distinguish authentication from authorization and identify Effect, Action and Resource fields.<br>Analyze group-based permissions, least privilege and overly broad access risks. |
| 29/09/2026 | Study IAM roles and temporary credentials compared with embedded long-lived access keys.<br>Outline Cognito blog topics around users, tokens and service permissions; record research questions.<br>Document AWS Cloud and AI Day Hanoi topics: agents, data, application development and migration. |
| 30/09/2026 | Review Networking Essentials with Amazon VPC: CIDR, public/private subnets, route tables and Internet Gateway.<br>Sketch a basic VPC and explain the path from the Internet to a server in a public subnet. |
| 01/10/2026 | Study NAT Gateway, security groups and network ACLs; compare resource-level and subnet-level controls.<br>Analyze private-subnet outbound access, NAT costs and overly broad port rules. |
| 02/10/2026 | Review Networking on AWS Workshop: network preparation, routing and connection checks.<br>Survey secure S3 access through VPC endpoints; outline scope, architecture and required services.<br>Attend Fireside Chat with Dr. Werner and document Cloud, AI, large-scale systems and community learning. |
| 03/10/2026 | No internship session scheduled in the plan. |

### Detailed work and screenshots

#### 1. API execution role permissions

Compare the API role policies with its data-access and message-sending responsibilities.

![API execution role permissions](/images/1-Worklog/aws-practice/week02-roles.png)

*Supplemental Console evidence for this topic; it does not establish the original weekly execution date.*

#### 2. API role trust relationship

Inspect the service principal allowed to assume the role; distinguish trust policy from resource-action permissions.

![API role trust relationship](/images/1-Worklog/aws-practice/iam-trust.png)

#### 3. AWS Cloud and AI Day activity

Community activity photo associated with the Event 2 reflection.

![AWS Cloud and AI Day activity](/images/4-EventParticipated/event2/group-photo.jpg)

*Source: event participation photo from the personal report.*

### Results

Distinguished identities and policies, consolidated VPC concepts and documented community activities.

### Lessons and remaining work

A trust policy defines who can assume a role; permissions define what the role can do. VPC connectivity checks must include routes, security groups and network ACLs.

### Next steps

Continue with [EC2, S3 and application architecture](../1.3-week3/).

### Related material

- [AWS Cloud and AI Day]({{< relref "/4-EventParticipated/4.2-Event2/" >}})
- [Fireside Chat with Dr. Werner]({{< relref "/4-EventParticipated/4.4-Event4/" >}})
- [IAM overview](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)
