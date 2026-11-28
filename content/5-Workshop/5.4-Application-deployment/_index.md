---
title: "5.4 Build and publish the application"
weight: 4
draft: false
---

## Build locally, provision through Console

Complete infrastructure first: working six-route HTTP API, private S3, CloudFront/OAC. At frontend/package.json create .env.local:

```dotenv
VITE_ORDER_MODE=http
VITE_API_BASE_URL=https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com
VITE_DEMO_SERVICE_ERROR=false
```

Replace API ID; do not append /products. Do not carry Cognito client/region from another environment into this guest build. No secret belongs in a VITE variable. In PowerShell at the pinned frontend directory:

```powershell
Remove-Item Env:VITE_ORDER_MODE -ErrorAction SilentlyContinue
Remove-Item Env:VITE_API_BASE_URL -ErrorAction SilentlyContinue
Remove-Item Env:VITE_DEMO_SERVICE_ERROR -ErrorAction SilentlyContinue
Remove-Item Env:VITE_COGNITO_CLIENT_ID -ErrorAction SilentlyContinue
Remove-Item Env:VITE_COGNITO_REGION -ErrorAction SilentlyContinue
npm.cmd ci
if ($LASTEXITCODE -ne 0) { throw 'Install failed' }
npm.cmd test
if ($LASTEXITCODE -ne 0) { throw 'Tests failed' }
npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw 'Build failed' }
```

These Remove-Item commands only clear process environment variables, not files. Also remove Cognito entries from .env.local for this guest track. S3 cannot compile React or unpack the application automatically.

## Publish and validate

S3 Console → bucket → Upload contents of dist at bucket root: assets/images first, index last; check MIME types and encryption. Keep a backup of previous overwritten objects and old hashed assets. CloudFront → Invalidations → /* → wait Completed. Add exact domain to API CORS, Save.

Visit CloudFront home, product, Buy now while signed out, /checkout and /orders. Network must show the chosen HTTP API, not mock/local endpoints. Refresh deep links; test a missing .js returns error; direct S3 stays private. Check stock/order in Console after an authorized test. Do not claim customer cart/voucher/admin support from the guest deployment. Changing API URL requires a rebuild. Roll back using backed-up build objects, index last, followed by invalidation.


## Required full-project configuration — 28 November 2026

Earlier guest screenshots/steps on this page are the foundation only. A full-feature rebuild must apply the configuration below and [5.3.10 Cognito]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}}). Do not mix the reference lab pool/client/tables with another manual deployment.


A full-feature frontend requires the Cognito public client from the **same target** as its API:

```dotenv
VITE_ORDER_MODE=http
VITE_API_BASE_URL=https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com
VITE_COGNITO_REGION=us-east-1
VITE_COGNITO_CLIENT_ID=YOUR_PUBLIC_CLIENT_ID
VITE_DEMO_SERVICE_ERROR=false
```

Never put client secrets, passwords or access tokens in frontend environment variables. Rebuild after API/client changes. Run npm ci, lint, tests and build; do not upload .env files. Customers/staff share /auth; server /auth/me roles route owner/manager/support to /admin, warehouse to inventory and customers to /account. APIs still enforce endpoint permissions.

Current main-push automation publishes **lab frontend only** after checks. It does not provision infrastructure or deploy backend. A separate manual group's bucket is not updated by that workflow. Release compatible backend before dependent frontend, and record commits/artifacts; successful UI deployment does not prove migrations or schema setup.
