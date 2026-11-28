---
title: "5.7 Cognito, configuration, cost and evidence"
weight: 7
draft: false
---

## Current scope

The current extended FLASHRUSH adds Cognito as service 10, customer/staff shared login, live groups/RBAC, customer carts/history, vouchers and real monitoring. The original nine-service guest instructions alone do not provision these features. Use [5.3.10]({{< relref "/5-Workshop/5.3-Infrastructure/5.3.10-Cognito/" >}}) and each service page's full-project configuration section. Keep separate lab and manual inventories.

## Read-only AWS evidence, 28 November 2026

[Download sanitized reference lab configuration](/downloads/flashrush-extended/verified-lab-config-20261128.json). This includes public pool/client identifiers, route authorization types and CORS. It excludes users/passwords/tokens/secrets. The existing lab uses us-east-1_mIpzTH61t with public client 5h7dn6hr6iub9ghat5jiir4ipg, email sign-in/verification/recovery, 12-character mixed password policy, 10-minute access tokens and owner/manager/warehouse/support groups. Protected /me and /admin routes use JWT with required access-token scope; public guest/catalog routes remain public.

## Configuration to reproduce

1. Cognito email sign-in/verification/password policy and public client; password and refresh auth flows; correct attributes and revocation.
2. Customers table (userId, recordId) and Business table (id), on-demand/encryption.
3. Scoped runtime policies: [API](/downloads/flashrush-extended/api-role-policy.json), [Worker](/downloads/flashrush-extended/worker-role-policy.json). Replace placeholders, do not paste manual policies into stack-managed lab roles.
4. Five Lambda modules with same-target pool/client/issuer, five table names and queue URL; API monitoring environment.
5. JWT authorizer, scopes, full route matrix and exact-origin CORS; public auth routes remain explicit.
6. Matching frontend API/Cognito settings, full SPA rewrites, upload/invalidation and separate public/authenticated validation.

## Screenshot acceptance

Required: saved pool overview, sign-in/password policy, public app client and auth flows, groups, Gateway JWT, redacted Lambda env and Customers/Business key schemas. Also capture shared /auth and role-correct destination. No authenticated Console screenshots were available at this checkpoint; the CLI session cannot substitute for a browser session. Images remain PENDING, not PASS. Existing-resource screenshots must not be described as creation wizard execution. Never fabricate evidence.

## Cost and diagram acceptance

Save a real Pricing Calculator estimate URL/ID using workload, lifetime, requests/durations/storage/transfer/logs/alarms and Cognito MAU/tier assumptions. The Proposal's USD 1.30/1.95/5 is planning allocation, not a verified quote. Include the two additional tables and authentication usage.

Architecture needs editable source, student author/date, official AWS icon provenance and mapping to Cognito/JWT/Customers/Business. The old team figure is reference material until reviewed. Do not invent author or approval details.

## Demo and cleanup

Reference extended website: https://d1jcrzj4650vey.cloudfront.net . Each manual team must record and verify its own domain, not reuse lab evidence. Check /auth, /account/orders, /admin and /cart/checkout deep links, then authorized role flows. New registrations/invites/purchases require an approved test scope. Deletion of Cognito/users/data is destructive: preserve data and verify ownership/dependencies first.
