# Polaris official website - first draft

Five static preview pages: Home, Our Thinking, Home Leadership Kit, Help Shape Polaris and About Polaris.

This is an early-stage preview. Website copy remains subject to founder review, and some photographs are provisional with production rights/selection still to be approved. Feedback submission is disabled: answers remain in browser memory and are never sent. Privacy, retention, data-handling and separate follow-up consent arrangements need approval before collection is enabled. The downloadable Home Leadership Kit is the original founder-supplied six-page resource, unchanged.

## Local development

Use Node.js 24 or later (Next.js minimum 20.9). Install locked packages with npm ci, then npm run dev. In PowerShell use npm.cmd if npm.ps1 is blocked.

## Static GitHub Pages preview

1. npm run build:pages
2. npm run check:export
3. npm run preview:pages
4. Open http://127.0.0.1:4173/Polaris-official-website/

The normal npm run dev / npm run build commands retain root-path behaviour. The Pages build sets output: export, trailing slashes, unoptimised static images and the repository base path. There is no server/API deployment.

## Validation

Run npm run lint, npm run check:foundation, npm run check:content, node scripts/check-stage-03-assets.mjs, npm run build:pages, npm run typecheck and npm run check:export. With the static preview running, set POLARIS_TEST_BASE_PATH=/Polaris-official-website and run npm run test:e2e. Local tests use installed Chrome; CI installs Chromium and sets POLARIS_TEST_BROWSER=chromium.

## Review and release ownership

See [Stage 04 handover](docs/stage-04-handover.md) for Ashay's review/Pages steps. Changes require PR review and merge into main. Feature branches and PRs cannot deploy through the workflow. No deployment has been initiated locally.

See [content review](docs/content-review.md), [photography](docs/stage-03-photography.md), [brand provenance](docs/brand-provenance.md) and [feedback backend contract](docs/feedback-backend-contract.md). Historical stage reports describe their own completion point; this README and the Stage 04 handover describe the current preview configuration.
