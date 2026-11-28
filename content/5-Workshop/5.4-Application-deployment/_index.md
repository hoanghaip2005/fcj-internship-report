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
