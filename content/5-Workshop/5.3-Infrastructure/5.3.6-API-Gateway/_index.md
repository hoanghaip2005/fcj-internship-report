---
title: "API Gateway HTTP API"
weight: 6
chapter: false
flashrush: true
pre: "<b>5.3.6. </b> "
---

## Objective

Verify HTTP routes, CORS, throttles and response semantics.

## Knowledge and inputs

Basic AWS Console, PowerShell and Git knowledge. Use the same approved lab account, region and session variables from 5.2. Provision only through the repository scripts; Console steps inspect resources, not create duplicates. All commands below run from the inner application root unless stated otherwise.

## Routes and integration

Template creates HTTP API flashrush-lab-api with AWS_PROXY Lambda payload2.0; GET /products, GET /products/{productId}, POST /orders, GET /orders/{orderId}. Stage $default is AutoDeploy; throttle5 requests/s, burst10. CORS allows WebsiteUrl and localhost:5173/127.0.0.1:5173 with content-type/idempotency-key/x-order-token. CORS is not authentication.

Console → API Gateway → APIs → HTTP API → Routes/Integrations/Stages/CORS. Outputs.ApiUrl is the base endpoint; do not invent a stage suffix. Access logs /aws/apigateway/flashrush-lab record requestId/status/routeKey/latency, not bearer tokens.
```powershell
$ApiId = ($Outputs.ApiUrl -replace '^https://','').Split('.')[0]
aws apigatewayv2 get-routes --api-id $ApiId @AwsArgs
aws apigatewayv2 get-stages --api-id $ApiId @AwsArgs
aws apigatewayv2 get-api --api-id $ApiId @AwsArgs --query '{Protocol:ProtocolType,Cors:CorsConfiguration,Endpoint:ApiEndpoint}'
```
[SCREENSHOT REQUIRED: HTTP API routes, Lambda integration, default stage and CORS; images/5-Workshop/09-api.png]

Catalog may be empty before seeding. POST tests follow seeding in 5.5. 202=ACK/PENDING; 200 terminal replay;409 payload conflict;404 missing/invalid token;503 uncertain enqueue—retry same key/payload. Operators need API Gateway read; clients use HTTPS; Lambda authorization is separate. Requests/logs incur costs; delete through stack cleanup.

## Troubleshooting

429: back off and retain the key. CORS: compare actual browser origin; wildcard is not authentication. A token-related 404 does not prove the order was deleted.

## Checkpoint and rollback

Record the expected output, UTC, commit and target. Stop on mismatch; do not label an unexecuted step PASS. Read-only inspection needs no rollback. If a mutation fails, preserve manifests and events; use the rollback/cleanup procedure in 5.6 after ownership checks. No cleanup is executed by reading this page.

[Next step]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.7-S3-CloudFront/" >}})

## Official references

- [HTTP API throttling](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-throttling.html)
