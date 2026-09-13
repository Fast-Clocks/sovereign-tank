# Sovereign Tank — Cloudflare finishing candidate

This folder is the isolated, deployable Sovereign Tank showpiece recovered from the preserved estate and hardened for a Cloudflare Workers static-assets release. It intentionally does **not** build or publish the legacy ADR Next.js application that remains elsewhere in this repository as preserved rollback/donor material.

Recovered showpiece donor SHA-256: `2b4bde967fb3c6f65a1aac88cac313b643f360d26c2d2b041e764f1c570e498d`.

## Customer-facing scope

- Local SHA-256 document fingerprint demo using browser Web Crypto.
- In-browser **demo** ledger and **demo** receipt only; no production evidence write.
- No analytics, auth, cookies, database, AI API or customer-data backend.
- Base ownership verification tag `base:app_id=6aa5ac4f934ceaddfd7ac2a6` is present exactly once.
- Revenue path is the existing A$495 hosted Stripe checkout for the human-led Sovereign Engine Evidence Workflow Review. Payment does not automatically create a software entitlement or evidence record.

## Cloudflare target

- Account: A2 `f7c8702f5256dcb45ef114533e872e2e`
- Worker: `sovereign-tank`
- Initial release: `workers.dev` / preview only.
- `wrangler.jsonc` deliberately contains **no custom domain route**. Domain attachment is a separate gate after exact provider before-state and rollback are captured.

## Verify locally

```bash
node cloudflare-site/verify.mjs
node --check cloudflare-site/site/app.js
node --check cloudflare-site/src/index.js
npm test
```

## Exact provider preflight before first deploy

From an authenticated Cloudflare/Codex session:

1. Confirm account ID is exactly `f7c8702f5256dcb45ef114533e872e2e`.
2. Read Worker `sovereign-tank` before-state. If it already exists unexpectedly, **stop** and preserve its script/version/routes/bindings before doing anything.
3. Confirm no custom domain or route for `sovereigntank.com` is being changed by the preview deploy.
4. Deploy only this candidate:

```bash
npx wrangler@4.131.1 deploy --config cloudflare-site/wrangler.jsonc
```

5. Record Worker deployment/version and test the `workers.dev` URL on desktop/mobile, Base meta tag, document hashing, demo receipt, Stripe handoff, security headers and negative network checks.
6. Only after the preview passes, prepare the separate `sovereigntank.com` + `www` attachment/cutover with authoritative DNS before-state and rollback. Do not guess nameservers or overwrite mail/service records.

## Rollback

If this is a newly created Worker and preview verification fails, remove **only** the newly created `sovereign-tank` Worker after preserving the failed deployment receipt and verify that the prior absent state is restored. If provider preflight finds a pre-existing Worker, rollback must instead restore that exact prior version/configuration; do not delete it.
