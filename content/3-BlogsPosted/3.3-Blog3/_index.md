---
title: "Blog 3"
weight: 3
chapter: false
pre: "<b>3.3. </b> "
---

## Application authentication and authorization on AWS with Amazon Cognito

User management includes registration, sign-in, MFA, federation, API access and data permissions. Amazon Cognito provides managed identity services; applications remain responsible for configuration, token protection and business authorization.

### 1. Architectural components

![Authentication and authorization with Amazon Cognito](/images/3-BlogsPosted/blog4-cognito-architecture.png)

- **User Pool:** manages users, authenticates them and issues ID/access tokens; refresh tokens are issued in supported flows. MFA, social federation and sign-in behavior depend on configuration.
- **Identity Pool:** maps supported authenticated identities to IAM roles and provides temporary AWS credentials through STS for scoped client access to AWS services.
- **API Gateway:** validates tokens before forwarding requests. REST APIs use Cognito User Pool authorizers; HTTP APIs use JWT authorizers with appropriate issuer, audience and scopes.
- **Lambda and DynamoDB:** execute business logic, enforce data authorization and store application profiles. Lambda Triggers can customize supported Cognito lifecycle steps.
- **S3:** stores private objects; clients can sign SigV4 requests with temporary credentials rather than proxying every file through the backend.
- **AWS WAF:** can add request controls at supported integration points. It does not replace authentication, authorization or application error handling.

User Pools serve application identity; Identity Pools delegate AWS resource access through IAM. An application using a User Pool does not necessarily need an Identity Pool.

### 2. System workflow

1. The client signs in through the configured User Pool flow and completes MFA when required.
2. The client receives tokens and stores them according to its security architecture. ID tokens describe identity; access tokens carry access scopes; refresh tokens request new tokens under the session policy.
3. The client calls API Gateway with an `Authorization` token. The authorizer checks signatures and claims according to the API type; the backend still enforces access to individual data objects.
4. For direct S3 access, an Identity Pool can exchange a supported identity for temporary AWS credentials. The client signs SigV4 requests; IAM, bucket policies and S3 controls determine whether requests are permitted.

For HTTP APIs, configure route scopes to enforce access-token permissions instead of relying only on a valid signature. For REST APIs, ID/access-token behavior depends on method OAuth scopes. Tokens issued by the same pool are not automatically interchangeable.

### 3. Implementation considerations

#### Authentication versus business authorization

A valid token does not grant access to every profile. Backends must associate identity with data ownership or business roles and reject out-of-scope access. Identity Pool roles also need restricted actions and resources.

#### Token lifecycle

Choose expiry based on risk and usability. A 15–60 minute access/ID-token lifetime can be a starting point rather than a universal rule. Refresh tokens have separate expiry and revocation policies.

On mobile, use the platform's secure storage. On the web, choose storage according to the architecture and threat model, considering XSS, CSRF, logout and revocation. Do not assume browser storage has a mobile-style hardware enclave.

#### Least-privilege S3 access

An example object scope is:

`arn:aws:s3:::my-bucket/users/${cognito-identity.amazonaws.com:sub}/*`

This variable represents the Identity Pool identity ID, not directly the User Pool `sub`. Policies must grant the appropriate object actions; listing a bucket requires a separate statement and prefix condition where needed. Isolation depends on role and bucket configuration together, not the ARN string alone.

#### Match the authorizer to the API type

Prefer a built-in authorizer when it meets the requirements. API Gateway can cache JWKS keys; cache misses and network fetches can affect latency. Do not promise every request completes below 2 ms or that the whole authentication path is free. Lambda authorizers remain useful for custom logic outside built-in capabilities.

### 4. Monitoring and cost

- Use available service metrics and Lambda Trigger logs; inspect feature availability and settings before assuming complete sign-in logging.
- Evaluate threat protection, MFA and WAF according to tier, support and application needs. These reduce risk without guaranteeing absolute security.
- User Pool pricing depends on tier, sign-in method, MAU and account eligibility. Current pricing lists a 10,000-MAU free tier for some Lite/Essentials sign-in methods; Plus and other cases have different conditions. Do not apply 50,000 free MAUs universally.
- Cognito pricing provides Identity Pools at no charge, while accessed AWS services have separate costs. Include applicable SMS, email, API Gateway, Lambda and WAF charges in estimates.

### 5. Summary

Cognito reduces identity-service operations. A complete design still requires the correct authorizer type, protected tokens and restricted data access. The diagram illustrates integration; it does not establish tested behavior or compliance with a particular security standard.

### References

- [Amazon Cognito](https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html)
- [User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-pools.html)
- [Identity Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/amazon-cognito-integrating-user-pools-with-identity-pools.html)
- [HTTP API JWT authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-jwt-authorizer.html)
- [REST API Cognito authorizer](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html)
- [Cognito pricing](https://aws.amazon.com/cognito/pricing/)

### Publication evidence

The article was shared in the AWS Study Group VN community.

![AWS Study Group VN](/images/3-BlogsPosted/evidence/blog3-cognito-published.png)
