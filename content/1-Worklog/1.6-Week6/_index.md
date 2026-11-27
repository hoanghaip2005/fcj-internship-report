---
title: "Week 6 Worklog"
weight: 6
chapter: false
pre: "<b>1.6. </b> "
---

## Week 6: Lambda and infrastructure automation

**Period:** 26/10/2026–31/10/2026.

### Objectives

Explain event-driven Lambda execution, roles and timeouts; distinguish CloudFormation/CDK from manual Console deployment.

### Work log

| Topic | Work and learning notes | Expected output |
|---|---|---|
| AWS Lambda | Study event-driven execution, handlers, runtimes, memory, timeout and execution roles; distinguish deploying code from merely saving editor changes. | Lambda configuration checklist. |
| AWS Systems Manager | Review configuration management and operational responsibilities. | Notes on operator versus runtime permissions. |
| CloudFormation and CDK | Compare resource definitions, dependencies and stack lifecycle with manual Console setup. | Dependency diagram and inventory. |
| Resource management | Define names, tags, Regions and environment prefixes. | Lab resource identification rules. |
| Application connection | Relate API and Worker functions to environment configuration. | Backend integration prerequisites. |

### Detailed work and screenshots

#### 1. Lambda Worker and its SQS event source

Read the function overview to identify its event source, execution role and related components.

![Lambda Worker and its SQS event source](/images/1-Worklog/aws-practice/week06-lambda.png)

*Supplemental Console evidence for this topic; it does not establish the original weekly execution date.*

#### 2. Worker memory and timeout

The Console shows 256 MB memory and a 15-second timeout. Relate this timeout to SQS visibility timeout.

![Worker memory and timeout](/images/1-Worklog/aws-practice/lambda-config.png)

#### 3. Managing resource lifecycle with CloudFormation

The flashrush-lab stack is UPDATE_COMPLETE; this is an IaC example, separate from the manual Console environment.

![Managing resource lifecycle with CloudFormation](/images/1-Worklog/aws-practice/week10-stack.png)

### Results

Consolidated Lambda, execution permissions and IaC; inspected an existing Worker configuration.

### Lessons and remaining work

Lambda timeout, message visibility and concurrency must align. UPDATE_COMPLETE establishes infrastructure completion, not business-flow correctness.

### Next steps

Continue with [Security and application authentication](../1.7-week7/).

### Related material

- [SQS and Lambda blog]({{< relref "/3-BlogsPosted/3.4-Blog4/" >}})
- [CloudFormation documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html)
