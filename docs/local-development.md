# Local development and static preview

Use Node 24 (recorded in .node-version). Run npm ci, then npm run dev for the root-path Next development server. In PowerShell use npm.cmd if npm.ps1 is blocked.

For the production-style static preview:

1. npm run build
2. npm run check:export
3. npm run preview (or npm start)
4. Visit http://127.0.0.1:4173/

next start is not used for an export. All routes and public assets use the domain root; no base-path environment variable is required. The preview server returns a real static 404 for unknown paths.

Checks: npm run typecheck, npm run lint, npm run check:foundation, npm run check:content and node scripts/check-stage-03-assets.mjs. With the export server running, npm run test:e2e uses installed Chrome. CI sets POLARIS_TEST_BROWSER=chromium after installing Playwright Chromium. POLARIS_TEST_URL can point to another local preview origin. Reports, traces and screenshots remain ignored.

The full suite covers five viewports, all five routes, selected WCAG axe checks, keyboard/mobile navigation, quality disclosures, twelve activities, form validation/disabled submission, original PDF download, favicon files, local fonts and decorative CSS assets. This preparation uses representative desktop/mobile coverage because no page layout changed.

Feedback remains React-memory-only. No API, persistence, delivery service or successful submission is enabled. See feedback-backend-contract.md before enabling collection. Copy, photo rights, privacy and operational approval remain launch inputs. See cloudflare-pages.md for hosting preparation; do not infer a deployed site from a successful local export.
