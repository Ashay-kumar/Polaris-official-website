# Kyro Learning website

Five static preview pages: Home, Our Thinking, Home Leadership Kit, Help Shape Polaris and About Polaris.

Some photographs remain provisional. Both forms use the existing server-side Sheets integration, confirmed-write receipts, safe retries and separate consent choices. The default static build keeps submissions disabled until approved notice identifiers and production configuration are supplied. Retention follows approved Policies v2.0: purpose-based manual review/deletion, with no automatic schedule. Stage 05B prepares anonymous Turnstile-verified submissions and private, single-use kit delivery. Unchanged PDFs now live under ignored `private/kit/`, outside static output; restore them securely for local integrity checks. See [Stage 05B report](docs/implementation/kyro-update-01-stage-05b-public-api-private-kit.md) for activation dependencies. No infrastructure has been deployed by these local stages.

## Local development

Stage 05C pins all four approved consent identifiers and requires separate privacy acknowledgement and adult confirmation in both forms. See the [consent/privacy report](docs/implementation/kyro-update-01-stage-05c-consent-privacy.md). The internal operations runbook is maintained locally under ignored `docs/operations/`, outside this public source repository. Production submissions remain disabled; operational responsibilities are documented, not claimed running.

Use Node.js 24 or later (Next.js minimum 20.9). Install locked packages with npm ci, then npm run dev. In PowerShell use npm.cmd if npm.ps1 is blocked.

## Static Cloudflare Pages preview

1. npm run build
2. npm run check:export
3. npm run preview
4. Open http://127.0.0.1:4173/

npm run build exports the five pages to out at the domain root, with trailing slashes and static images. npm run dev retains local Next development; npm start or npm run preview serves the export. No server/API deployment, Cloudflare Functions, adapter or new dependency is required.

## Validation

Standard CI runs `check:foundation`, `check:public-content`, derived-asset checks and `check:export` without private PDFs. It retains approved public content/asset hashes, private-source provenance and checks that PDFs are neither tracked nor exported. `npm run check:private-kit` is a separate fail-closed local check for authorized `private/kit/` fixtures: all PDF hashes/sizes/page counts and the full founder-content comparison. Never upload those fixtures or private-check artifacts to GitHub/Pages. Existing `check:content` also remains private-source dependent.

The current private-review release pins `NEXT_PUBLIC_FORM_SUBMISSIONS_ENABLED=false` in Next configuration as well as CI. Enabling collection requires a separately approved source change and production setup; deployment environment overrides cannot activate this review build.

Run npm run lint, npm run check:foundation, npm run check:content, node scripts/check-stage-03-assets.mjs, npm run build, npm run typecheck and npm run check:export. With the static preview running, run npm run test:e2e. Local tests use installed Chrome; CI installs Chromium and sets POLARIS_TEST_BROWSER=chromium.

## Review and release ownership

See [Cloudflare preparation](docs/cloudflare-pages.md) for owner setup and review steps. Production branch: main; build: npm run build; output: out; Node: 24. The GitHub workflow validates PRs and main only; it never deploys. PR #1 was already merged before this preparation. No deployment or repository settings change is performed by this task.

See [content review](docs/content-review.md), [photography](docs/stage-03-photography.md), [brand provenance](docs/brand-provenance.md) and [feedback backend contract](docs/feedback-backend-contract.md). Historical stage reports describe their own completion point; this README and Cloudflare preparation guide describe the current preview configuration.

Current frontend refinement: [Stage 06.1 review](docs/stage-06.1-refinement.md) and [forms backend handoff](docs/forms-backend-handoff.md). Kit phone is required; feedback phone is optional. Both use the shared maintained-metadata country selector. Final request/submission remains unavailable.
