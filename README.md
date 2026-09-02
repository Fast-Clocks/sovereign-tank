# Sovereign Tank

**Role:** Showcase, demo and modular wrapper for the Sovereign product family.
Sovereign Tank is a demonstration surface — not a company, not a platform, not a product.

## Lineage

- **Origin:** Generated via v0.dev, then customised across multiple sessions.
- **Original name in package.json:** `my-project` (v0.dev default — never renamed).
- **GitHub repo:** `Fast-Clocks/sovereign-tank`
- **Relationship:** Shares visual DNA with `v0-sovereignty-lab-ui` (Sovereignty Lab). Both descend from the same v0.dev generation but diverged. sovereign-tank was forked into its own repo as the showcase/demo surface. v0-sovereignty-lab-ui remained the deployed lab UI.
- **Vercel:** No Vercel project currently mapped. Previously associated with sovereignty domains but DNS was never correctly wired.
- **Framework:** Next.js (App Router)
- **UI:** shadcn/ui + Tailwind CSS

## What it contains

- ADR Command dashboard (demo surface)
- Sovereignty Lab view (interactive demo)
- Simulated API endpoints (OSINT, breach lookup, threat map, analytics)
- Privacy policy and terms pages
- Security operations dashboard (demo)

## Architecture position

Per the governing build order:
- **Sovereign Suite** — commercial proof, verification and assurance product layer.
- **Australian Privacy Network (APN)** — public trust, resource and education layer.
- **Sovereign Verify** — first public-facing proof/verification product.
- **Sovereign Engine** — deeper infrastructure and custom deployment only.
- **Sovereign Tank** — showcase / demo / modular wrapper (this repo).

## Compliance status

- **Word-risk:** Scanned against BUILD_STANDARD_data-privacy-compliance.md. One prohibited claim fixed (`Guaranteed protections` → `Consumer protections awareness`).
- **External calls:** Google Fonts CDN removed from CSP middleware. jsdelivr CDN reference remains for world-atlas topological data (geo-map component) — acceptable for demo surface, would need local bundling for production.
- **Analytics:** None.
- **Demo data:** API endpoints return simulated/mock data. No production receipts. No live backend writes.

## Entity

Australian Privacy Network (APN) — operated by Australian Data Removal Pty Ltd · ACN 695 272 836

## Build

```bash
npm install
npm run build
```

## Status

| Check | Result |
|-------|--------|
| Branches | `main` plus active hardening review branch `claude/security-and-quality-gate` |
| Protection | Enabled — no force push, no branch deletion |
| Compliance scan | Clean (post-fix) |
| External fonts | Removed from CSP |
| README lineage | Complete |