# Polaris official website - first draft

Five static preview pages: Home, Our Thinking, Home Leadership Kit, Help Shape Polaris and About Polaris.

This is an early-stage preview. Website copy remains subject to founder review, and some photographs are provisional with production rights/selection still to be approved. Feedback submission is disabled: answers remain in browser memory and are never sent. Privacy, retention, data-handling and separate follow-up consent arrangements need approval before collection is enabled. The downloadable Home Leadership Kit is the original founder-supplied six-page resource, unchanged.

## Local development

Use Node.js 24 or later (Next.js minimum 20.9). Install locked packages with npm ci, then npm run dev. In PowerShell use npm.cmd if npm.ps1 is blocked.

## Static Cloudflare Pages preview

1. npm run build
2. npm run check:export
3. npm run preview
4. Open http://127.0.0.1:4173/

npm run build exports the five pages to out at the domain root, with trailing slashes and static images. npm run dev retains local Next development; npm start or npm run preview serves the export. No server/API deployment, Cloudflare Functions, adapter or new dependency is required.

## Validation

Run npm run lint, npm run check:foundation, npm run check:content, node scripts/check-stage-03-assets.mjs, npm run build, npm run typecheck and npm run check:export. With the static preview running, run npm run test:e2e. Local tests use installed Chrome; CI installs Chromium and sets POLARIS_TEST_BROWSER=chromium.

## Review and release ownership

See [Cloudflare preparation](docs/cloudflare-pages.md) for owner setup and review steps. Production branch: main; build: npm run build; output: out; Node: 24. The GitHub workflow validates PRs and main only; it never deploys. PR #1 was already merged before this preparation. No deployment or repository settings change is performed by this task.

See [content review](docs/content-review.md), [photography](docs/stage-03-photography.md), [brand provenance](docs/brand-provenance.md) and [feedback backend contract](docs/feedback-backend-contract.md). Historical stage reports describe their own completion point; this README and Cloudflare preparation guide describe the current preview configuration.
