# Update 01 Stage 03 — forms and favicon

Date: 14 November 2026. Local implementation only; no commit, push, deployment or Access configuration change.

## Repository and preservation

Website branch `feature/kyro-update-01`, HEAD `cf536925fb8787dbd104449556163e332b385b1f`. Stage 02 logo improvements and Stage 01/02 audit reports remain uncommitted and preserved. A 487-file pre-Stage-03 hash inventory found no missing files; before this report/README update, only the three intended feedback implementation files changed. Approved logo artwork, PDFs, previews and favicon bytes were preserved.

The existing backend is `C:/Users/Mridula Dass/Documents/Polaris-backend`. It had local-test handlers, not a production-ready service. The founder explicitly authorized adapting that baseline. No replacement Sheet or credentials were created. Backend source/package backups (no credentials) and hashes are under ignored `tmp/kyro-update-01/stage-03/`. The backend is outside the website Git repository and needs a separate controlled source handover before deployment.

## Files changed

Website modified: `src/components/feedback/feedback-form.tsx`, `kit-access.tsx`, `kit-access.module.css`, and `README.md`.

Website added: `src/lib/form-submission.ts`, `src/components/feedback/submission-verification.tsx`, `.env.example`, `tests/e2e/form-submission.spec.ts`, `tests/e2e/favicon-routes.spec.ts`, and this report. Updated `tests/e2e/design-closure.spec.ts` to scope the review-status locator and assert draft preservation on modal reopening. Website dependencies unchanged.

Backend modified: `functions/api/feedback.js`, `functions/api/kit-request.js`, `package.json`, `package-lock.json`, `.gitignore`. Added: `src/submissions.js`, `src/coordinator.js`, `src/worker.js`, `wrangler.jsonc`, `test/submissions.test.mjs`, `test/security.test.mjs`, `README.md`. Only new runtime dependency: exact `libphonenumber-js` 1.13.16. Existing Google OAuth signer and credentials retained.

## Form behavior

Both flows preserve validation, review and independent consent choices. A UUID identifies an attempt and remains stable across retries, including kit dialog closure/reopening. Changed answers after an uncertain attempt require an explicit new submission; deliberate repeat submissions receive a new UUID. Drafts live in memory only, never persistent browser storage, URLs, analytics or logs. Reloading loses the in-memory attempt identifier; do not reload an uncertain submission when retrying.

Busy state prevents concurrent clicks. Errors preserve input and offer retry. A success state requires an accepted receipt matching the request UUID, a valid persistence timestamp and one confirmed stored row. Kit success exposes the existing approved eight-page PDF download only after that receipt. The PDF is still publicly reachable by URL and is not access-controlled by this UI. No email delivery, automated follow-up or marketing campaign is implemented.

The backend uses the existing `Website Feedback` A:M (13 columns) and `Kit Requests` A:K (11 columns), verified against actual headers. Feedback permission and kit marketing choice remain separate booleans. Notice versions, choice timestamp and indefinite-retention metadata use existing notes columns. No headers were changed. The previous feedback handler's unheaded country column is no longer written; phone is canonical E.164. Kit retains its existing Country column.

A Durable Object serializes allocation and reserves fixed rows. Retries use the same row; accepted repeats return the original receipt; changed payload with the same UUID is rejected. State stores identifiers, hashes, row and timestamps, not the full personal payload. RAW writes avoid formula evaluation. Required operational condition: this coordinator must be the sole writer to these managed tabs; protect them against physical row sorting/insertion/deletion and use filter views. Grid capacity and coordinated manual deletion need operator procedures. Never reset allocation counters over existing records.

## Security and activation gates

Default production flags are false and all notice versions remain blank. No approved identifiers have been assigned. TEST_ONLY versions were supplied explicitly to local tests and are absent from the final default export; they are not production defaults.

Server requires existing Google credentials, exact allowed origin, explicit activation and exclusive-writer confirmation, all four real notice versions, Turnstile secret/hostname and the existing Cloudflare Access team/audience. It checks signed Access assertions, Turnstile action/hostname, strict request fields, full phone metadata, UUID, version agreement, 32 KiB body limit, content type and a global 30-per-minute cap for unaccepted attempts. Credentials and service tokens stay server-side.

The retained local secret works only when explicit local-test mode and a loopback hostname both apply. It is never sent by browser code and cannot authorize public production requests. No raw payloads or secrets are logged.

Public build configuration is documented in `.env.example`: explicit enable flag, API base (prefer empty for same-origin), Turnstile public site key and matching privacy/feedback/kit/marketing version identifiers. Supplying these alone does not provision the backend.

Keep existing Access protection intact for website and API. Prefer same-origin `/api/feedback` and `/api/kit-request`, with credentials preserved and the same protected application. Cross-origin Access redirects, preflight and cookies may block API requests; do not weaken Access or use wildcard CORS as a workaround. Unauthorized/redirected responses cannot show success. Live Access policy and deployed API were not verified or changed.

## Privacy and retention

Founder-approved wording is retained. Both forms now explicitly say records are retained indefinitely until manually deleted. Before this stage, the form presentation lacked that explicit duration; no conflicting active duration was found in the forms. Historical planning documents are not a live retention policy. There is no automatic deletion job.

Actual privacy-notice, feedback-permission, kit-follow-up-notice and optional-marketing identifiers remain required and unconfigured, as instructed. Before activation, supply approved final text/version pairs and confirm channel-specific follow-up requirements, access permissions and deletion procedures. No contact is scheduled merely because a record is stored. Manual deletion must also invalidate the corresponding durable receipt so a retry cannot resurrect the record; retain monotonic row allocation.

## Local verification evidence

- Backend: 10 synthetic unit/security tests passed. Includes strict validation, consent/tab mapping, default-denied configuration, origin/body limits, signed Access JWT verification, retry/concurrency, changed-payload conflicts and recovery after a lost Google acknowledgement.
- Wrangler dry-run bundle passed without deployment. Production settings remain disabled/blank; no new routes or domains configured.
- Real loopback Worker test used the existing service account and private Sheet. Four synthetic records were independently read back in the correct existing tabs. Confirmed stable retry receipt, intentional repeat with a new ID, changed-data conflict, invalid-phone rejection and marketing true/false.
- Cleanup: all four matching synthetic rows were cleared and absence rechecked. No headers or other records changed. Local receipt metadata retains synthetic IDs/hashes/timestamps only. Google revision history may retain cleared synthetic test values.
- Enabled test-build browser tests passed (2 form cases plus favicon route case). Browser transport/Turnstile were explicitly mocked in Playwright only to reproduce failure after storage, retry, consent, intentional repeat, modal close/reopen, download and success states. This is distinct from the real Sheet test above; it is not a deployed end-to-end claim. Focused axe scans passed in tested form states.
- TypeScript, zero-warning ESLint, foundation checks, content checks, normal production static build and export integrity passed. Existing foundation/content assertions describe the preserved six-page archive; the active eight-page Kyro download was separately verified by SHA-256 `69dda4c82161de29300c8212d82aef9f078be8ca084e475ef730fd6c1ed955da`.
- Default-export regression: initial 33-case run had 29 passes, 2 expected enabled-flow skips, one obsolete modal assertion and one report-artifact collision caused by overlapping test runs. The corrected design-closure file then passed all 3 cases, including five-width dialog/focus/axe checks. The PDF case was rerun separately. All five page-reflow viewports (1440/1024/768/390/320), header/logo breakpoint checks, navigation, disclosures, twelve activities, optional phone, disabled submission and reduced motion passed. Synthetic enabled-flow tests intentionally skip against the default disabled build. These are local results, not deployed verification.

Visual evidence: ignored `qa-artifacts/kyro-update-01/stage-03/stage03-{feedback-error,feedback-success,kit-error,kit-success}.png`. Reviewed error recovery and successful kit state; no redesign or logo-size changes made. Automated scans do not replace manual assistive-technology testing.

The isolated PDF/internal-links rerun passed (1/1). Together with the corrected design-closure rerun, every applicable default-export case passed across the runs; the two enabled-flow cases passed separately on the explicit synthetic test build. Final lint and Git whitespace checks also passed. No deployed persistence, Access-session or production Turnstile claim is made.

## Favicon

The approved unchanged Kyro symbol is already configured through Next App Router `src/app/icon.svg`, `favicon.ico`, `apple-icon.png` and root metadata. The symbol intentionally retains its versioned `public/brand/logos/v1.1/svg/polaris-icon-primary.svg` filename: it is the approved unchanged identity symbol, not placeholder branding. No redraw or duplicate replacement was needed. Five-route icon-link/HTTP/byte-integrity checks verify actual generated references, including automatic cache-query references. Existing tests verify ICO sizes, Apple dimensions and light/dark presentation. No conflicting Next/Vercel placeholder was found.

## Required deployment handoff

1. Supply final approved notice-version identifiers and matching public/server configuration; keep submissions disabled until complete.
2. Review/version the adapted backend separately; confirm exclusive Sheet writes, reserved metadata columns, capacity and deletion/runbook ownership.
3. Bind/migrate the Durable Object and configure the existing server-side secrets through the authorized operator. `workers_dev` stays false. Do not deploy both Worker and independent Pages write paths concurrently.
4. Configure the protected same-origin API routing, Access audience/team and Turnstile; preserve current website Access protection.
5. Build with approved public configuration, then deploy only in a separately authorized stage. Perform protected deployed synthetic persistence/failure/download tests and clear only those test rows. None of this deployment work was performed here.

Commands: website `npm.cmd run typecheck`, `lint`, `check:foundation`, `check:content`, `build`, `check:export`, `test:e2e`; backend `npm.cmd test` and `npm.cmd run check:build` (dry-run only). Enabled browser cases require an explicitly configured synthetic-version build and `KYRO_TEST_FORMS_ENABLED=true`; never use test versions for production.
