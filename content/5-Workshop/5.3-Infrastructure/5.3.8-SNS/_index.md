---
title: "5.3.8 Amazon SNS"
weight: 8
draft: false
---

## Alerts topic and subscription

Console → SNS → Topics → Create → Standard → flashrush-manual-alerts → Create. Record Topic ARN. Topic policy must allow CloudWatch Publish with matching aws:SourceAccount and SourceArn restricted to flashrush-manual-* alarms. Preserve existing owner statements; do not replace the entire policy blindly. Use [the scoped SNS statement](/downloads/flashrush-console/sns-cloudwatch-statement.json), replacing account and region placeholders.

Topic → Subscriptions: first check whether the intended email is already confirmed. Create only with the recipient's consent, protocol Email, approved address; click confirmation link from inbox/spam and verify status Confirmed in Console. Never publish confirmation URLs or addresses in screenshots. PendingConfirmation is not an active alert recipient; do not mark it delivered.

Topic → Publish message → label it WORKSHOP TEST, send once with permission, verify receipt. This tests SNS→email, not CloudWatch metric→alarm. Full alarm path is tested separately in 5.5. Avoid duplicate subscriptions or repeated confirmation messages. Remove only owned test subscriptions during cleanup.


## Historical Console screenshots

These shared images document the original manual exercise. Settings before Save and older three-variable/two-table/four-route layouts are not the current target; compare the service configuration tables. Screenshots do not prove the new baseline has been executed.

![Historical Console evidence 1](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-001.png)

*Figure 1. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 2](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-002.png)

*Figure 2. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 3](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-003.png)

*Figure 3. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 4](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-004.png)

*Figure 4. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 5](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-005.png)

*Figure 5. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 6](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-006.png)

*Figure 6. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 7](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-007.png)

*Figure 7. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 8](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-008.png)

*Figure 8. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 9](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-009.png)

*Figure 9. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 10](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-010.png)

*Figure 10. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 11](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-011.png)

*Figure 11. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 12](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-012.png)

*Figure 12. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 13](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-013.png)

*Figure 13. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 14](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-014.png)

*Figure 14. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 15](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-015.png)

*Figure 15. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 16](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-016.png)

*Figure 16. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 17](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-017.png)

*Figure 17. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 18](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-018.png)

*Figure 18. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 19](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/image-19.png)

*Figure 19. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 20](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-020.png)

*Figure 20. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 21](/images/5-Workshop/FLASHRUSH/evidence/5.3.8-SNS/update-021.png)

*Figure 21. Historical Console evidence; verify the saved configuration against the steps above.*

### Cognito mapping

SNS alarm subscription confirmation is separate from Cognito email verification. Confirming either email does not confirm the other or grant application roles. [Mapping Cognito]({{< relref "/5-Workshop/5.7-Baseline-and-evidence/" >}})
