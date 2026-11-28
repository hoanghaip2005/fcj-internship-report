---
title: "5.3.1 Amazon DynamoDB"
weight: 1
draft: false
---

**Mục tiêu:** Hai bảng Products và Orders, tạo dữ liệu sản phẩm.

> **Hình thức:** Tạo thủ công bằng **AWS Management Console**. Các thao tác dưới đây tạo hoặc cập nhật tài nguyên AWS thật và có thể phát sinh phí. Chỉ làm trên bộ `flashrush-manual-*`, không đụng tới `flashrush-lab` của CloudFormation. Ảnh thực hành được trình bày bên dưới; các điểm chưa đủ bằng chứng cần kiểm tra lại trên AWS.

**Điều kiện đầu vào:** Hoàn thành [5.2 Chuẩn bị]({{< relref "/5-Workshop/5.2-Prerequisite/" >}}) và các mục 5.3 đứng trước trang này. Region `us-east-1`; thay `YOUR_AWS_ACCOUNT_ID` bằng Account ID đúng của người thực hành.

### 5.3.1.1 Tạo bảng Products

**Bước 1.** Console → DynamoDB → Tables → Create table.

![Mở chức năng tạo bảng DynamoDB](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-01.png)

*Hình 5.3.1.1. Mở chức năng tạo bảng DynamoDB.*

**Bước 2.** Table name: `flashrush-manual-products`.

**Bước 3.** Partition key: `productId`, kiểu String.

**Bước 4.** Không thêm sort key.

![Tên bảng Products và partition key productId kiểu String](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-02.png)

*Hình 5.3.1.2. Tên bảng Products và partition key productId kiểu String.*

**Bước 5.** Chọn capacity On-demand, tương ứng PAY_PER_REQUEST.

**Bước 6.** Giữ mã hóa do AWS quản lý; chưa cần customer managed KMS key cho bài lab.

![Chọn cấu hình bảng và capacity On-demand](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-03.png)

*Hình 5.3.1.3. Chọn cấu hình bảng và capacity On-demand.*

**Bước 7.** Tạo bảng, chờ status ACTIVE.

![Tạo bảng Products và kiểm tra trạng thái ACTIVE](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-04.png)

*Hình 5.3.1.4. Tạo bảng Products và kiểm tra trạng thái ACTIVE.*

![Tạo bảng Products và kiểm tra trạng thái ACTIVE](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-05.png)

*Hình 5.3.1.5. Tạo bảng Products và kiểm tra trạng thái ACTIVE.*

### 5.3.1.2 Tạo bảng Orders

Lặp lại với tên `flashrush-manual-orders`, partition key `orderId` kiểu String, không sort key, On-demand. Không đặt TTL trong bài lab này: xóa sớm order có thể làm mất dấu idempotency.

![Tạo bảng Orders với orderId kiểu String và kiểm tra hai bảng ACTIVE](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-06.png)

*Hình 5.3.1.6. Tạo bảng Orders với orderId kiểu String và kiểm tra hai bảng ACTIVE.*

![Tạo bảng Orders với orderId kiểu String và kiểm tra hai bảng ACTIVE](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-07.png)

*Hình 5.3.1.7. Tạo bảng Orders với orderId kiểu String và kiểm tra hai bảng ACTIVE.*

![Tạo bảng Orders với orderId kiểu String và kiểm tra hai bảng ACTIVE](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-08.png)

*Hình 5.3.1.8. Tạo bảng Orders với orderId kiểu String và kiểm tra hai bảng ACTIVE.*

![Tạo bảng Orders với orderId kiểu String và kiểm tra hai bảng ACTIVE](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-09.png)

*Hình 5.3.1.9. Tạo bảng Orders với orderId kiểu String và kiểm tra hai bảng ACTIVE.*

![Tạo bảng Orders với orderId kiểu String và kiểm tra hai bảng ACTIVE](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-10.png)

*Hình 5.3.1.10. Tạo bảng Orders với orderId kiểu String và kiểm tra hai bảng ACTIVE.*

![Hai bảng flashrush-manual-products và flashrush-manual-orders ở trạng thái Active](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/update-003.png)

*Hai bảng flashrush-manual-products và flashrush-manual-orders ở trạng thái Active.*

Không khai báo stock, status, quantity thành key hay schema bắt buộc khi tạo bảng. Các thuộc tính này nằm trong từng item.

### 5.3.1.3 Thêm một sản phẩm đầu tiên

**Bước 1.** Mở Products → Explore table items → Create item.

![Mở Explore table items và Create item](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-11.png)

*Hình 5.3.1.11. Mở Explore table items và Create item.*

![Mở Explore table items và Create item](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-12.png)

*Hình 5.3.1.12. Mở Explore table items và Create item.*

**Bước 2.** Chọn chế độ JSON và **DynamoDB JSON**.

**Bước 3.** Dán item dưới đây. Nếu thực hành sau ngày mẫu, đổi saleEndsAt thành thời điểm UTC trong tương lai.

```json
{
  "productId": {"S": "manual-sku-001"},
  "name": {"S": "Tai nghe FLASHRUSH Lab"},
  "description": {"S": "San pham thuc hanh khong thanh toan that"},
  "category": {"S": "Lab"},
  "price": {"N": "199000"},
  "priceVnd": {"N": "199000"},
  "originalPrice": {"N": "299000"},
  "stock": {"N": "10"},
  "initialStock": {"N": "10"},
  "images": {"L": [{"S": "/images/headphones.jpg"}]},
  "isFlashSale": {"BOOL": true},
  "saleEndsAt": {"S": "2026-11-27T12:00:00Z"}
}
```

![Nhập sản phẩm ở chế độ DynamoDB JSON](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-13.png)

*Hình 5.3.1.13. Nhập sản phẩm ở chế độ DynamoDB JSON.*

**Bước 4.** Save, xác nhận stock là Number 10, không phải String "10".

![Sản phẩm manual-sku-001 xuất hiện trong bảng Products](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/image-14.png)

*Hình 5.3.1.14. Sản phẩm manual-sku-001 xuất hiện trong bảng Products.*

![Dữ liệu Products và thuộc tính stock kiểu Number](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/update-004.png)

*Dữ liệu Products và thuộc tính stock kiểu Number.*

Không tạo order giả trong Orders lúc này. Lambda API sẽ tạo order với đầy đủ hash và metadata cần cho Worker.

**Điểm kiểm tra:** hai bảng ACTIVE, Products có một item, Orders rỗng. Trong Explore items, dùng tùy chọn đọc nhất quán mạnh nếu có và refresh khi đối chiếu tồn kho ngay sau giao dịch.

### Đồng bộ catalog với frontend thật

Item `manual-sku-001` là fixture kiểm thử, không phải toàn bộ catalog website. Để giao diện có đúng danh mục/sản phẩm của dự án:

**Bước 1.** Mở thư mục `examples` ở gốc ZIP. Mỗi file `*.dynamodb.json` là một item DynamoDB JSON xuất từ catalog frontend snapshot.

**Bước 2.** Thay `THAY_BANG_THOI_DIEM_UTC_TUONG_LAI` bằng thời điểm ISO UTC hợp lệ, ví dụ thời điểm thực hành cộng 7 ngày. Không dùng nguyên placeholder.

**Bước 3.** DynamoDB → Products manual → Explore items → Create item → DynamoDB JSON → dán từng file → Save. Chỉ thêm SKU chưa tồn tại; không ghi đè stock sau khi đã có đơn.

**Bước 4.** GET `/products` kiểm tra tên, giá, category, images và deadline đúng. Images tham chiếu `/images/` được build từ frontend/public.

**Bước 5.** Giữ fixture `manual-sku-001` riêng để các bài kiểm thử có stock đầu vào xác định. Không tăng stock catalog đang có đơn để làm lại test.

Bảng Orders không cần GSI, TTL hoặc sort key. `enqueueState`, `enqueueAttemptCount`, hash và lease được API tạo; không tự seed các trường này.

### Kiểm tra đơn hàng sau khi chạy luồng ứng dụng

**Bước 1.** Sau khi gửi đơn qua API, mở Explore table items của bảng Orders và kiểm tra đúng order ID.

![Bản ghi đơn hàng hiển thị trạng thái CONFIRMED](/images/5-Workshop/FLASHRUSH/evidence/5.3.1-DynamoDB/update-005.png)

*Bản ghi đơn hàng hiển thị trạng thái CONFIRMED.*

**Bước 2.** Đối chiếu thay đổi stock trong Products với số lượng đơn được xác nhận. Một ảnh CONFIRMED chưa đủ kết luận đã kiểm thử hết hàng, retry hoặc chống overselling.
