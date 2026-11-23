---
title: "5.3.3 AWS IAM"
weight: 3
draft: false
---




**Mục tiêu:** Hai execution roles và quyền truy cập tối thiểu.

> **Hình thức:** Tạo thủ công bằng **AWS Management Console**. Các thao tác dưới đây tạo hoặc cập nhật tài nguyên AWS thật và có thể phát sinh phí. Chỉ làm trên bộ `flashrush-manual-*`, không đụng tới `flashrush-lab` của CloudFormation. Ảnh thực hành được trình bày bên dưới; các điểm chưa đủ bằng chứng cần kiểm tra lại trên AWS.

**Điều kiện đầu vào:** Hoàn thành [5.2 Chuẩn bị]({{< relref "/5-Workshop/5.2-Prerequisite/" >}}) và các mục 5.3 đứng trước trang này. Region `us-east-1`; thay `YOUR_AWS_ACCOUNT_ID` bằng Account ID đúng của người thực hành.

### 5.3.3.1 Tạo log groups trước để giới hạn quyền ghi log

Console → CloudWatch → Logs → Log groups → Create log group. Tạo:

![Mở chức năng tạo log group](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-01.png)

*Hình 5.3.3.1. Mở chức năng tạo log group.*

- `/aws/lambda/flashrush-manual-api`

- `/aws/lambda/flashrush-manual-worker`

- `/aws/apigateway/flashrush-manual`

Với mỗi group, đặt retention **7 days**. Execution role bên dưới chỉ ghi stream/event vào group đã có, không cấp CreateLogGroup.

![Tạo ba log groups và đặt retention 7 ngày](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-02.png)

*Hình 5.3.3.2. Tạo ba log groups và đặt retention 7 ngày.*

![Tạo ba log groups và đặt retention 7 ngày](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-03.png)

*Hình 5.3.3.3. Tạo ba log groups và đặt retention 7 ngày.*

![Tạo ba log groups và đặt retention 7 ngày](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-04.png)

*Hình 5.3.3.4. Tạo ba log groups và đặt retention 7 ngày.*

### 5.3.3.2 Tạo execution role API


**Bước 1.** IAM → Roles → Create role → AWS service → Lambda.

![Tạo role với trusted entity AWS service Lambda](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-05.png)

*Hình 5.3.3.5. Tạo role với trusted entity AWS service Lambda.*

![Tạo role với trusted entity AWS service Lambda](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-06.png)

*Hình 5.3.3.6. Tạo role với trusted entity AWS service Lambda.*


**Bước 2.** Tên role `flashrush-manual-api-role`.

![Đặt tên execution role API](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-07.png)

*Hình 5.3.3.7. Đặt tên execution role API.*


**Bước 3.** Kiểm tra Trust relationships có nội dung sau.


**Bước 4.** Permissions → Add permissions → Create inline policy → JSON, dán policy API ở [mục 5.3.3.3 IAM API role]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.3-IAM/" >}}).

![Mở chức năng tạo inline policy](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-08.png)

*Hình 5.3.3.8. Mở chức năng tạo inline policy.*


**Bước 5.** Nếu Console đã tự gắn AWSLambdaBasicExecutionRole, chỉ bỏ policy rộng đó sau khi log group và inline log permissions đã được tạo đúng.

Trust policy áp dụng cho cả API role và Worker role:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}
```

Trust policy xác định ai được assume role; permissions policy xác định role làm được gì. Không gán AdministratorAccess cho runtime Lambda. [Nguồn execution role](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html).

### 5.3.3.3 Inline policy API

Policy name: `flashrush-manual-api-runtime`. JSON này dùng đúng account, region và tên tài nguyên manual trong tài liệu.

![Nhập inline policy API và đặt tên policy](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-09.png)

*Hình 5.3.3.9. Nhập inline policy API và đặt tên policy.*

![Nhập inline policy API và đặt tên policy](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-10.png)

*Hình 5.3.3.10. Nhập inline policy API và đặt tên policy.*

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["dynamodb:GetItem", "dynamodb:Scan"],
      "Resource": "arn:aws:dynamodb:us-east-1:YOUR_AWS_ACCOUNT_ID:table/flashrush-manual-products"
    },
    {
      "Effect": "Allow",
      "Action": ["dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem"],
      "Resource": "arn:aws:dynamodb:us-east-1:YOUR_AWS_ACCOUNT_ID:table/flashrush-manual-orders"
    },
    {
      "Effect": "Allow",
      "Action": "sqs:SendMessage",
      "Resource": "arn:aws:sqs:us-east-1:YOUR_AWS_ACCOUNT_ID:flashrush-manual-orders"
    },
    {
      "Effect": "Allow",
      "Action": ["logs:CreateLogStream", "logs:PutLogEvents"],
      "Resource": "arn:aws:logs:us-east-1:YOUR_AWS_ACCOUNT_ID:log-group:/aws/lambda/flashrush-manual-api:*"
    }
  ]
}
```

### 5.3.3.4 Tạo Worker role

Tạo `flashrush-manual-worker-role` với cùng trust policy. Thêm inline policy `flashrush-manual-worker-runtime`:

![Tạo Worker role và inline policy tương ứng](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-11.png)

*Hình 5.3.3.11. Tạo Worker role và inline policy tương ứng.*

![Tạo Worker role và inline policy tương ứng](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-12.png)

*Hình 5.3.3.12. Tạo Worker role và inline policy tương ứng.*

![Tạo Worker role và inline policy tương ứng](/images/5-Workshop/FLASHRUSH/evidence/5.3.3-IAM/image-13.png)

*Hình 5.3.3.13. Tạo Worker role và inline policy tương ứng.*

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"],
      "Resource": "arn:aws:sqs:us-east-1:YOUR_AWS_ACCOUNT_ID:flashrush-manual-orders"
    },
    {
      "Effect": "Allow",
      "Action": ["dynamodb:GetItem", "dynamodb:UpdateItem", "dynamodb:ConditionCheckItem"],
      "Resource": [
        "arn:aws:dynamodb:us-east-1:YOUR_AWS_ACCOUNT_ID:table/flashrush-manual-products",
        "arn:aws:dynamodb:us-east-1:YOUR_AWS_ACCOUNT_ID:table/flashrush-manual-orders"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["logs:CreateLogStream", "logs:PutLogEvents"],
      "Resource": "arn:aws:logs:us-east-1:YOUR_AWS_ACCOUNT_ID:log-group:/aws/lambda/flashrush-manual-worker:*"
    }
  ]
}
```

DynamoDB transaction kiểm tra quyền của từng thao tác bên trong. Update dùng UpdateItem; ConditionCheck dùng ConditionCheckItem. Không tự thêm action IAM không tồn tại chỉ vì tên API là TransactWriteItems. [Nguồn quyền transaction](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis-iam.html).

**Điểm kiểm tra:** hai role có trust Lambda, ARN resource đúng region/account, API không có quyền cập nhật Products, Worker không có quyền quản trị hạ tầng.

