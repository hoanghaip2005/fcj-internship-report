---
title: "5.3.7 Amazon CloudFront"
weight: 7
draft: false
---

Mục tiêu: OAC, HTTPS, bucket policy và SPA Function.

Điều kiện đầu vào: Hoàn thành [5.2 Chuẩn bị]({{< relref "/5-Workshop/5.2-Prerequisite/" >}}) và các mục 5.3 đứng trước trang này. Region us-east-1; thay YOUR_AWS_ACCOUNT_ID bằng Account ID đúng của người thực hành.

### 5.3.7.1 Tạo distribution và OAC

Vào AWS Management Console → tìm CloudFront → chọn Distributions → nhấn Create distribution:

![Mở danh sách CloudFront distributions](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-001.png)

*Hình 5.3.7.1. Mở danh sách CloudFront distributions.*

Step 1 Choose a plan:

Bấm chọn ô Pay as you go bên phải (không dùng Flat-rate plans).

Nhấn Next.

Kiểm tra: Khung Pay as you go hiện viền xanh.

![Chọn gói Pay as you go](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-02.png)

*Hình 5.3.7.2. Chọn gói Pay as you go.*

Step 2 Get started:

Distribution name: Nhập flashrush-manual-web (hoặc tên gợi nhớ bất kỳ).

Distribution type: Giữ mặc định Single website or app.

Nhấn Next.

![Đặt tên distribution](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-03.png)

*Hình 5.3.7.3. Đặt tên distribution.*

Step 3 Specify origin:

Origin type: Chọn Amazon S3.

![Chọn origin Amazon S3](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-04.png)

*Hình 5.3.7.4. Chọn origin Amazon S3.*

Origin: Nhấn Browse S3 và chọn đúng bucket REST endpoint:

flashrush-manual-web-YOUR_AWS_ACCOUNT_ID-us-east-1.s3.us-east-1.amazonaws.com

Origin path: Để trống.

![Chọn đúng bucket S3 REST origin](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-005.png)

*Hình 5.3.7.5. Chọn đúng bucket S3 REST origin.*

Allow private S3 bucket access to CloudFront: Giữ nguyên tích xanh Allow private S3 bucket access to CloudFront - Recommended.

Origin settings: Chọn Use recommended origin settings.

Cache settings: Chọn Use recommended cache settings tailored to serving S3 content. Sau khi lưu, mở Behaviors → Default (*) và kiểm tra Redirect HTTP to HTTPS, GET/HEAD, Managed-CachingOptimized và Compress objects automatically = Yes.

Nhấn Next.

![Cho phép truy cập S3 private và chọn cache settings](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-06.png)

*Hình 5.3.7.6. Cho phép truy cập S3 private và chọn cache settings.*

Step 4 Enable security:

Tại mục Web Application Firewall (WAF), chọn Do not enable security protections (tắt WAF để tránh phát sinh phí ngoài ý muốn).

Nhấn Next.

![Lựa chọn WAF cho môi trường lab](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-07.png)

*Hình 5.3.7.7. Lựa chọn WAF cho môi trường lab.*

Step 5 Review and create:

Rà soát lại toàn bộ cấu hình và nhấn Create distribution.

Kiểm tra: Trình duyệt mở trang quản lý chi tiết của Distribution vừa tạo (có các tab General, Origins, Behaviors...).

![Rà soát distribution trước khi tạo](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-008.png)

*Hình 5.3.7.8. Rà soát distribution trước khi tạo.*

![Trang chi tiết distribution](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-009.png)

*Hình 5.3.7.9. Trang chi tiết distribution.*

Cấu hình thông số Baseline & OAC:

Ngay tại trang quản lý chi tiết của Distribution vừa tạo, bạn hoàn thiện 2 thiết lập sau để khớp tuyệt đối với yêu cầu đề bài:

**Bước 1.** Thiết lập Default root object và Price class (Tab General):

Tại tab General, nhấn Edit ở góc trên bên phải khung Settings.

![Mở General Settings để chỉnh cấu hình](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-010.png)

*Hình 5.3.7.10. Mở General Settings để chỉnh cấu hình.*

Price class: Chọn Use only North America and Europe (PriceClass_100).

Default root object: Nhập chính xác index.html.

![Đặt PriceClass_100 và default root object index.html](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-011.png)

*Hình 5.3.7.11. Đặt PriceClass_100 và default root object index.html.*

Nhấn Save changes.

**Bước 2.** Tạo và gán OAC chuẩn (Tab Origins):

Chuyển sang tab Origins → tích chọn dòng S3 origin → nhấn Edit.

![Mở cấu hình S3 origin](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-012.png)

*Hình 5.3.7.12. Mở cấu hình S3 origin.*

Tại Origin access control, chọn flashrush-manual-oac nếu OAC này đã có. Chỉ nhấn Create new OAC khi cần tạo OAC lần đầu.

![Chọn hoặc tạo OAC](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-013.png)

*Hình 5.3.7.13. Chọn hoặc tạo OAC.*

Name: flashrush-manual-oac

Signing behavior: Giữ Sign requests (recommended) (SigV4)

Origin type: S3 → nhấn Create.

![Tên OAC và chế độ ký request](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-14.png)

*Hình 5.3.7.14. Tên OAC và chế độ ký request.*

Chọn flashrush-manual-oac trong danh sách thả xuống → nhấn Save changes.

Sau khi lưu, mở lại tab Origins và xác nhận S3 REST origin đang gắn OAC flashrush-manual-oac với Sign requests (recommended). Ảnh Edit origin bên dưới minh họa lựa chọn trước khi lưu.

![Gắn OAC vào S3 origin](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-015.png)

*Hình 5.3.7.15. Gắn OAC vào S3 origin.*

### 5.3.7.2 Cập nhật Bucket Policy cho OAC và HTTPS trên S3

Mở dịch vụ Amazon S3 → vào bucket flashrush-manual-web-YOUR_AWS_ACCOUNT_ID-us-east-1 → chuyển sang tab Permissions.

![Mở S3 Permissions](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-016.png)

*Hình 5.3.7.16. Mở S3 Permissions.*

Kéo xuống Bucket policy → Edit. Trong mảng Statement, bổ sung hoặc cập nhật quyền đọc của CloudFront và điều kiện từ chối truy cập qua HTTP theo mẫu. Giữ các statement cần thiết đang dùng, thay YOUR_AWS_ACCOUNT_ID và YOUR_DISTRIBUTION_ID rồi Save changes.

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

![Chỉnh bucket policy cho CloudFront OAC](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-017.png)

*Hình 5.3.7.17. Chỉnh bucket policy cho CloudFront OAC.*

![Quyền đọc giới hạn theo distribution ARN](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-018.png)

*Hình 5.3.7.18. Quyền đọc giới hạn theo distribution ARN.*

![Lưu bucket policy và yêu cầu HTTPS](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-019.png)

*Hình 5.3.7.19. Lưu bucket policy và yêu cầu HTTPS.*

Giữ Block Public Access bật. OAC cần S3 REST origin, không tương thích theo cùng cách với website endpoint. Nguồn OAC và bucket policy.

![Kiểm tra S3 Block Public Access](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-20.png)

*Hình 5.3.7.20. Kiểm tra S3 Block Public Access.*

### 5.3.7.3 Tạo CloudFront Function cho React SPA Routing

Quay lại CloudFront → chọn Functions ở menu trái → nhấn Create function:

![Mở CloudFront Functions](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-21.png)

*Hình 5.3.7.21. Mở CloudFront Functions.*

Name: flashrush-manual-spa-rewrite

Runtime: cloudfront-js-2.0

Nhấn Create function.

![Đặt tên và runtime Function](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-22.png)

*Hình 5.3.7.22. Đặt tên và runtime Function.*

Tại tab Build, xóa code mẫu và dán đoạn mã sau → nhấn Save changes:

JavaScript

```javascript
function handler(event) {
var request = event.request;
var appRoute = /^\/(products|checkout|orders|admin|monitoring)(\/.*)?$/.test(request.uri);
var filePath = /\.[^/]+$/.test(request.uri);
if (appRoute && !filePath) request.uri = '/index.html';
return request;
}
```

![Lưu mã rewrite cho SPA](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-23.png)

*Hình 5.3.7.23. Lưu mã rewrite cho SPA.*

Chuyển sang tab Test:

![Mở Function Test](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-24.png)

*Hình 5.3.7.24. Mở Function Test.*

Nhập URL path là /products/manual-sku-001 → nhấn Run test

![Test route sản phẩm trong DEVELOPMENT](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-025.png)

*Hình 5.3.7.25. Test route sản phẩm trong DEVELOPMENT.*

Đổi URL path thành /assets/missing.js → nhấn Run test

![Test đường dẫn asset giữ nguyên URI](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-026.png)

*Hình 5.3.7.26. Test đường dẫn asset giữ nguyên URI.*

Đối chiếu trường uri trong phần kết quả. /products/manual-sku-001 phải trả về /index.html. /assets/missing.js phải giữ nguyên. Hai ảnh hiện có ghi nhận Success ở DEVELOPMENT. Cần ảnh Output để xác nhận hai URI.

Chỉ khi triển khai phiên bản mới, mở tab Publish và nhấn Publish function để đưa mã lên LIVE. Với Function hiện có, kiểm tra stage LIVE trước khi thay đổi.

![Publish Function lên LIVE](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/image-27.png)

*Hình 5.3.7.27. Publish Function lên LIVE.*

Quay lại Distributions → mở YOUR_DISTRIBUTION_ID → chuyển sang tab Behaviors → tích chọn Default (*) → nhấn Edit.

![Mở default behavior](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-028.png)

*Hình 5.3.7.28. Mở default behavior.*

Ở Function associations → Viewer request, kiểm tra CloudFront Functions và flashrush-manual-spa-rewrite (LIVE). Nếu cấu hình đã lưu đúng thì giữ nguyên. Nếu chưa gắn, chọn Function, nhấn Save changes và chờ distribution triển khai xong.

![Gắn Function ở Viewer request](/images/5-Workshop/FLASHRUSH/evidence/5.3.7-CloudFront/update-029.png)

*Hình 5.3.7.29. Gắn Function ở Viewer request.*

Kiểm tra sau khi lưu và triển khai

Nếu bucket S3 chưa có bản build hoặc website trả HTTP 403, kiểm tra nội dung triển khai trước khi kết luận cấu hình phân phối sai. Phối hợp bước triển khai frontend: đặt nội dung bản build ở gốc bucket private, tải assets trước index.html, giữ Block Public Access bật, sau đó invalidate /* và chờ Completed.

Sau khi frontend được triển khai và origin của website đã được cho phép trong API Gateway CORS, kiểm tra trang chủ HTTPS, trang sản phẩm, refresh /orders và phản hồi API trong Network → Fetch/XHR.
