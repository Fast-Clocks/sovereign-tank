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

- Existing Workers Builds account: `ce77d11eb9c9640fe37ed06ecfe260aa`.
- Worker: `sovereign-tank`.
- Production domain in current estate preflight: `sovereigntank.au` plus `www`.
- Initial release remains `workers.dev` / preview until the deployment is proved healthy.
- `wrangler.jsonc` deliberately contains **no custom domain route**. Domain attachment is a separate gate after exact provider before-state and rollback are captured.

## Verify locally

```bash
node cloudflare-site/verify.mjs
node --check cloudflare-site/site/app.js
node --check cloudflare-site/src/index.js
npm test
```

## Exact provider preflight before deploy

1. Confirm the connected Workers Builds account is exactly `ce77d11eb9c9640fe37ed06ecfe260aa` and the existing Worker is exactly `sovereign-tank`.
2. Preserve the current Worker deployment/version/routes/bindings before promotion.
3. Confirm no custom domain or route for `sovereigntank.au` or `www.sovereigntank.au` is changed by the preview deploy.
4. Deploy only this candidate:

```bash
npx wrangler@4.131.1 deploy --config cloudflare-site/wrangler.jsonc
```

5. Record Worker deployment/version and test the `workers.dev` URL on desktop/mobile, Base meta tag, document hashing, demo receipt, Stripe handoff, security headers and negative network checks.
6. Only after the preview passes, prepare the separate `sovereigntank.au` + `www` attachment/cutover with authoritative DNS before-state and rollback. Do not guess nameservers or overwrite mail/service records.

## Rollback

If preview verification fails, preserve the failed deployment receipt and restore the exact prior Worker version/configuration. Do not delete the existing `sovereign-tank` Worker.
