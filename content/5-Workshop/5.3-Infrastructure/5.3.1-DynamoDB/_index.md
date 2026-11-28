---
title: "5.3.1 Amazon DynamoDB"
weight: 1
draft: false
---

## Create tables

Console → DynamoDB → Tables → Create table. Select on-demand capacity. Create flashrush-manual-products with productId (String), flashrush-manual-orders with orderId (String), and flashrush-manual-campaigns with campaignId (String). No sort key/GSI/TTL is needed for this guest track. Wait for all tables ACTIVE.

## Seed an isolated product and campaign

Explore table items → Create item → JSON view. Store price, quantity and stock as Number, not String. Set productId=manual-sku-001, name, description, category, price=199000, originalPrice=299000, stock=10, initialStock=10, images=["/images/headphones.jpg"], colors=[], isFlashSale=true. Use ISO-8601 UTC saleStartsAt/saleEndsAt covering the demo; do not reuse expired dates. Available image names must exist in the pinned frontend/public/images.

Create a Campaigns item after replacing both date placeholders:

```json
{"campaignId":"manual-demo","name":"Console demo","startTime":"REPLACE_START_UTC_ISO8601","endTime":"REPLACE_END_UTC_ISO8601","productIds":["manual-sku-001"],"maxQtyPerOrder":1}
```

For example, ISO format is 2026-12-01T01:00:00Z; choose actual dates for your session. Add every test fixture product ID to an active campaign. Creating Products alone is insufficient for current source. Do not seed Orders: API generates IDs, hashes, enqueue state and leases.

Checkpoint: product types/images are valid, campaign includes the product, public catalog matches and stock is recorded before tests. After a confirmed order, inspect the exact order ID and product stock. A CONFIRMED screenshot alone does not prove overselling or replay behavior. Historical screenshots showing only two tables must be supplemented with Campaigns evidence.


## Historical Console screenshots

These shared images document the original manual exercise. Settings before Save and older three-variable/two-table/four-route layouts are not the current target; compare the service configuration tables. Screenshots do not prove the new baseline has been executed.

![Historical Console evidence 1](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-01.png)

*Figure 1. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 2](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-02.png)

*Figure 2. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 3](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-03.png)

*Figure 3. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 4](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-04.png)

*Figure 4. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 5](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-05.png)

*Figure 5. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 6](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-06.png)

*Figure 6. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 7](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-07.png)

*Figure 7. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 8](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-08.png)

*Figure 8. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 9](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-09.png)

*Figure 9. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 10](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-10.png)

*Figure 10. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 11](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/update-003.png)

*Figure 11. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 12](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-11.png)

*Figure 12. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 13](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-12.png)

*Figure 13. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 14](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-13.png)

*Figure 14. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 15](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-14.png)

*Figure 15. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 16](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/update-004.png)

*Figure 16. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 17](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/update-005.png)

*Figure 17. Historical Console evidence; verify the saved configuration against the steps above.*


## Required full-project configuration — 28 November 2026

Earlier guest screenshots/steps on this page are the foundation only. A full-feature rebuild must apply the configuration below and [5.3.10 Cognito]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}}). Do not mix the reference lab pool/client/tables with another manual deployment.


Console → DynamoDB → Create table, on-demand and encryption, then wait ACTIVE. In addition to Products/Orders/Campaigns create:

| Manual table | Partition key | Sort key |
|---|---|---|
| flashrush-manual-customers | userId (String) | recordId (String) |
| flashrush-manual-business | id (String) | none |

Do not forge customer records to bypass Cognito or store passwords/tokens. API writes authenticated profile/cart/history/wallet data. Business contains vouchers, redemptions and movements; never edit usedCount/stock manually while orders are pending. Seed vouchers only through approved admin operations. Capture ACTIVE/key schemas without personal records.

### Cognito mapping

Customers.userId is the verified Cognito sub, not email. Removing a Cognito user does not automatically delete Customers/Business records. [Mapping Cognito]({{< relref "/5-Workshop/5.7-Baseline-and-evidence/" >}})
