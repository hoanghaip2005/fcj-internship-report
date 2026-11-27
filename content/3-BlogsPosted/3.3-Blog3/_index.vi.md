---
title: "Blog 3"
weight: 3
chapter: false
pre: "<b>3.3. </b> "
---

## Xác thực và phân quyền ứng dụng trên AWS với Amazon Cognito

Quản lý người dùng bao gồm đăng ký, đăng nhập, MFA, liên kết danh tính, quyền gọi API và quyền truy cập dữ liệu. Amazon Cognito cung cấp dịch vụ định danh được quản lý; ứng dụng vẫn chịu trách nhiệm cấu hình, bảo vệ token và kiểm tra quyền nghiệp vụ.

### 1. Tổng quan các thành phần trong kiến trúc

![Sơ đồ xác thực và phân quyền với Amazon Cognito](/images/3-BlogsPosted/blog4-cognito-architecture.png)

- **User Pool:** quản lý người dùng, xác thực và phát hành ID token, access token; refresh token được cấp trong các luồng phù hợp. Các tính năng MFA, liên kết mạng xã hội và đăng nhập phụ thuộc cấu hình.
- **Identity Pool:** liên kết danh tính đã xác thực với IAM role và cấp credentials AWS tạm thời qua STS để client truy cập dịch vụ AWS trong phạm vi được cấp.
- **API Gateway:** kiểm tra token trước khi chuyển yêu cầu đến backend. REST API dùng Cognito User Pool authorizer; HTTP API dùng JWT authorizer với issuer, audience và scopes phù hợp.
- **Lambda và DynamoDB:** thực thi nghiệp vụ, kiểm tra quyền đối với dữ liệu và lưu hồ sơ ứng dụng. Lambda Triggers có thể tùy biến các bước Cognito hỗ trợ.
- **S3:** lưu object riêng tư; client có thể dùng credentials tạm thời để ký request SigV4 thay vì gửi mọi file qua backend.
- **AWS WAF:** có thể bổ sung kiểm soát request tại các điểm tích hợp được hỗ trợ. WAF không thay thế xác thực, phân quyền hay xử lý lỗi trong ứng dụng.

User Pool phục vụ danh tính ứng dụng; Identity Pool cấp quyền truy cập tài nguyên AWS thông qua IAM. Không phải ứng dụng dùng User Pool nào cũng cần Identity Pool.

### 2. Luồng hoạt động của hệ thống

1. Client đăng nhập qua User Pool theo luồng đã cấu hình, thực hiện MFA khi được yêu cầu.
2. Client nhận token và lưu theo mô hình bảo mật phù hợp. ID token mô tả danh tính; access token biểu thị quyền truy cập theo scopes; refresh token dùng để yêu cầu token mới theo chính sách phiên.
3. Client gọi API Gateway với token trong header `Authorization`. Authorizer kiểm tra chữ ký và claims theo loại API; backend tiếp tục kiểm tra quyền đọc/ghi đối tượng cụ thể.
4. Nếu client cần truy cập S3 trực tiếp, Identity Pool có thể trao đổi danh tính được hỗ trợ để nhận credentials tạm thời. Client ký SigV4; IAM, bucket policy và các kiểm soát S3 quyết định request có được phép hay không.

Với HTTP API, cấu hình scope trên route để kiểm soát access token thay vì dựa vào việc token có chữ ký hợp lệ. Với REST API, hành vi sử dụng ID/access token phụ thuộc cấu hình OAuth scopes của method. Không coi mọi token từ cùng User Pool là có thể thay thế cho nhau.

### 3. Những điểm cần chú ý khi triển khai

#### Phân biệt xác thực và quyền nghiệp vụ

Token hợp lệ không tự cho phép người dùng đọc mọi hồ sơ. Backend cần liên kết danh tính với chủ sở hữu dữ liệu hoặc vai trò nghiệp vụ và từ chối truy cập ngoài phạm vi. Identity Pool role cũng cần giới hạn actions và resources.

#### Quản lý vòng đời token

Chọn thời hạn token theo mức rủi ro và trải nghiệm; 15–60 phút có thể là khoảng tham khảo cho access/ID token, không phải quy tắc bắt buộc cho mọi ứng dụng. Refresh token có thời hạn và chính sách thu hồi riêng.

Trên mobile, sử dụng cơ chế lưu trữ bảo mật của nền tảng. Trên web, lựa chọn cách lưu theo kiến trúc ứng dụng và mô hình đe dọa; chú ý XSS, CSRF và xử lý đăng xuất/thu hồi. Không mặc định trình duyệt có hardware enclave như thiết bị mobile.

#### Cấp quyền S3 theo nguyên tắc tối thiểu

Ví dụ phạm vi object:

`arn:aws:s3:::my-bucket/users/${cognito-identity.amazonaws.com:sub}/*`

Biến này là Identity Pool identity ID, không phải trực tiếp User Pool `sub`. Policy phải cấp đúng actions cho object; quyền liệt kê bucket cần statement và điều kiện prefix riêng khi cần. Cấu hình bucket và role cùng quyết định tính cô lập, không chỉ riêng chuỗi ARN.

#### Chọn authorizer đúng loại API

Ưu tiên authorizer tích hợp khi đáp ứng yêu cầu. API Gateway có thể cache khóa JWKS; cache miss và tải mạng có thể ảnh hưởng độ trễ. Không có cơ sở để cam kết mọi request đều dưới 2 ms hoặc toàn bộ đường xác thực miễn phí. Lambda authorizer phù hợp khi cần logic tùy biến ngoài khả năng của authorizer tích hợp.

### 4. Giám sát và chi phí

- Theo dõi metrics được dịch vụ cung cấp và logs của Lambda Triggers; kiểm tra tính năng và cấu hình trước khi kết luận có đầy đủ log đăng nhập.
- Xem xét threat protection, MFA và WAF theo tier, khả năng hỗ trợ và yêu cầu ứng dụng. Các kiểm soát này giảm rủi ro, không bảo đảm an toàn tuyệt đối.
- Giá User Pool phụ thuộc tier, cách đăng nhập, MAU và điều kiện tài khoản. Bảng giá hiện hành nêu free tier 10.000 MAU cho một số cách đăng nhập ở Lite/Essentials; Plus và các trường hợp khác có điều kiện riêng. Không áp dụng mặc định 50.000 MAU cho mọi pool.
- Identity Pool được cung cấp không tính phí theo bảng giá Cognito; dịch vụ AWS được truy cập vẫn có phí riêng. SMS, email, API Gateway, Lambda và WAF cũng cần được đưa vào dự toán phù hợp.

### 5. Tổng kết

Cognito giúp giảm công việc vận hành dịch vụ định danh. Một thiết kế hoàn chỉnh vẫn cần chọn đúng loại authorizer, bảo vệ token và giới hạn quyền dữ liệu. Sơ đồ minh họa cách tích hợp; không xác nhận một ứng dụng đã được kiểm thử hoặc đáp ứng tiêu chuẩn bảo mật cụ thể.

### Tài liệu tham khảo

- [Amazon Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html)
- [User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html)
- [Identity Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-integrating-user-pools-with-identity-pools.html)
- [HTTP API JWT authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html)
- [REST API Cognito authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html)
- [Cognito pricing](https://aws.amazon.com/cognito/pricing/)

### Minh chứng bài viết đã đăng

Bài viết được chia sẻ trong nhóm AWS Study Group VN.

![AWS Study Group VN](/images/3-BlogsPosted/evidence/blog3-cognito-published.png)
