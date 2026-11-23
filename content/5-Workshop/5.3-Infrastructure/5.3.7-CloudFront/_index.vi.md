---
title: "5.3.7 Amazon CloudFront"
weight: 7
draft: false
---




**Mục tiêu:** OAC, HTTPS, bucket policy và SPA Function.

> **Hình thức:** Tạo thủ công bằng **AWS Management Console**. Các thao tác dưới đây tạo hoặc cập nhật tài nguyên AWS thật và có thể phát sinh phí. Chỉ làm trên bộ `flashrush-manual-*`, không đụng tới `flashrush-lab` của CloudFormation. Ảnh thực hành được trình bày bên dưới; các điểm chưa đủ bằng chứng cần kiểm tra lại trên AWS.

**Điều kiện đầu vào:** Hoàn thành [5.2 Chuẩn bị]({{< relref "/5-Workshop/5.2-Prerequisite/" >}}) và các mục 5.3 đứng trước trang này. Region `us-east-1`; thay `YOUR_AWS_ACCOUNT_ID` bằng Account ID đúng của người thực hành.

### 5.3.7.1 Tạo distribution và OAC


**Bước 1.** CloudFront → Create distribution. Chọn cấu hình distribution tiêu chuẩn với S3 origin; nếu giao diện có thêm lựa chọn gói, kiểm tra giá trước khi chọn.

![Tạo distribution, chọn gói và đặt tên](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-01.png)

*Hình 5.3.7.1. Tạo distribution, chọn gói và đặt tên.*

![Tạo distribution, chọn gói và đặt tên](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-02.png)

*Hình 5.3.7.2. Tạo distribution, chọn gói và đặt tên.*

![Tạo distribution, chọn gói và đặt tên](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-03.png)

*Hình 5.3.7.3. Tạo distribution, chọn gói và đặt tên.*


**Bước 2.** Origin domain: chọn bucket website manual; dùng regional REST endpoint, không dùng website endpoint.


**Bước 3.** Origin path: để trống vì index nằm ở gốc.

![Chọn S3 REST origin và để trống origin path](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-04.png)

*Hình 5.3.7.4. Chọn S3 REST origin và để trống origin path.*

![Chọn S3 REST origin và để trống origin path](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-05.png)

*Hình 5.3.7.5. Chọn S3 REST origin và để trống origin path.*

![Chọn S3 REST origin và để trống origin path](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-06.png)

*Hình 5.3.7.6. Chọn S3 REST origin và để trống origin path.*


**Bước 4.** Origin access: Origin access control → Create OAC, tên `flashrush-manual-oac`.


**Bước 5.** Signing behavior: Always sign requests, protocol SigV4.

![Tạo OAC, chọn ký request và sao chép bucket policy](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-12.png)

*Hình 5.3.7.12. Tạo OAC, chọn ký request và sao chép bucket policy.*

![Tạo OAC, chọn ký request và sao chép bucket policy](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-13.png)

*Hình 5.3.7.13. Tạo OAC, chọn ký request và sao chép bucket policy.*

![Tạo OAC, chọn ký request và sao chép bucket policy](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-14.png)

*Hình 5.3.7.14. Tạo OAC, chọn ký request và sao chép bucket policy.*

![Tạo OAC, chọn ký request và sao chép bucket policy](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-15.png)

*Hình 5.3.7.15. Tạo OAC, chọn ký request và sao chép bucket policy.*


**Bước 6.** Viewer protocol policy: Redirect HTTP to HTTPS.


**Bước 7.** Allowed methods: GET, HEAD. Bật compression.


**Bước 8.** Cache policy: Managed-CachingOptimized để khớp template.


**Bước 9.** Default root object: index.html.

![Đặt default root object index.html](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-10.png)

*Hình 5.3.7.10. Đặt default root object index.html.*

![Đặt default root object index.html](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-11.png)

*Hình 5.3.7.11. Đặt default root object index.html.*


**Bước 10.** Dùng default CloudFront certificate và domain cloudfront.net. Không cần Route 53/ACM cho bài lab này.


**Bước 11.** Price class theo baseline: PriceClass_100. Đây là lựa chọn lab; đánh giá độ trễ cho người dùng Việt Nam khi chọn vùng edge.


**Bước 12.** Tạo distribution. Ghi Distribution ID và Domain name, chờ trạng thái deployed sau mỗi lần cập nhật.

![Rà soát và tạo distribution; ảnh cuối đang Deploying](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-07.png)

*Hình 5.3.7.7. Rà soát và tạo distribution; ảnh cuối đang Deploying.*

![Rà soát và tạo distribution; ảnh cuối đang Deploying](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-08.png)

*Hình 5.3.7.8. Rà soát và tạo distribution; ảnh cuối đang Deploying.*

![Rà soát và tạo distribution; ảnh cuối đang Deploying](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-09.png)

*Hình 5.3.7.9. Rà soát và tạo distribution; ảnh cuối đang Deploying.*

### 5.3.7.2 Gắn bucket policy cho OAC

**Minh họa thao tác**


![Mở S3 Permissions, lưu bucket policy và kiểm tra Block Public Access](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-16.png)

*Hình 5.3.7.16. Mở S3 Permissions, lưu bucket policy và kiểm tra Block Public Access.*

![Mở S3 Permissions, lưu bucket policy và kiểm tra Block Public Access](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-17.png)

*Hình 5.3.7.17. Mở S3 Permissions, lưu bucket policy và kiểm tra Block Public Access.*

![Mở S3 Permissions, lưu bucket policy và kiểm tra Block Public Access](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-18.png)

*Hình 5.3.7.18. Mở S3 Permissions, lưu bucket policy và kiểm tra Block Public Access.*

![Mở S3 Permissions, lưu bucket policy và kiểm tra Block Public Access](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-19.png)

*Hình 5.3.7.19. Mở S3 Permissions, lưu bucket policy và kiểm tra Block Public Access.*

![Mở S3 Permissions, lưu bucket policy và kiểm tra Block Public Access](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-20.png)

*Hình 5.3.7.20. Mở S3 Permissions, lưu bucket policy và kiểm tra Block Public Access.*

CloudFront có thể cung cấp nút Copy policy. Vào S3 bucket → Permissions → Bucket policy, cho phép CloudFront đọc object khi SourceArn đúng distribution. Ví dụ dưới đây cần thay `YOUR_DISTRIBUTION_ID`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {"Service": "cloudfront.amazonaws.com"},
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::flashrush-manual-web-YOUR_AWS_ACCOUNT_ID-us-east-1/*",
      "Condition": {"StringEquals": {
        "AWS:SourceArn": "arn:aws:cloudfront::YOUR_AWS_ACCOUNT_ID:distribution/YOUR_DISTRIBUTION_ID"
      }}
    },
    {
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::flashrush-manual-web-YOUR_AWS_ACCOUNT_ID-us-east-1",
        "arn:aws:s3:::flashrush-manual-web-YOUR_AWS_ACCOUNT_ID-us-east-1/*"
      ],
      "Condition": {"Bool": {"aws:SecureTransport": "false"}}
    }
  ]
}
```

Giữ Block Public Access bật. OAC cần S3 REST origin, không tương thích theo cùng cách với website endpoint. [Nguồn OAC và bucket policy](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html).

### 5.3.7.3 Làm cho refresh đường dẫn React hoạt động

BrowserRouter cần trả index.html cho đường dẫn ứng dụng. Tạo CloudFront Function thay vì đổi mọi lỗi 403/404 thành 200, vì cách đổi tất cả có thể che lỗi file assets.


**Bước 1.** CloudFront → Functions → Create function → tên `flashrush-manual-spa-rewrite`, runtime cloudfront-js-2.0.

![Tạo CloudFront Function cho SPA](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-21.png)

*Hình 5.3.7.21. Tạo CloudFront Function cho SPA.*

![Tạo CloudFront Function cho SPA](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-22.png)

*Hình 5.3.7.22. Tạo CloudFront Function cho SPA.*


**Bước 2.** Dán code sau, Save.

![Nhập code Function và Save changes](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-23.png)

*Hình 5.3.7.23. Nhập code Function và Save changes.*


**Bước 3.** Test URI `/products/manual-sku-001`: request URI đầu ra phải là `/index.html`.

![Test đường dẫn sản phẩm ở DEVELOPMENT](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-24.png)

*Hình 5.3.7.24. Test đường dẫn sản phẩm ở DEVELOPMENT.*

![Test đường dẫn sản phẩm ở DEVELOPMENT](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-25.png)

*Hình 5.3.7.25. Test đường dẫn sản phẩm ở DEVELOPMENT.*


**Bước 4.** Test URI `/assets/missing.js`: URI giữ nguyên.

![Test đường dẫn asset ở DEVELOPMENT](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-26.png)

*Hình 5.3.7.26. Test đường dẫn asset ở DEVELOPMENT.*


**Bước 5.** Publish function lên LIVE.

![Màn hình Publish Function; cần xác nhận LIVE sau publish](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-27.png)

*Hình 5.3.7.27. Màn hình Publish Function; cần xác nhận LIVE sau publish.*


**Bước 6.** Distribution → Behaviors → Default behavior → Function associations → Viewer request → chọn function LIVE.

![Chỉnh default behavior và gắn Function vào viewer request](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-28.png)

*Hình 5.3.7.28. Chỉnh default behavior và gắn Function vào viewer request.*

![Chỉnh default behavior và gắn Function vào viewer request](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-29.png)

*Hình 5.3.7.29. Chỉnh default behavior và gắn Function vào viewer request.*

```javascript
function handler(event) {
  var request = event.request;
  var appRoute = /^\/(products|checkout|orders|admin|monitoring)(\/.*)?$/.test(request.uri);
  var filePath = /\.[^/]+$/.test(request.uri);
  if (appRoute && !filePath) request.uri = '/index.html';
  return request;
}
```

Đường `/` dùng DefaultRootObject. Khi thêm route React cấp cao mới, phải cập nhật rule tương ứng.

