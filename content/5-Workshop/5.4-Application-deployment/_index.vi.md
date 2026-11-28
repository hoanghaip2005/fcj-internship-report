---
title: "5.4 Triển khai ứng dụng"
weight: 4
draft: false
---

**Điều kiện đầu vào:** Đã hoàn tất các bước 5.3. Đặc biệt cần có HTTP API endpoint, S3 private bucket và CloudFront distribution đúng bộ manual.

**Backend:** Trong 5.3 đã tạo hai Lambda và tạo đủ năm module Lambda từ baseline. Nếu chưa hoàn thành, hãy quay lại phần **5.3.4**. Không sử dụng Lambda code của dự án khác.

## 5.4.1 Phụ lục build React trên máy

Đây là bước tạo file ứng dụng, không triển khai AWS. S3 không biên dịch React và không tự giải nén ZIP frontend. Nếu đã được cung cấp dist đúng API manual, có thể bỏ qua phần lệnh này.

### 5.4.1.1 Tạo cấu hình trong trình soạn thảo

1. Mở thư mục frontend bằng VS Code.

2. Tạo `.env.local` ngay cạnh package.json.

3. Dán nội dung sau, thay URL bằng endpoint manual ở mục 5.3.5, không thêm /products.

```dotenv
VITE_ORDER_MODE=http
VITE_API_BASE_URL=https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com
VITE_DEMO_SERVICE_ERROR=false
```

4. Save. Không đặt secret vào VITE vì giá trị được đưa vào JavaScript public.

5. Cần Node.js 22.12 trở lên; máy project đã chạy với Node 24.

### 5.4.1.2 Build rồi quay lại Console

Mở terminal trong VS Code, chạy các lệnh chỉ trên máy:

```powershell
Set-Location '<DUONG_DAN_TOI_THU_MUC_APP>\frontend'
Remove-Item Env:VITE_ORDER_MODE -ErrorAction SilentlyContinue
Remove-Item Env:VITE_API_BASE_URL -ErrorAction SilentlyContinue
Remove-Item Env:VITE_DEMO_SERVICE_ERROR -ErrorAction SilentlyContinue
npm.cmd ci
if ($LASTEXITCODE -ne 0) { throw 'Cai dependency that bai' }
npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw 'Build that bai, khong upload' }
```

Remove-Item ở đây chỉ bỏ ba biến môi trường của terminal hiện tại, không xóa file; tránh Vite lấy API cũ trong shell thay cho .env.local. Chờ build thành công, mở frontend/dist kiểm tra index.html và assets. Quay lại mục 5.4.3, upload bằng S3 Console.

Thay API URL thì phải build lại. Không upload source src, package.json hoặc ZIP chưa giải nén để thay cho file dist.

## 5.4.2 Chuẩn bị bộ file frontend đã build

Sau khi có API endpoint ở mục 5.3.5, làm **mục 5.4.1** để tạo frontend/dist trỏ đúng API manual. Sau đó quay lại đây. S3 không tự build source React; không upload src/package.json để thay cho dist.

## 5.4.3 Upload frontend qua S3 Console

Trong bucket → Upload → chọn **nội dung bên trong frontend/dist**, gồm index.html, assets, images và các file build khác. Không upload nguyên thư mục dist thành một prefix dist/.

Thực hiện hoàn toàn bằng giao diện upload:

1. Bucket → Objects → Upload → **Add folder**, chọn assets bên trong dist, thêm images và thư mục khác nếu có.

2. Add files, chọn các file gốc khác nhưng tạm chưa chọn index.html.

3. Upload → chờ tất cả Succeeded → Close.

4. Upload lần nữa → Add files → chọn riêng dist/index.html.

5. Trong Properties → Metadata, nếu có, thêm Cache-Control=no-cache; có thể chỉnh sau ở object Properties.

6. Upload → chờ Succeeded.

7. Trở lại Objects, phải có index.html ở gốc, assets/ và images/, không phải dist/index.html.

8. Mở index.html → Properties → Metadata, kiểm tra Content-Type=text/html.

9. Mở một file .js, kiểm tra MIME JavaScript; .css là text/css. Nếu sai, Edit metadata rồi lưu.

10. Không cấp public read access. Sau khi cập nhật website, invalidate CloudFront như mục 5.4.4.

**Điểm kiểm tra:** index.html nằm ở gốc bucket. Mở object URL ẩn danh bị từ chối là đúng ở bước này.

## 5.4.4 Kết nối website CloudFront với HTTP API

1. Trở lại API Gateway → CORS, thêm `https://YOUR_DOMAIN.cloudfront.net`.

2. Chờ distribution triển khai xong.

3. Mở HTTPS homepage, vào sản phẩm, đặt một đơn thử, mở My Orders.

4. Refresh trực tiếp `/products/manual-sku-001` và `/orders`.

5. Mở DevTools → Network: products/orders phải gọi API manual, không chỉ chạy mock trong trình duyệt.

6. Mở URL `/assets/definitely-missing.js`: phải là lỗi 403/404, không trả nội dung index.html với 200.

7. Nếu vừa thay frontend, tạo invalidation `/*` trong tab Invalidations và chờ Completed.

Managed-CachingOptimized có minimum TTL; no-cache ở index không đồng nghĩa CDN luôn bỏ cache ngay. Sau mỗi lần upload website bằng Console, tạo invalidation theo mục 5.4.4. Khi cần chính sách cache khác cho production, thiết kế và kiểm thử riêng.

**Điểm kiểm tra:** CloudFront 200 cho homepage, route sản phẩm refresh được, object S3 vẫn private, đặt đơn đi qua API thật. Không dùng admin/Cognito ngoài phạm vi guest để đánh giá bài này.

## 5.4.5 Checkpoint triển khai

- [ ] `frontend/dist/index.html` được upload tại gốc S3 bucket, không nằm trong thư mục `dist/` trên S3.
- [ ] S3 giữ Block Public Access và CloudFront dùng OAC.
- [ ] HTTP API endpoint được cấu hình tại thời điểm build React.
- [ ] CORS đã bổ sung đúng HTTPS origin CloudFront.
- [ ] Homepage và trang chi tiết sản phẩm mở được qua CloudFront; refresh route không trả lỗi.
- [ ] DevTools Network cho thấy yêu cầu `/products` chạy đến API Gateway của bộ manual, không chỉ đọc mock data.

Tiếp theo: [5.5 Kiểm thử và giám sát]({{< relref "/5-Workshop/5.5-Testing-and-monitoring/" >}}).

## Đồng bộ build với source baseline

Dùng application root ở commit đã khóa trong 5.2. Không dùng ZIP/snapshot chưa có nguồn gốc. Home/Listing/Detail đọc products và campaigns qua HTTP. Nếu thiếu schema/campaign, sửa dữ liệu cấu hình; không đổi về mock để che lỗi. Mua khi chưa đăng nhập dùng /checkout; /orders là lịch sử guest theo browser/API. Không dùng giỏ đăng nhập, voucher, admin hoặc monitoring web trong track chín dịch vụ; các tính năng đó cần phần mở rộng Cognito và bảng phụ.

Trong .env.local không cấu hình VITE_COGNITO_CLIENT_ID hoặc VITE_COGNITO_REGION của môi trường khác. Bỏ hai biến đó khỏi môi trường terminal trước build nếu đã có. Build mới khi đổi endpoint; không upload .env hoặc secrets lên S3.

Khi upload lại: lưu dist cũ để rollback, upload assets trước và index cuối, kiểm tra hash/tên file và MIME, invalidate `/*`, chờ Completed. Không xóa assets cũ khi trình duyệt còn có thể giữ index cũ. Rollback bằng bộ dist đã lưu, upload theo cùng thứ tự rồi invalidate.
