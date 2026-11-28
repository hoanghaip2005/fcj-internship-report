---
title: "5.1 FLASHRUSH overview"
weight: 1
draft: false
---

## Problem, audience and acceptance

Students build an asynchronous purchase system for limited inventory. Goals: distinguish HTTP 202 from CONFIRMED, prevent duplicate stock decrements, observe retry/DLQ, keep S3 private and clean up only owned resources. A successful demonstration includes a confirmed purchase, replay of the same intent without another decrement, and rejected/terminal out-of-stock intent. A sequential test is not a concurrency benchmark.

## Architecture and service choice

Browser → CloudFront → private S3 serves the frontend. Browser → API Gateway → API Lambda stores PENDING and sends SQS. Worker reads the authoritative order and atomically updates stock and terminal status in DynamoDB. CloudWatch → SNS → confirmed email provides alerts. IAM separates API and Worker permissions.

SQS buffers bursts; Lambda scales without provisioned servers; DynamoDB conditional transactions protect stock; S3/OAC/CloudFront separate public HTTPS delivery from private storage. Logs, alarms and SNS make failures visible. No VPC/NAT is required for this public managed-service lab; avoid adding networking resources without a requirement.

| Order | Service | Required resources |
|---|---|---|
| 1 | DynamoDB | Products, Orders, Campaigns |
| 2 | SQS | Standard main queue, DLQ |
| 3 | IAM | API and Worker execution roles |
| 4 | Lambda | API, Worker, event source mapping |
| 5 | API Gateway | Six public HTTP API routes |
| 6 | S3 | Private frontend bucket |
| 7 | CloudFront | Distribution, OAC, SPA rewrite |
| 8 | SNS | Topic, confirmed subscription |
| 9 | CloudWatch | Logs, metrics, alarms |

The supplied architecture is a reference, not proof of deployment. The student must confirm authorship, editable design source, AWS official icons and mapping to this three-table baseline. An AI-generated figure must not be represented as the student's independently designed final architecture.

![Team-supplied reference architecture; validation pending](/images/5-Workshop/FLASHRUSH/flashrush-architecture-v1.1.png)

## Runtime boundaries

Backend quantity validation allows integers 1–100, then checks campaign maxQtyPerOrder; use a limit of 1 for this lab. Server-side sale checks apply. The full source includes real admin/CloudWatch/Cognito features, but they are outside this guest deployment. Do not call those features mock globally. No payment or shipping is performed.

An intake ACK is not fulfillment. Queue delivery may repeat. Technical failures retry with partial batch failures; DLQ does not set order FAILED. Intake write and SQS send are separate operations, so inspect PENDING and enqueue state rather than editing orders manually.


## Historical Console screenshots

These shared images document the original manual exercise. Settings before Save and older three-variable/two-table/four-route layouts are not the current target; compare the service configuration tables. Screenshots do not prove the new baseline has been executed.

![Historical Console evidence 1](/images/5-Workshop/FLASHRUSH/flashrush-architecture-v1.1.png)

*Figure 1. Historical Console evidence; verify the saved configuration against the steps above.*


## Required full-project configuration — 28 November 2026

Earlier guest screenshots/steps on this page are the foundation only. A full-feature rebuild must apply the configuration below and [5.3.10 Cognito]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}}). Do not mix the reference lab pool/client/tables with another manual deployment.


The full project uses ten services: the nine serverless services plus Cognito. Five DynamoDB tables are Products, Orders, Campaigns, Customers (userId+recordId) and Business (id). Cognito authenticates customers/staff; Gateway JWT and backend RBAC enforce access. Customers stores profile/cart/history; Business stores vouchers/redemption and stock adjustments. Worker transactions protect stock, checkout state and redemption. Client-supplied role fields never grant access.

The student must update the older two-table/guest architecture with Cognito/JWT/Customers/Business; a generated replacement image is not setup evidence.
