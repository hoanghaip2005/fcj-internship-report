---
title: "Blog 2"
date: 2024-01-01
weight: 2
chapter: false
pre: " <b> 3.2. </b> "
---

# LƯU TRỮ TỐC ĐỘ CAO TRÊN AWS VỚI AMAZON S3 EXPRESS ONE ZONE

Amazon S3 từ lâu đã là tiêu chuẩn lưu trữ đối tượng trên AWS với độ bền 99.999999999%. Tuy nhiên, với các hệ thống đòi hỏi truy xuất dữ liệu liên tục ở tần suất cao như huấn luyện mô hình AI/ML, xử lý dữ liệu thời gian thực hay hệ thống phân tích tương tác độ trễ truy cập của S3 Standard đôi khi trở thành điểm nghẽn, tùy workload.

Trên AWS, **Amazon S3 Express One Zone** là lớp lưu trữ hiệu năng cao được thiết kế để giải quyết bài toán này. Thay vì lưu dữ liệu trên nhiều Availability Zone, S3 Express One Zone tập trung vào tốc độ, đặt dữ liệu cùng Availability Zone với tài nguyên tính toán và giảm độ trễ xuống mức single-digit millisecond.

Vậy S3 Express One Zone hoạt động như thế nào và phù hợp với loại workload nào?

---

### 1. Tổng quan các thành phần trong kiến trúc

Sơ đồ kiến trúc lưu trữ tốc độ cao với Amazon S3 Express One Zone:

![Amazon S3 Express One Zone Architecture](/images/3-BlogsPosted/blog3-s3-express.png)

Trong kiến trúc này, mỗi thành phần đảm nhận một vai trò riêng:

* **Amazon S3 Express One Zone (Directory Bucket):** Lớp lưu trữ chính cho dữ liệu "nóng". Dùng loại bucket đặc biệt là Directory Bucket với cấu trúc thư mục phân cấp thực sự, tối ưu cho thao tác đọc/ghi liên tục tần suất cao.
* **Amazon EC2 / EKS / SageMaker (cùng AZ):** Tài nguyên tính toán đặt trong cùng Availability Zone với Directory Bucket. Đây là yếu tố cốt lõi giúp loại bỏ độ trễ mạng liên AZ.
* **Amazon Athena / Apache Spark / EMR:** Các query engine và framework phân tích truy cập S3 Express One Zone trực tiếp để tận dụng tốc độ đọc dữ liệu nhanh hơn đáng kể so với S3 Standard.
* **Amazon S3 Standard:** Lớp lưu trữ lâu dài (cold/warm tier) cho dữ liệu gốc, kết quả cuối cùng và các file ít truy cập. Kết hợp với S3 Express One Zone theo mô hình Two-Tier Storage.
* **AWS IAM / Session Credentials:** S3 Express One Zone dùng cơ chế xác thực dựa trên session (`CreateSession`), cấp thông tin xác thực tạm thời cho các thao tác dữ liệu; request vẫn phải được ký bằng SigV4.

---

### 2. Luồng hoạt động của hệ thống

Điểm khác biệt chính của S3 Express One Zone nằm ở cách dữ liệu được lưu và truy cập.

Khi một job huấn luyện AI hoặc pipeline phân tích khởi động, tài nguyên tính toán (EC2, EKS node, SageMaker instance) gọi API `CreateSession` để lấy session token ngắn hạn. Các request đọc/ghi tiếp theo vẫn được ký bằng SigV4 với thông tin xác thực của session. AWS SDK được hỗ trợ tự lấy và làm mới session khi cần.

Dữ liệu được truy xuất trực tiếp từ cụm phần cứng chuyên dụng đặt trong cùng Availability Zone với tài nguyên tính toán. Việc co-location này loại bỏ hoàn toàn độ trễ mạng liên AZ, hỗ trợ độ trễ single-digit millisecond. Kết quả thực tế phụ thuộc kích thước đối tượng, mức đồng thời và workload; các khoảng độ trễ không phải cam kết SLA.

Sau khi job hoàn tất, dữ liệu kết quả hoặc checkpoint cuối cùng được chuyển sang S3 Standard để lưu trữ lâu dài với chi phí thấp hơn.

---

### 3. Những điểm cần chú ý khi triển khai

**Directory Bucket và cấu trúc đặt tên**

S3 Express One Zone dùng loại bucket riêng gọi là Directory Bucket, khác hoàn toàn với General Purpose Bucket thông thường. Tên bucket phải có đuôi định danh Availability Zone, ví dụ: `my-data--use1-az4--x-s3`. Bucket chỉ có thể tạo trong một AZ cụ thể và không thể thay đổi sau khi tạo.

**Dữ liệu chỉ nằm trong một AZ**

Khác với S3 Standard lưu dữ liệu trên nhiều AZ để đảm bảo độ bền 11 số 9, S3 Express One Zone chỉ lưu trong một AZ. S3 Express One Zone vẫn được thiết kế cho độ bền 99.999999999%, nhưng không chịu được việc mất toàn bộ AZ: dữ liệu có thể bị mất, không chỉ tạm thời không truy cập được. Do đó, chỉ nên dùng cho dữ liệu tạm thời hoặc có bản gốc ở nơi khác không phải lưu trữ chính.

**Chi phí lưu trữ cao hơn, chi phí request thấp hơn**

Giá phụ thuộc Region, thời điểm và loại request. Cần đối chiếu bảng giá S3 hiện hành, tính cả dung lượng, request, truy xuất và truyền dữ liệu; không dùng giá ra mắt làm giá hiện tại. Mô hình này phù hợp với workload đọc/ghi liên tục nhưng không cần giữ dữ liệu lâu dài.

**Tài nguyên tính toán phải cùng AZ**

Để đạt được độ trễ thấp nhất, EC2 instance, EKS node hay SageMaker notebook phải được đặt trong cùng Availability Zone với Directory Bucket. Truy cập từ AZ khác vẫn có thể thực hiện, nhưng cần đo thêm độ trễ và chi phí truyền dữ liệu liên AZ.

---

### 4. Khi nào nên dùng S3 Express One Zone?

**Nên dùng S3 Express One Zone khi:**

* Huấn luyện AI/ML, lưu checkpoint model
* Dữ liệu phân tích tương tác thời gian thực
* Dữ liệu trung gian của ETL, shuffle data

**Nên dùng S3 Standard khi:**

* Lưu trữ lâu dài, backup, archive
* Static website, file người dùng upload
* Dữ liệu cần đa AZ để đảm bảo tính sẵn sàng cao (HA)

---

### 5. Tổng kết

Qua kiến trúc này, có thể thấy Amazon S3 Express One Zone không phải là sự thay thế của S3 Standard mà là phần bổ sung giải quyết một bài toán cụ thể mà S3 Standard không tối ưu được: tốc độ truy xuất cho dữ liệu "nóng" ở tần suất cao.

Mô hình Two-Tier Storage kết hợp S3 Express One Zone (hot tier) và S3 Standard (cold/warm tier) là kiến trúc phổ biến trong các hệ thống AI/ML và phân tích dữ liệu trên AWS tận dụng được tốc độ của S3 Express One Zone trong quá trình xử lý, đồng thời kiểm soát chi phí bằng cách chuyển dữ liệu sang S3 Standard sau khi hoàn tất.

Đây là một dịch vụ đáng tìm hiểu khi xây dựng các pipeline dữ liệu hoặc hệ thống AI/ML đòi hỏi hiệu năng cao trên AWS Cloud.

---

**Tài liệu tham khảo**

* Amazon S3 Express One Zone AWS Documentation: [https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-one-zone.html](https://docs.aws.amazon.com/AmazonS3/latest/userguide/s3-express-one-zone.html)
* S3 Express One Zone Performance AWS Blog: [https://aws.amazon.com/blogs/aws/new-amazon-s3-express-one-zone-high-performance-storage-class/](https://aws.amazon.com/blogs/aws/new-amazon-s3-express-one-zone-high-performance-storage-class/)
* Directory Buckets AWS S3 User Guide: [https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-overview.html](https://docs.aws.amazon.com/AmazonS3/latest/userguide/directory-buckets-overview.html)

---

*#AWS #S3 #S3ExpressOneZone #AIML #DataEngineering #CloudStorage #AWSStudyGroup*

---

### Minh chứng bài viết đã đăng

Bài viết về Amazon S3 Express One Zone được chia sẻ trong nhóm AWS Study Group VN.

![Bài viết về Amazon S3 Express One Zone được chia sẻ trong nhóm AWS Study Group VN.](/images/3-BlogsPosted/evidence/blog2-s3-express-published.png)
