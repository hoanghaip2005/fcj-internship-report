---
title: "Bản đề xuất"
weight: 2
chapter: false
pre: "<b>2. </b> "
---

# Đề xuất xây dựng hệ thống Flash Sale Serverless FLASHRUSH trên AWS

## 1. Tóm tắt đề xuất

FLASHRUSH là hệ thống minh họa xử lý đơn hàng trong một đợt bán giới hạn số lượng. Đề xuất tập trung vào ba vấn đề: tiếp nhận yêu cầu tăng đột biến, xử lý đơn bất đồng bộ và bảo đảm số đơn được xác nhận không vượt tồn kho. Hệ thống sử dụng React cho giao diện, Python cho nghiệp vụ và các dịch vụ AWS Serverless để giảm công việc quản lý máy chủ.

Sản phẩm hướng tới môi trường học tập và thực hành trong chương trình **First Cloud AI Journey** của sinh viên **Phạm Hoàng Hải MSSV 2302700162**. Phần triển khai chi tiết được trình bày tại [Workshop FLASHRUSH]({{< relref "/5-Workshop/" >}}).

**Trạng thái đề xuất:** Dự án đã có mã nguồn, hướng dẫn và ảnh thực hành của chín dịch vụ AWS. Các ảnh ghi nhận quá trình cấu hình cùng một số kết quả kiểm thử. Cần tiếp tục đối chiếu cấu hình trên AWS và kiểm chứng toàn bộ luồng đặt hàng trước khi nghiệm thu.

## 2. Bài toán và mục tiêu

Trong Flash Sale, nhiều người có thể cùng mua sản phẩm còn ít hàng. Nếu đọc tồn kho rồi cập nhật bằng những thao tác rời rạc, nhiều yêu cầu có thể cùng nhìn thấy một số lượng hàng và dẫn đến bán vượt tồn kho. Người dùng bấm lại hoặc trình duyệt gửi lại yêu cầu cũng có thể tạo đơn trùng. Ngoài ra, xử lý mọi tác vụ ngay trong một request khiến thời gian phản hồi phụ thuộc vào toàn bộ luồng nghiệp vụ.

Đề xuất đặt ra các mục tiêu:

- Tiếp nhận yêu cầu qua HTTP API, đưa tác vụ vào hàng đợi để xử lý bất đồng bộ.
- Dùng cập nhật có điều kiện và transaction DynamoDB để bảo vệ tồn kho.
- Sử dụng idempotency key để nhận biết yêu cầu gửi lại cùng một ý định mua.
- Cho phép người dùng theo dõi trạng thái đơn, phân biệt đã tiếp nhận với đã mua thành công.
- Thu thập log, theo dõi hàng đợi và cảnh báo lỗi để phục vụ vận hành lab.
- Ghi lại cấu hình, kết quả kiểm thử và quy trình dọn dẹp để có thể thực hành lại.

## 3. Phạm vi thực hiện

| Trong phạm vi | Kết quả dự kiến |
|---|---|
| Danh mục và chi tiết sản phẩm | Đọc dữ liệu từ DynamoDB qua API |
| Tạo đơn một sản phẩm | `quantity` là số nguyên 1, kiểm tra dữ liệu đầu vào |
| Tiếp nhận và xử lý đơn | Lambda API, SQS và Lambda Worker |
| Bảo vệ tồn kho | Transaction cập nhật tồn kho và xác nhận đơn |
| Tra cứu đơn | Kiểm tra `X-Order-Token` gắn với đơn |
| Phân phối giao diện | React build trên S3 private, truy cập qua CloudFront |
| Giám sát | CloudWatch logs, metrics, alarms và email qua SNS |
| Tài liệu thực hành | Chín dịch vụ AWS, kiểm thử, ảnh minh chứng và cleanup |

Chưa đưa vào phạm vi: thanh toán thật, vận chuyển, tài khoản khách hàng production, backend quản trị và hệ thống phân tích kinh doanh. Các trang Admin/Monitoring của frontend hiện dùng dữ liệu mô phỏng. Đồng hồ đếm ngược trên giao diện chưa phải cơ chế cưỡng chế thời gian bán tại backend.

## 4. Kiến trúc đề xuất

![Sơ đồ kiến trúc tham chiếu FLASHRUSH v1.1](/images/5-Workshop/FLASHRUSH/flashrush-architecture-v1.1.png)

*Sơ đồ tham chiếu do nhóm cung cấp, thể hiện thiết kế v1.1; không phải ảnh chứng minh tài nguyên AWS đang hoạt động. Khi triển khai, cần đối chiếu từng thành phần với mã nguồn và cấu hình Workshop.*

| Dịch vụ | Vai trò trong giải pháp |
|---|---|
| Amazon S3 | Lưu bản build frontend trong bucket private |
| Amazon CloudFront | Phân phối website qua HTTPS, truy cập S3 bằng OAC |
| Amazon API Gateway | Cung cấp HTTP API, cấu hình routes và CORS |
| AWS Lambda | Tách hàm API tiếp nhận yêu cầu và Worker xử lý đơn |
| Amazon DynamoDB | Lưu Products, Orders; bảo vệ cập nhật tồn kho |
| Amazon SQS | Đệm yêu cầu xử lý, retry và đưa message lỗi vào DLQ |
| AWS IAM | Phân quyền riêng theo trách nhiệm API và Worker |
| Amazon CloudWatch | Lưu log, theo dõi metrics và tạo alarms |
| Amazon SNS | Gửi thông báo cảnh báo đến email đã xác nhận |

### 4.1. Luồng truy cập và đặt hàng

1. Người dùng mở website qua CloudFront; CloudFront lấy nội dung từ S3 private.
2. Frontend gọi API Gateway để lấy danh sách hoặc chi tiết sản phẩm.
3. Khi mua, frontend gửi yêu cầu kèm idempotency key. Lambda API kiểm tra dữ liệu, ghi nhận đơn và gửi message vào SQS.
4. HTTP `202 Accepted` xác nhận yêu cầu được tiếp nhận; chưa xác nhận mua thành công.
5. Lambda Worker nhận message, xử lý transaction DynamoDB. Khi đáp ứng điều kiện tồn kho, đơn chuyển thành `CONFIRMED`; khi hết hàng, kết quả là `OUT_OF_STOCK`.
6. Frontend tra cứu trạng thái đơn bằng order ID và token để hiển thị kết quả.

### 4.2. Tính nhất quán và khả năng phục hồi

SQS có thể giao lại message, vì vậy Worker phải xử lý lặp an toàn. Việc kiểm tra trạng thái đơn và cập nhật tồn kho cần tuân theo logic transaction trong mã nguồn, tránh giảm tồn kho nhiều lần cho một đơn. Với API, gửi lại cùng key và cùng nội dung phải trỏ về cùng ý định mua; dùng lại key với nội dung khác cần bị từ chối.

Ghi Orders và gửi SQS là hai thao tác khác nhau, không tạo thành một transaction chung. Nếu việc gửi queue có kết quả không rõ ràng, đơn có thể cần đối soát. Mã nguồn bàn giao có trạng thái `enqueueState=UNKNOWN`, lease 30 giây và giới hạn số lần gửi có điều kiện; chưa có scheduler tự khôi phục. Đây là giới hạn cần kiểm thử và ghi nhận, chưa thể khẳng định mọi đơn đều tự phục hồi.

Lỗi kỹ thuật ở Worker sử dụng partial batch failure để retry message lỗi. Message vào DLQ không tự chuyển trạng thái đơn thành `FAILED`; người vận hành cần đối chiếu log và dữ liệu trước khi xử lý lại.

## 5. Đánh giá tính khả thi

**Khả thi ở quy mô lab:** Đã có mã nguồn Python/React, schema dữ liệu và tài liệu cấu hình tham chiếu. Chín dịch vụ phù hợp để thực hành kiến trúc Serverless; không cần mua thiết bị chuyên dụng hoặc vận hành máy chủ riêng. Có thể triển khai từng thành phần và kiểm tra theo thứ tự phụ thuộc.

Điều kiện thực hiện gồm tài khoản AWS được phép sử dụng, quyền IAM phù hợp, môi trường Node.js để build frontend và kiến thức cơ bản về HTTP, Python, React, DynamoDB, SQS. Chọn Region `us-east-1` cho lab và namespace `flashrush-manual-*` theo Workshop, kiểm tra tài nguyên có sẵn trước khi tạo.

**Chưa đủ cơ sở để cam kết vận hành thương mại:** Cần bổ sung xác thực, giới hạn truy cập, kiểm soát thời gian sale ở backend, quản lý bí mật, đối soát đơn, kiểm thử tải và quy trình vận hành. Mục tiêu lab là kiểm chứng hành vi trong phạm vi xác định, không cam kết khả năng chịu tải hay tính sẵn sàng chưa được đo.

## 6. Kế hoạch triển khai

| Giai đoạn dự kiến | Công việc | Sản phẩm bàn giao |
|---|---|---|
| Buổi 1 | Chốt phạm vi, đọc source snapshot, chuẩn bị tài khoản và inventory | Danh sách tài nguyên, sơ đồ và tiêu chí kiểm thử |
| Buổi 2–3 | Tạo DynamoDB, SQS/DLQ, IAM, log groups và Lambda | API/Worker có cấu hình đúng, kiểm thử trực tiếp Lambda |
| Buổi 4 | Cấu hình HTTP API, S3 private và CloudFront/OAC | API HTTPS, website truy cập qua CloudFront |
| Buổi 5 | Build frontend, cấu hình API URL và kiểm tra CORS | Luồng trình duyệt tạo và tra cứu đơn |
| Buổi 6 | Cấu hình SNS/CloudWatch, kiểm thử retry và tồn kho | Bảng kết quả, log và ảnh minh chứng |
| Buổi 7 | Rà soát giới hạn, hoàn thiện hướng dẫn, dọn tài nguyên | Báo cáo nghiệm thu lab và inventory sau cleanup |

Đây là lịch dự kiến, điều chỉnh theo thời gian cấp quyền, lỗi cấu hình và kết quả kiểm thử. Mỗi bước chỉ ghi hoàn thành khi có kết quả thực tế. Thao tác thực hành chi tiết nằm tại [mục 5.3]({{< relref "/5-Workshop/5.3-Infrastructure/" >}}).

## 7. Ngân sách và kiểm soát chi phí

Chi phí phụ thuộc thời gian tồn tại tài nguyên, Region, lượng request, dung lượng lưu trữ, lưu lượng truyền dữ liệu và mức ghi log. Đề xuất chưa có bảng AWS Pricing Calculator được kiểm chứng cho cấu hình manual, vì vậy chưa đưa ra tổng tiền cố định hoặc cam kết miễn phí.

| Nhóm chi phí | Yếu tố cần đưa vào ước tính |
|---|---|
| CloudFront và S3 | Dung lượng frontend, request, lưu lượng tải website |
| API Gateway và Lambda | Số API call, thời gian chạy, bộ nhớ và invocation Worker |
| DynamoDB | Read/write, transaction và dung lượng hai bảng |
| SQS và SNS | Gửi/nhận/xóa message, retry và thông báo |
| CloudWatch | Log ingestion, retention, metrics và alarms |

Trước khi thực hành, lập ước tính trên [AWS Pricing Calculator](https://calculator.aws/) theo workload dự kiến, kiểm tra quyền lợi Free Tier của chính tài khoản và thống nhất ngân sách với người quản lý lab. Dùng AWS Budgets để cảnh báo; cảnh báo không tự giới hạn mức chi tiêu. Đặt log retention, giới hạn khối lượng kiểm thử và dọn tài nguyên sau nghiệm thu.

## 8. Rủi ro và phương án xử lý

| Rủi ro | Hướng xử lý dự kiến |
|---|---|
| Bán vượt tồn kho hoặc giảm tồn kho lặp | Kiểm tra transaction, điều kiện stock và xử lý message lặp |
| Đơn PENDING kéo dài | Đối chiếu enqueue state, queue, Worker logs; ghi rõ giới hạn phục hồi hiện tại |
| Message lỗi vào DLQ | Điều tra nguyên nhân, sửa lỗi, kiểm tra tính an toàn trước redrive |
| IAM quá rộng hoặc lộ dữ liệu | Giới hạn actions/resources, bucket private, OAC, che token và Account ID trong ảnh |
| Website lỗi CORS hoặc refresh route | Kiểm tra origin, routes, API URL và CloudFront Function |
| Phát sinh chi phí ngoài dự kiến | Theo dõi billing, ngân sách, retention và inventory tài nguyên |
| Nhầm dữ liệu mô phỏng với kết quả thật | Gắn nhãn mock, tách ảnh kiến trúc khỏi ảnh Console và kết quả kiểm thử |

## 9. Tiêu chí nghiệm thu và minh chứng

- Website phục vụ qua HTTPS; truy cập trực tiếp nội dung S3 private không được mở công khai.
- Đọc được danh sách và chi tiết sản phẩm qua HTTP API.
- Tạo đơn hợp lệ nhận kết quả tiếp nhận, sau đó tra cứu được trạng thái cuối bằng token đúng.
- Gửi lại cùng ý định không tạo đơn mới hoặc giảm tồn kho lần hai; nội dung khác cùng key bị từ chối theo hợp đồng API.
- Token sai không đọc được đơn; dữ liệu đầu vào sai bị từ chối.
- Trong kịch bản tồn kho được kiểm soát, tổng số lượng xác nhận không vượt tồn kho ban đầu và stock không âm.
- Theo dõi được log, queue/DLQ và cấu hình alarms; ghi riêng kết quả test thông báo nếu đã thực hiện.
- Có inventory và xác minh dọn tài nguyên sau khi kết thúc lab.

Mỗi kịch bản cần ghi điều kiện đầu vào, thao tác, kết quả kỳ vọng, kết quả thực tế và bằng chứng. Ảnh dự kiến gồm cấu hình DynamoDB, SQS/DLQ, IAM, Lambda, HTTP API, S3/OAC, CloudFront, SNS và CloudWatch; bổ sung ảnh website và trạng thái đơn. Chỉ ghi PASS khi đã kiểm tra. Workshop đã bổ sung ảnh của chín dịch vụ từ tài liệu thực hành. Các ảnh chưa chứng minh đầy đủ toàn bộ luồng đặt hàng; cấu hình và kết quả còn thiếu cần được kiểm tra riêng trên AWS.

## 10. Kết quả kỳ vọng

Hoàn thành một môi trường lab Flash Sale Serverless có luồng mua hàng bất đồng bộ, bảo vệ tồn kho và tài liệu thực hành có thể kiểm tra lại. Qua dự án, sinh viên củng cố kiến thức phân quyền IAM, tích hợp các dịch vụ AWS, xử lý nhất quán dữ liệu và giám sát hệ thống; đồng thời nhận biết các phần còn thiếu trước khi phát triển thành sản phẩm thực tế.

## Tài liệu đối chiếu

- [Repository FLASHRUSH](https://github.com/kinnynee/FLASHRUSH-Serverless-Flash-Sale).
- [Workshop triển khai AWS Console]({{< relref "/5-Workshop/" >}}).
- [DynamoDB transactions](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transactions.html).
- [Lambda với Amazon SQS](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html).
- [CloudFront truy cập S3 bằng OAC](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html).