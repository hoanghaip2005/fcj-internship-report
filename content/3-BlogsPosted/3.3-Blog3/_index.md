---
title: "Blog 3"
date: 2024-01-01
weight: 3
chapter: false
pre: " <b> 3.3. </b> "
---

# APPLICATION AUTHENTICATION AND AUTHORIZATION ON AWS WITH AMAZON COGNITO

In modern web and mobile application development, user management extends well beyond basic sign-up and sign-in functionality. Production systems must address complex requirements including Multi-Factor Authentication (MFA), federated social identity (Google, Apple), API route authorization, and secure cloud resource access.

On AWS, **Amazon Cognito** serves as the dedicated serverless CIAM platform to streamline this entire process. Instead of provisioning credential databases, managing JWT signing algorithms, or operating self-hosted authentication servers, developers can focus on application features while AWS manages security, encryption, and automatic scaling behind the scenes.

How do AWS services collaborate to deliver a secure, resilient authentication and authorization workflow in the cloud?

---

### 1. Architectural Components Overview

Architectural diagram of authentication and authorization with Amazon Cognito:

![Architectural diagram of authentication and authorization with Amazon Cognito](/images/3-BlogsPosted/blog4-cognito-architecture.png)

In this architecture, each service fulfills a designated role:

* **Amazon Cognito User Pool:** Acts as the user directory. Manages sign-up, sign-in, MFA verification, social federation, and emits standard OIDC tokens (`ID Token`, `Access Token`, and `Refresh Token`).
* **Amazon Cognito Identity Pool:** Governs cloud authorization. Exchanges ID Tokens for temporary, scoped AWS credentials (`AWS Temporary Credentials` via STS) to delegate direct AWS resource access.
* **Amazon API Gateway:** Serves as the central API entry point. Employs the built-in `Cognito User Pool Authorizer` to verify token signatures at the edge before dispatching requests to backend compute.
* **AWS Lambda:** Executes business microservices and provides Lambda Triggers to customize lifecycle events (such as domain whitelisting or token claims enrichment).
* **Amazon DynamoDB:** NoSQL database storing user profile metadata and core application records.
* **Amazon S3:** Provides dedicated object storage for private user files, enabling direct upload and download via IAM SigV4 without intermediate proxy servers.
* **AWS WAF:** Protects identity entry points against brute-force attacks, credential stuffing, and malicious bots.

A defining feature of this design is the strict separation of concerns: **User Pools handle user authentication (AuthN)**, whereas **Identity Pools govern AWS cloud infrastructure authorization (AuthZ)**.

---

### 2. System Workflow

The process originates at the Client (Web or Mobile application). When a user signs in, credentials or social tokens are transmitted to the **Amazon Cognito User Pool**. Upon successful verification and optional MFA validation, the User Pool issues three standard OIDC tokens: the `ID Token` (user profile data), `Access Token` (API access permissions), and `Refresh Token` (session continuity).

When invoking backend APIs, the Client submits requests to **Amazon API Gateway** with the Access Token in the `Authorization` header. API Gateway automatically validates the cryptographic signature against Cognito's cached JSON Web Key Set (JWKS) in-memory without incurring compute charges, subsequently routing valid requests to **AWS Lambda** and **Amazon DynamoDB**.

For high-volume storage operations (such as profile pictures or private documents), the Client avoids routing payloads through Lambda or API Gateway. Instead, the Client presents its ID Token to **Cognito Identity Pool**, which issues temporary AWS credentials via **AWS STS**. The Client uses these temporary keys to sign SigV4 requests and upload directly to **Amazon S3**. Data isolation is strictly enforced through dynamic IAM policies keyed to the user's unique identity ID.

---

### 3. Key Implementation Considerations

#### Distinguishing Between User Pools and Identity Pools
A common architectural pitfall is conflating these two components:
* **User Pool:** Use when building authentication forms, managing passwords, and securing your custom backend APIs.
* **Identity Pool:** Use when granting clients scoped permissions to interact directly with AWS services (such as direct S3 uploads or DynamoDB queries).

#### Designing Practical Token Lifecycles
To balance robust security with a smooth user experience:
* Configure short expiration windows for `Access Token` and `ID Token` (typically 15 to 60 minutes) to mitigate risk if a token is intercepted.
* Rely on `Refresh Token` with longer lifespans (several days to weeks), stored within the client's secure hardware enclave, to renew sessions without prompting repeated logins.

#### Enforcing Least Privilege with Dynamic S3 IAM Policies
When delegating direct S3 access to authenticated users, avoid creating separate buckets per user. Instead, leverage dynamic IAM policy variable substitution:
`arn:aws:s3:::my-bucket/users/${cognito-identity.amazonaws.com:sub}/*`
The `${cognito-identity.amazonaws.com:sub}` variable is automatically populated by AWS STS, ensuring each user can strictly access only their personal folder.

#### Optimizing API Gateway Authorization
Always favor the native **Cognito User Pool Authorizer** over custom Lambda Authorizers for standard JWT verification. The native authorizer executes in-memory with sub-millisecond latency and incurs zero execution charges.

---

### 4. Monitoring and Cost Optimization

Operational visibility and budget governance are essential for production workloads:

* **Amazon CloudWatch:** Tracks authentication success and failure rates, authorizer latency, and Lambda Trigger execution logs.
* **Cognito Advanced Security Features (ASF):** Provides adaptive risk-based authentication to challenge anomalous logins from unfamiliar IP addresses and blocks credentials exposed in dark-web breaches.
* **Cost Structure:**
  * **Cognito User Pool:** Generous Free Tier covering **50,000 Monthly Active Users (MAU)** perpetually.
  * **Cognito Identity Pool:** Free of charge.
  * **API Gateway & Lambda:** Purely usage-based pricing metered per request and compute duration.
  * **AWS WAF:** Billed per Web ACL and inspected requests; rules should be tailored to project budgets.

---

### 5. Summary

This architecture demonstrates that identity management on AWS is far more than a simple database table — it is an orchestrated serverless ecosystem:

**Cognito User Pool** manages identity lifecycles and token issuance, **Cognito Identity Pool** bridges applications to AWS IAM permissions, **API Gateway** shields backend microservices, and **Amazon S3** provides secure, direct data storage.

This pattern eliminates server maintenance overhead, ensures seamless auto-scaling as user traffic grows, and maintains compliance with rigorous enterprise security standards.

---

### References

* Amazon Cognito Developer Guide - AWS:
  [https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html)
* Getting Started with Amazon Cognito User Pools:
  [https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html)
* Controlling Access to S3 with Amazon Cognito:
  [https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-integrating-user-pools-with-identity-pools.html](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-integrating-user-pools-with-identity-pools.html)

#AWS #AmazonCognito #CyberSecurity #CloudComputing #Serverless #OAuth2 #AmazonAPIGateway #AmazonS3 #awsstudygroup #FCAJ

---

### Publication evidence

The article about Amazon Cognito shared in the AWS Study Group VN community.

![The article about Amazon Cognito shared in the AWS Study Group VN community.](/images/3-BlogsPosted/evidence/blog3-cognito-published.png)
