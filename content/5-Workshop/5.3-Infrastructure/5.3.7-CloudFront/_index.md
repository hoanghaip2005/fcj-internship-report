---
title: "5.3.7 Amazon CloudFront"
weight: 7
draft: false
---

## Distribution and OAC

Console → CloudFront → Create distribution → owned S3 REST origin (not website endpoint) → create OAC and always sign requests. Set viewer protocol redirect HTTP to HTTPS, default root index.html, allowed viewer methods GET/HEAD. Copy the generated restricted S3 policy to the correct bucket. Record distribution ID/domain and wait Deployed.

Functions → Create flashrush-manual-spa-rewrite → paste the JavaScript below → Save → Test → Publish LIVE. Distribution → Behaviors → edit default → Viewer request association → choose LIVE function → Save and wait Deployed.

```javascript
function handler(event) {
  var r = event.request;
  if (/^\/(products|checkout|orders|admin|monitoring|cart|account|auth|staff)(\/.*)?$/.test(r.uri) && !/\.[^/]+$/.test(r.uri)) r.uri = '/index.html';
  return r;
}
```

Rewrite only application paths. A missing .js/image object must remain a 403/404, not HTML 200. Rewriting account/admin paths does not provision their APIs or authorize them. Guest acceptance uses home/product/checkout/orders only.

Update API CORS with your exact HTTPS origin and rebuild/upload as in 5.4. Invalidate /* after replacement and wait Completed. Test home, refresh product and /orders, missing asset failure and private S3 denial. Disable/delete distribution only during authorized cleanup.


## Historical Console screenshots

These shared images document the original manual exercise. Settings before Save and older three-variable/two-table/four-route layouts are not the current target; compare the service configuration tables. Screenshots do not prove the new baseline has been executed.

![Historical Console evidence 1](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-001.png)

*Figure 1. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 2](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-02.png)

*Figure 2. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 3](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-03.png)

*Figure 3. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 4](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-04.png)

*Figure 4. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 5](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-005.png)

*Figure 5. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 6](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-06.png)

*Figure 6. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 7](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-07.png)

*Figure 7. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 8](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-008.png)

*Figure 8. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 9](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-009.png)

*Figure 9. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 10](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-010.png)

*Figure 10. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 11](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-011.png)

*Figure 11. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 12](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-012.png)

*Figure 12. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 13](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-013.png)

*Figure 13. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 14](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-14.png)

*Figure 14. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 15](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-015.png)

*Figure 15. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 16](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-016.png)

*Figure 16. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 17](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-017.png)

*Figure 17. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 18](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-018.png)

*Figure 18. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 19](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-019.png)

*Figure 19. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 20](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-20.png)

*Figure 20. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 21](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-21.png)

*Figure 21. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 22](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-22.png)

*Figure 22. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 23](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-23.png)

*Figure 23. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 24](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-24.png)

*Figure 24. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 25](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-025.png)

*Figure 25. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 26](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-026.png)

*Figure 26. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 27](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-27.png)

*Figure 27. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 28](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-028.png)

*Figure 28. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 29](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-029.png)

*Figure 29. Historical Console evidence; verify the saved configuration against the steps above.*


## Required full-project configuration — 28 November 2026

Earlier guest screenshots/steps on this page are the foundation only. A full-feature rebuild must apply the configuration below and [5.3.10 Cognito]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}}). Do not mix the reference lab pool/client/tables with another manual deployment.


SPA rewrite must cover /auth, /staff/login, /cart, /cart/checkout, /account/* and /admin/* in addition to products/orders/checkout. Publish LIVE and associate Viewer request; saving alone is insufficient. Keep missing assets as errors. /staff/login now redirects in React to /auth?next=/admin, with no separate admin login view.

Publish assets before index, invalidate /* and wait Completed. Verify home/auth/account/orders/admin/cart-checkout receive the new index. HTTP 200 only proves SPA serving, not authentication. API CORS must match the released domain.
