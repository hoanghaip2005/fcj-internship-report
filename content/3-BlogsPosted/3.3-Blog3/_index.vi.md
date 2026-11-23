---
title: "Blog 3"
date: 2024-01-01
weight: 3
chapter: false
pre: " <b> 3.3. </b> "
---

# XÁC THỰC VÀ PHÂN QUYỀN ỨNG DỤNG TRÊN AWS VỚI AMAZON COGNITO

Trong phát triển ứng dụng Web và Mobile hiện đại, việc quản lý người dùng không chỉ dừng lại ở tính năng đăng ký hay đăng nhập. Hệ thống còn phải xử lý các bài toán phức tạp như xác thực đa yếu tố (MFA), đăng nhập qua mạng xã hội (Google, Apple), phân quyền gọi API backend và kiểm soát quyền truy cập dữ liệu người dùng trên Cloud.

Trên AWS, **Amazon Cognito** là giải pháp Serverless chuyên dụng giúp đơn giản hóa toàn bộ quá trình này. Thay vì phải tự quản lý cơ sở dữ liệu lưu mật khẩu, tự viết mã mã hóa JWT token hay vận hành cụm máy chủ xác thực riêng, Cognito cho phép lập trình viên tập trung vào trải nghiệm ứng dụng, trong khi AWS đảm nhận phần bảo mật, mã hóa và tự động mở rộng theo lưu lượng người dùng.

Vậy các dịch vụ AWS phối hợp với nhau như thế nào để một hệ thống xác thực và phân quyền có thể vận hành ổn định và bảo mật trên môi trường Cloud?

---

### 1. Tổng quan các thành phần trong kiến trúc

Sơ đồ kiến trúc xác thực và phân quyền với Amazon Cognito:

![Sơ đồ kiến trúc xác thực và phân quyền với Amazon Cognito](/images/3-BlogsPosted/blog4-cognito-architecture.png)

Trong kiến trúc này, mỗi dịch vụ đảm nhận một vai trò riêng:

* **Amazon Cognito User Pool:** Đóng vai trò là thư mục người dùng (User Directory). Quản lý việc đăng ký, đăng nhập, xác thực qua email/SMS OTP hoặc tài khoản mạng xã hội, và cấp phát bộ ba OIDC Token (`ID Token`, `Access Token`, `Refresh Token`).
* **Amazon Cognito Identity Pool:** Đảm nhận việc ủy quyền (Authorization). Đổi ID Token lấy thông tin xác thực AWS tạm thời (`AWS Temporary Credentials` gồm AccessKey, SecretKey và SessionToken) để cấp quyền truy cập tài nguyên AWS.
* **Amazon API Gateway:** Cổng tiếp nhận các yêu cầu API từ người dùng. Tích hợp sẵn bộ lọc `Cognito User Pool Authorizer` để tự động kiểm tra chữ ký token trước khi chuyển tiếp request vào backend.
* **AWS Lambda:** Thực thi logic nghiệp vụ cho các API hoặc đóng vai trò Lambda Triggers để can thiệp vào các bước trong vòng đời người dùng (như xác thực email công ty, tùy biến claims).
* **Amazon DynamoDB:** Cơ sở dữ liệu NoSQL lưu trữ hồ sơ chi tiết và dữ liệu nghiệp vụ của ứng dụng.
* **Amazon S3:** Nơi lưu trữ tài liệu, hình ảnh riêng tư của từng người dùng, hỗ trợ client upload/download trực tiếp mà không cần trung chuyển qua server.
* **AWS WAF:** Tấm lá chắn gắn trước cổng đăng nhập, ngăn chặn các cuộc tấn công Brute-force, Credential Stuffing và Botnet.

Một điểm đáng chú ý là Cognito tách bạch rõ ràng giữa hai khái niệm: **User Pool chịu trách nhiệm xác thực danh tính người dùng ứng dụng (Authentication)**, còn **Identity Pool chịu trách nhiệm cấp quyền cho người dùng đó truy cập vào các tài nguyên đám mây của AWS (Authorization)**.

---

### 2. Luồng hoạt động của hệ thống

Quá trình hoạt động bắt đầu từ phía Client (ứng dụng Web hoặc Mobile). Khi người dùng thực hiện đăng nhập, thông tin được gửi đến **Amazon Cognito User Pool**. Sau khi xác thực thông tin đăng nhập và kiểm tra MFA (nếu có), User Pool sẽ trả về bộ ba Token chuẩn OIDC: `ID Token` (chứa hồ sơ user), `Access Token` (dùng để gọi API) và `Refresh Token` (dùng để gia hạn phiên làm việc).

Khi người dùng cần gọi các tính năng nghiệp vụ, Client gửi request đến **Amazon API Gateway** kèm Access Token trong header `Authorization`. API Gateway sẽ tự động tải và cache bộ khóa công khai (JWKS) từ Cognito để xác minh tính hợp lệ của token ngay tại Edge mà không phát sinh thêm chi phí compute, sau đó chuyển tiếp request hợp lệ đến **AWS Lambda** để xử lý và đọc/ghi dữ liệu vào **Amazon DynamoDB**.

Đối với các tác vụ lưu trữ tệp dữ liệu lớn (như ảnh đại diện, tệp tài liệu), Client không cần gửi dữ liệu qua Lambda hay API Gateway để tránh quá tải. Thay vào đó, Client gửi ID Token sang **Cognito Identity Pool** để đổi lấy một bộ khóa tạm thời từ **AWS STS**. Client sử dụng bộ khóa này để ký chữ ký AWS SigV4 và tải file trực tiếp lên **Amazon S3**. Dữ liệu được bảo vệ an toàn tuyệt đối nhờ chính sách IAM Policy cô lập thư mục theo ID của từng người dùng.

---

### 3. Những điểm cần chú ý khi triển khai

#### Phân biệt rõ vai trò User Pool và Identity Pool
Rất nhiều kỹ sư mới bắt đầu thường nhầm lẫn giữa hai thành phần này. Cần nhớ nguyên tắc:
* **User Pool:** Dùng khi bạn cần tạo form đăng ký/đăng nhập, quản lý mật khẩu và bảo vệ các API của riêng bạn.
* **Identity Pool:** Dùng khi bạn muốn cấp quyền cho client gọi trực tiếp đến các dịch vụ của AWS như tải file lên S3, đọc bảng DynamoDB hay gửi dữ liệu vào IoT Core.

#### Quản lý vòng đời Token hợp lý
Để cân bằng giữa tính bảo mật và trải nghiệm người dùng:
* Nên cấu hình thời gian sống của `Access Token` và `ID Token` ngắn (khoảng 15 đến 60 phút) để hạn chế rủi ro nếu token bị lộ.
* Sử dụng `Refresh Token` với thời hạn dài hơn (vài ngày đến vài tuần) được lưu trong bộ nhớ an toàn (Secure Storage/Keystore) của thiết bị để tự động gia hạn token mà không bắt người dùng đăng nhập lại liên tục.

#### Cấp quyền S3 theo nguyên tắc Đặc quyền tối thiểu (Least Privilege)
Khi cấp quyền cho người dùng truy cập trực tiếp vào S3, không nên dùng một bucket riêng cho mỗi người. Thay vào đó, sử dụng tính năng thay thế biến ngữ cảnh động của IAM:
`arn:aws:s3:::my-bucket/users/${cognito-identity.amazonaws.com:sub}/*`
Biến `${cognito-identity.amazonaws.com:sub}` sẽ tự động khớp với ID duy nhất của người dùng, đảm bảo mỗi người chỉ có thể đọc và ghi vào đúng thư mục của chính mình.

#### Tối ưu hóa xác thực trên API Gateway
Nên ưu tiên sử dụng tính năng **Cognito User Pool Authorizer** tích hợp sẵn của API Gateway thay vì tự viết Lambda Authorizer. Cơ chế tích hợp sẵn này thực hiện xác thực chữ ký token ngay trong bộ nhớ với độ trễ cực thấp (< 2ms) và hoàn toàn miễn phí.

---

### 4. Giám sát và tối ưu chi phí

Sau khi hệ thống đi vào hoạt động, việc theo dõi định danh và tối ưu chi phí là yếu tố quan trọng:

* **Amazon CloudWatch:** Thu thập các chỉ số về số lượt đăng nhập thành công/thất bại, độ trễ xác thực và log lỗi từ các Lambda Triggers.
* **Cognito Advanced Security Features (ASF):** Tính năng bảo mật nâng cao hỗ trợ phát hiện hành vi đăng nhập bất thường từ các IP lạ, phát hiện mật khẩu đã bị lộ lọt trên môi trường Internet và tự động kích hoạt xác thực đa yếu tố thích ứng (Adaptive MFA).
* **Về chi phí:**
  * **Amazon Cognito User Pool:** Miễn phí cho **50.000 người dùng hoạt động hàng tháng (MAU)** đầu tiên trong Free Tier, rất tiết kiệm cho các dự án vừa và nhỏ.
  * **Cognito Identity Pool:** Hoàn toàn miễn phí khi sử dụng.
  * **Amazon API Gateway & AWS Lambda:** Chi phí chỉ phát sinh theo số lượng request thực tế và thời gian thực thi (Pay-as-you-go).
  * **AWS WAF:** Tính phí theo số lượng Web ACL và số triệu request kiểm tra, cần cân nhắc cấu hình rule phù hợp với ngân sách dự án.

---

### 5. Tổng kết

Qua kiến trúc này, có thể thấy việc xây dựng hệ thống quản lý định danh trên AWS không chỉ dừng lại ở một bảng tài khoản trong cơ sở dữ liệu, mà là sự phối hợp nhịp nhàng giữa nhiều dịch vụ Serverless:

**Cognito User Pool** quản lý danh tính và cấp phát token, **Cognito Identity Pool** kết nối quyền hạn với hạ tầng AWS, **API Gateway** bảo vệ các API microservices, và **Amazon S3** hỗ trợ lưu trữ dữ liệu người dùng trực tiếp một cách an toàn.

Mô hình này giúp loại bỏ gánh nặng vận hành máy chủ xác thực, đảm bảo hệ thống tự động mở rộng khi lượng người dùng tăng trưởng, đồng thời tuân thủ các chuẩn mực an toàn thông tin khắt khe trên nền tảng đám mây.

---

### Tài liệu tham khảo

* Amazon Cognito Developer Guide AWS:
  [https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html)
* Getting Started with Amazon Cognito User Pools:
  [https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html)
* Controlling Access to S3 with Amazon Cognito:
  [https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-integrating-user-pools-with-identity-pools.html](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-integrating-user-pools-with-identity-pools.html)

#AWS #AmazonCognito #CyberSecurity #CloudComputing #Serverless #OAuth2 #AmazonAPIGateway #AmazonS3 #awsstudygroup #FCAJ

---

### Minh chứng bài viết đã đăng

Bài viết về Amazon Cognito được chia sẻ trong nhóm AWS Study Group VN.

![Bài viết về Amazon Cognito được chia sẻ trong nhóm AWS Study Group VN.](/images/3-BlogsPosted/evidence/blog3-cognito-published.png)
