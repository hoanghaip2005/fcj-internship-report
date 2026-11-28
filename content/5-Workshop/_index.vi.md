---
title: "FLASHRUSH Workshop thực hành AWS Console"
weight: 5
chapter: false
pre: '<b>5. </b> '
draft: false
---

Mục tiêu: dựng kiến trúc FLASHRUSH trên **AWS Management Console (us-east-1)** bằng các thao tác web, không chạy CloudFormation. Mã nguồn Python Lambda và React lấy từ repository FLASHRUSH.

**Ảnh thực hành của 9 dịch vụ AWS** đã được bổ sung từ tài liệu của các thành viên. Mỗi ảnh thể hiện một bước hoặc cấu hình cụ thể; không mặc định mọi màn hình nhập liệu đều đã được lưu thành công. Hệ thống manual có namespace riêng, không quản lý tài nguyên của stack CloudFormation nếu có nhóm dựng lại.

1. [5.1 Tổng quan và kiến trúc]({{< relref "/5-Workshop/5.1-Workshop-overview/" >}})
2. [5.2 Chuẩn bị Console và môi trường]({{< relref "/5-Workshop/5.2-Prerequisite/" >}})
3. [5.3 Tự tạo và cấu hình 9 dịch vụ AWS]({{< relref "/5-Workshop/5.3-Infrastructure/" >}})
4. [5.4 Build React, upload S3 và tích hợp CloudFront]({{< relref "/5-Workshop/5.4-Application-deployment/" >}})
5. [5.5 Kiểm thử Lambda, đơn hàng, SQS/DLQ và CloudWatch]({{< relref "/5-Workshop/5.5-Testing-and-monitoring/" >}})
6. [5.6 Cleanup, theo dõi chi phí và bàn giao]({{< relref "/5-Workshop/5.6-Cleanup/" >}})

> **Phạm vi minh chứng:** Đã có ảnh cấu hình từng dịch vụ. Kiểm thử toàn bộ luồng đặt hàng, xử lý lỗi và dọn tài nguyên cần được xác nhận riêng bằng kết quả thực tế.
