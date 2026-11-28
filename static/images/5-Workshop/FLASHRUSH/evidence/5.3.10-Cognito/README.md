# Cognito evidence — captured 2026-11-28

Captured read-only from AWS Console account 303278700480, region us-east-1. User Pool: `flashrush-customers` (`us-east-1_mIpzTH61t`).

- `01-pool-overview.png` — pool name, ID, ARN, region, OIDC/JWKS URLs.
- `02-sign-in.png` — email sign-in, password-only choice, MFA disabled, recovery enabled.
- `03-sign-up.png` — email verification, required email attribute, self-registration enabled.

Remaining evidence: API Gateway JWT authorizer, redacted Lambda environment variables, Customers/Business DynamoDB schemas, browser `/auth` and `/admin` role routing. App client and groups are captured in `04-app-client.png`, `06-app-client-detail.png`, and `05-groups.png`.

No synthetic screenshot is stored here. Read-only JSON inventory is under `/downloads/flashrush-extended/verified-lab-config-20261128.json`.
