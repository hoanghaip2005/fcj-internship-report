---
title: "FLASHRUSH AWS Console Workshop"
weight: 5
draft: false
---

## Objective and scope

Build a guest Flash Sale application manually in the AWS Management Console, us-east-1, namespace flashrush-manual. Infrastructure creation does not use CloudFormation. Git/Node commands only retrieve and build application code locally.

The full FLASHRUSH project also includes Cognito, customer carts, vouchers, staff administration and monitoring APIs. This nine-service guest track does not provision those extensions. Use guest Buy now → /checkout → /orders. Do not demonstrate account/cart/admin routes as completed features of this track.

Console screenshots are historical configuration evidence, not proof that every pictured edit was saved. Current required settings are three tables, six public routes and five Lambda modules. Use the pinned source in 5.2 and configuration tables in the service pages. Results not executed remain unverified.

## Contents

1. [Overview]({{< relref "/5-Workshop/5.1-Workshop-overview/" >}})
2. [Prerequisites]({{< relref "/5-Workshop/5.2-Prerequisite/" >}})
3. [Nine AWS services]({{< relref "/5-Workshop/5.3-Infrastructure/" >}})
4. [Application build and publication]({{< relref "/5-Workshop/5.4-Application-deployment/" >}})
5. [Testing and monitoring]({{< relref "/5-Workshop/5.5-Testing-and-monitoring/" >}})
6. [Cleanup]({{< relref "/5-Workshop/5.6-Cleanup/" >}})
