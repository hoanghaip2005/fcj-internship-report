---
title: "FLASHRUSH AWS Workshop"
weight: 5
chapter: false
flashrush: true
pre: "<b>5. </b> "
---

> Environment update20 November2026: the shared FLASHRUSH AWS lab was torn down at the owner's request. All30 stack resources, the external artifact bucket and orphan SNS subscription were verified absent. Website/API demo endpoints are offline. Build in your own authorized lab account; historical evidence remains historical.


## Objective

Deploy, verify and clean up the actual Flash Sale implementation.

## Knowledge and inputs

Basic AWS Console, PowerShell and Git knowledge. Use the same approved lab account, region and session variables from 5.2. Provision only through the repository scripts; Console steps inspect resources, not create duplicates. All commands below run from the inner application root unless stated otherwise.

## Scope and release status

CloudFormation and FLASHRUSH scripts are the primary deployment path. Console instructions inspect their resources; do not recreate stack resources manually.

**CONDITIONAL GO — draft practical guide.** Written pages do not prove execution. Historical evidence on 18 November 2026 records 100 unique accepted orders, 10 CONFIRMED, 90 OUT_OF_STOCK and stock 0. Deployment evidence on 20 November records 12 HTTP checks; it does not validate later frontend/source changes. Approved v1.1 artwork, real screenshots, live fault/DLQ tests and cleanup rehearsal are still missing.

Load tests, resend/redrive, deployments and cleanup require an authorized operator and explicit scope. A budget notification is not a spending cap.

## Contents
1. [5.1 Overview]({{< relref "/5-Workshop/5.1-Workshop-overview/" >}})
2. [5.2 Prerequisites]({{< relref "/5-Workshop/5.2-Prerequisite/" >}})
3. [5.3 AWS infrastructure]({{< relref "/5-Workshop/5.3-Infrastructure/" >}})
4. [5.4 Application deployment]({{< relref "/5-Workshop/5.4-Application-deployment/" >}})
5. [5.5 Testing and monitoring]({{< relref "/5-Workshop/5.5-Testing-and-monitoring/" >}})
6. [5.6 Cleanup]({{< relref "/5-Workshop/5.6-Cleanup/" >}})

## Troubleshooting

Missing credentials: complete 5.2. Missing images: retain the marker and consult the screenshot matrix; do not reuse the sample VPC screenshots.

## Checkpoint and rollback

Record the expected output, UTC, commit and target. Stop on mismatch; do not label an unexecuted step PASS. Read-only inspection needs no rollback. If a mutation fails, preserve manifests and events; use the rollback/cleanup procedure in 5.6 after ownership checks. No cleanup is executed by reading this page.

[Next step]({{< relref "/5-Workshop/5.1-Workshop-overview/" >}})
