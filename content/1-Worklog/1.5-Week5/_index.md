---
title: "Week 5 Worklog"
weight: 5
chapter: false
pre: "<b>1.5. </b> "
---

## Week 5: DropIt analysis and proposed FitJoy architecture

**Period:** 19/10/2026–24/10/2026.

### Objectives

Connect AWS concepts with DropIt; propose a FitJoy architecture and assess permissions, monitoring, scaling and cost at design level.

### Work log

| Date | Work and learning notes |
|---|---|
| 19/10/2026 | Study EC2 Auto Scaling through DropIt, using Node.js, Socket.IO and PostgreSQL.<br>Sketch a Lightsail option; consider concurrent sessions, WebSockets and single-server limits. |
| 20/10/2026 | Analyze Cognito access tokens, JWKS verification and backend study-group authorization for DropIt.<br>Connect IAM/Cognito learning and distinguish deployment permissions, runtime permissions and credential protection. |
| 21/10/2026 | Study CloudWatch metrics, logs and alarms; outline DropIt CPU/RAM, API-error and WebSocket monitoring.<br>Investigate SNS notifications, PostgreSQL/uploads backups, restore tests and cost controls. |
| 22/10/2026 | Review FitJoy, a React/Vite health and exercise application, and its frontend, sign-in and progress-sync needs.<br>Propose S3/CloudFront, Cognito, API Gateway/Lambda and DynamoDB; this is not an AWS deployment claim. |
| 23/10/2026 | Compare the DropIt Lightsail and proposed FitJoy Serverless options for operations, scaling, security and cost.<br>Consolidate learning, link it to Cognito/Serverless blog outlines and the earlier S3 VPC Endpoint workshop idea; update notes, diagrams and open questions. |
| 24/10/2026 | No internship session scheduled in the plan. |

### Detailed work and screenshots

#### 1. Inspecting application logs in CloudWatch

Team practice image used as a logging example; it does not prove that monitoring was deployed for DropIt.

![Inspecting application logs in CloudWatch](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-03.png)

*Source: team-supplied practice screenshot.*

#### 2. Observing alarm state

Review metrics, thresholds and actions when analyzing an application monitoring design.

![Observing alarm state](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-14.png)

*Source: team-supplied practice screenshot.*

#### 3. Proposed application authentication

Relate the Cognito diagram to the DropIt and FitJoy options. The FitJoy AWS architecture remains a proposal.

![Proposed application authentication](/images/3-BlogsPosted/blog4-cognito-architecture.png)

*Conceptual diagram, not deployment-result evidence.*

### Results

Analyzed DropIt and proposed AWS for FitJoy; no FitJoy AWS deployment is claimed.

### Lessons and remaining work

Architecture must follow application load, connectivity and operations. FitJoy remains a proposal; team CloudWatch images illustrate monitoring methodology.

### Next steps

Continue with [Lambda and infrastructure automation](../1.6-week6/).

### Related material

- [Cognito blog]({{< relref "/3-BlogsPosted/3.3-Blog3/" >}})
- [Amazon Lightsail documentation](https://docs.aws.amazon.com/lightsail/)
