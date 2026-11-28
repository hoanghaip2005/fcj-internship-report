---
title: "5.3.9 Amazon CloudWatch"
weight: 9
draft: false
---

## Logs and metrics

Verify API/Worker log groups and access logs have retention 7 days and real invocations. Match order ID/correlation ID across API, Worker and DynamoDB; redact order tokens, password and bearer credentials before capture. Runtime role scope is defined in IAM, not by public log access.

CloudWatch → Alarms → Create alarm → Select metric; configure each saved alarm below and attach the confirmed SNS topic:

| Alarm | Namespace/metric | Dimension | Statistic/period | Condition |
|---|---|---|---|---|
| flashrush-manual-dlqalarm | AWS/SQS ApproximateNumberOfMessagesVisible | QueueName=flashrush-manual-dlq | Maximum / 60s | >=1, 1 of 1 |
| flashrush-manual-queueagealarm | AWS/SQS ApproximateAgeOfOldestMessage | QueueName=flashrush-manual-orders | Maximum / 60s | >=60s, 1 of 1 |
| flashrush-manual-workererroralarm | AWS/Lambda Errors | FunctionName=flashrush-manual-worker | Sum / 60s | >=1, 1 of 1 |

Treat missing data as notBreaching for these lab alarms; a missing datapoint is not a measured zero. Verify correct dimensions, actions enabled and saved threshold settings. A chart without data does not prove no errors. Use actual timestamps when reading metrics and allow SQS/CloudWatch evaluation delay.

Test alerts only in the isolated manual environment following 5.5. Preserve history and mailbox evidence before cleaning the test message. Alarm History showing successful SNS action proves publication, while inbox receipt is separate evidence. Do not label a Console form or forced alarm state as proof that real application failure metrics were observed.


## Historical Console screenshots

These shared images document the original manual exercise. Settings before Save and older three-variable/two-table/four-route layouts are not the current target; compare the service configuration tables. Screenshots do not prove the new baseline has been executed.

![Historical Console evidence 1](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-001.png)

*Figure 1. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 2](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-02.png)

*Figure 2. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 3](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-003.png)

*Figure 3. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 4](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-004.png)

*Figure 4. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 5](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-005.png)

*Figure 5. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 6](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-006.png)

*Figure 6. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 7](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-007.png)

*Figure 7. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 8](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-008.png)

*Figure 8. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 9](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-009.png)

*Figure 9. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 10](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-010.png)

*Figure 10. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 11](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-011.png)

*Figure 11. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 12](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-012.png)

*Figure 12. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 13](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-013.png)

*Figure 13. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 14](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-014.png)

*Figure 14. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 15](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-015.png)

*Figure 15. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 16](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-016.png)

*Figure 16. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 17](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-017.png)

*Figure 17. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 18](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-018.png)

*Figure 18. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 19](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-21.png)

*Figure 19. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 20](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-020.png)

*Figure 20. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 21](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-021.png)

*Figure 21. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 22](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-022.png)

*Figure 22. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 23](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-25.png)

*Figure 23. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 24](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-26.png)

*Figure 24. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 25](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-27.png)

*Figure 25. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 26](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-026.png)

*Figure 26. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 27](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-027.png)

*Figure 27. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 28](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-028.png)

*Figure 28. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 29](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-029.png)

*Figure 29. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 30](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-030.png)

*Figure 30. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 31](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-031.png)

*Figure 31. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 32](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-34.png)

*Figure 32. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 33](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-35.png)

*Figure 33. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 34](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-034.png)

*Figure 34. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 35](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-035.png)

*Figure 35. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 36](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-036.png)

*Figure 36. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 37](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-037.png)

*Figure 37. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 38](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/update-038.png)

*Figure 38. Historical Console evidence; verify the saved configuration against the steps above.*

![Historical Console evidence 39](/images/5-Workshop/FLASHRUSH/evidence/5.3.9-CloudWatch/image-41.png)

*Figure 39. Historical Console evidence; verify the saved configuration against the steps above.*
