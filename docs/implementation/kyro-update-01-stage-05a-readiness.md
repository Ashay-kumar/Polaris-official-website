# Update 01 Stage 05A — form compliance and production readiness

15 November 2026. Local only, `feature/kyro-update-01`. Stage 02–04 work preserved; no infrastructure changes, credentials created, dependencies added, commit, push or deployment. Production submissions remain disabled.

## Implemented

- Both forms display the approved Privacy Policy section 4 adult/guardian explanation. Required, initially unchecked “I confirm that I am 18 or older.” is an eligibility attestation, separate from optional contact/marketing permission. Feedback collects it in the contact step and also shows the explanation at the start. Kit collects it before review. Review states show the confirmation; navigating retains it; deliberately starting another request clears it.
- Client validation blocks unconfirmed adults; kit review is invalidated when the value changes. Both payloads include `adultConfirmed`. Server `validate` requires strictly boolean `true` for either endpoint, before the coordinator/storage is called. Missing, false, strings and numbers are rejected. Adult confirmation is recorded in existing notes metadata with privacy version and choice timestamp; no Sheet columns/resources added.
- Replaced the old indefinite-retention statement with the exact first paragraph of approved Privacy Policy section 6: manually managed storage, no automatic deletion schedule, and no commitment to indefinite retention or refusal of deletion. Updated backend metadata to `manual-review-purpose-based-deletion` and its README. This does not implement an automatic purge; manual purpose-based review/deletion remains an operator responsibility.
- Approved privacy identifier `KYRO-PRIVACY-2026-01` is drawn from the existing policy content, supplied in `.env.example` and local backend config. Client availability and server configuration reject a different privacy version. Neither activation flag was enabled.
- Follow-up checkbox and optional marketing checkbox text/behavior remain unchanged and unchecked by default. Separate version IDs remain blank: no identifiers were invented, and a policy ID is not substituted for checkbox wording.

Website files: `src/content/form-compliance.ts`; `src/components/feedback/adult-confirmation.tsx`; existing `feedback-form.tsx`, `kit-access.tsx`, `src/lib/form-submission.ts`, `.env.example`; `tests/e2e/form-compliance.spec.ts`. Existing form fixtures in `form-submission.spec.ts`, `design-closure.spec.ts`, `website.spec.ts` now explicitly distinguish adult confirmation from optional consent and supply adult confirmation when testing other behavior; those historical suites were not rerun.

Existing backend folder: `C:/Users/Mridula Dass/Documents/Polaris-backend`. Changed `src/submissions.js`, `src/coordinator.js`, `wrangler.jsonc` (local config only), `README.md`, `test/submissions.test.mjs`; added `test/adult-confirmation.test.mjs`. No secret files changed. Local before-file backups are ignored under `tmp/kyro-update-01/stage-05a/`.

## Verification

- TypeScript, zero-warning ESLint, production static build and existing export integrity passed. All eight content routes remain statically exported; no frontend server runtime introduced.
- Focused Playwright `form-compliance.spec.ts`: **2/2 passed**, covering both required confirmations, inline/error summary behavior, unchecking, review/navigation preservation, optional consent remaining unselected, approved retention notice, and kit submission remaining disabled.
- Backend `node --test test/adult-confirmation.test.mjs test/submissions.test.mjs`: **10/10 passed**. Includes strict adult validation and endpoint rejection before storage, independent consents, notice mismatch, unchanged retry/duplicate/conflict behavior and retention metadata.
- No real records submitted, no Google API calls in these synthetic tests, and no Sheet cleanup required in this stage. No Stage 02/04 browser suites or live production tests repeated. An initial browser locator also matched the hidden kit dialog; corrected to the visible checkbox role before the passing run.

## Verified existing architecture

Static Next website posts to `/api/feedback` or `/api/kit-request`. The existing backend entry points delegate to `src/submissions.js`; `src/worker.js` is the Worker adapter. `SubmissionCoordinator` Durable Object serializes writes, reserves fixed rows and persists retry receipts. Existing Google OAuth code signs a service-account RS256 JWT for `https://oauth2.googleapis.com/token`, scope `https://www.googleapis.com/auth/spreadsheets`, then uses Sheets `values.update` with RAW values. Secrets remain server-side.

Reuse the existing private spreadsheet and service account from local tests (Stage 03 verified real persistence and cleaned its four synthetic rows). This stage did not revalidate live permissions or credentials. The spreadsheet ID and private key are intentionally not reproduced here. Expected tabs are **`Website Feedback`** A:M, not `Feedback`, and **`Kit Requests`** A:K. Preserve these exact existing names/headers.

Feedback columns: Submission ID; Date & Time; Visitor Category; Challenges / Experiences; Resources Needed; Suggestions; Full Name; Email; Phone Number; Contact Consent; Consent Version; Follow-up Status; Internal Notes.

Kit columns: Submission ID; Date & Time; Full Name; Email; Phone Number; Country; Marketing Consent; Kit Follow-up Notice Version; Follow-up Status; Feedback Notes; Kit Delivery Status.

Existing notes fields store version/attestation/timestamp/retention metadata. Preserve them for machine metadata. Google Sheet access must be restricted; only this coordinator may write managed rows. Do not physically sort, insert or delete managed rows; use filter views. Capacity and manual deletion need a runbook. Deletion must clear the row and invalidate its durable receipt without resetting allocation counters. No deletion administration endpoint is implemented.

## Exact production configuration checklist — manual, not performed

### Backend secrets (Cloudflare secret manager, never frontend/build logs)

| Name | Required source/action |
| --- | --- |
| `GOOGLE_SPREADSHEET_ID` | Reuse existing private Sheet identifier; verify it targets the tabs above. Store server-side. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Reuse existing account; verify restricted editor access to that Sheet and existing Sheets API enablement. |
| `GOOGLE_PRIVATE_KEY` | Reuse existing PEM credential securely; signer handles escaped newlines. Check validity/revocation without printing the key. |
| `TURNSTILE_SECRET_KEY` | Supply the matching authorized Turnstile widget secret; readiness not verified. |

Do not upload local `.dev.vars` or put credentials in `NEXT_PUBLIC_*`. `LOCAL_TEST_TOKEN` is only for explicit loopback tests; do not use it for production/browser authentication.

### Backend variables/binding

| Name | Production requirement/current status |
| --- | --- |
| `FORM_SUBMISSIONS_ENABLED` | Remains `false`. Set `true` only after all approvals/configuration and authorized activation. |
| `LOCAL_TEST_MODE` | `false` in production. No public test bypass. |
| `SHEET_WRITES_EXCLUSIVE` | Remains `false`; set `true` only after owner verifies exclusive managed-row writes/protection. |
| `ALLOWED_ORIGINS` | Exact scheme+host origins, comma-separated if required, no wildcard/path/trailing slash. Confirm actual canonical deployment origin; no value guessed. |
| `ACCESS_TEAM_DOMAIN` | Existing Access team hostname, e.g. the actual `<team>.cloudflareaccess.com`, without scheme; unconfigured. |
| `ACCESS_AUD` | Audience of the existing Access application protecting these API routes; unconfigured. |
| `TURNSTILE_HOSTNAME` | Exact permitted deployed hostname returned by verification, without scheme/path; unconfigured. If multiple hosts are needed, current single-host validation needs an explicitly reviewed change. |
| `PRIVACY_NOTICE_VERSION` | `KYRO-PRIVACY-2026-01` (pinned locally). |
| `FEEDBACK_CONSENT_VERSION` | Required, unassigned. Must identify actual visible optional feedback permission. |
| `KIT_FOLLOWUP_NOTICE_VERSION` | Required, unassigned. Must identify actual visible kit-feedback notice. |
| `MARKETING_CONSENT_VERSION` | Required, unassigned. Must identify actual visible optional marketing permission. |
| `SUBMISSIONS` | Durable Object namespace binding for `SubmissionCoordinator`; one shared namespace/coordinator for managed tabs, not independent writers. Provisioning not verified/performed. |

Current local `wrangler.jsonc`: Worker name `polaris-backend`, main `src/worker.js`, compatibility date `2026-11-01`, `workers_dev:false`; migration tag `submission-ids-v1`, SQLite class `SubmissionCoordinator`. Verify existing deployment/migration state before applying anything; do not blindly rerun or create replacement resources.

### Routing and hosting

Prefer the existing protected website origin with `/api/feedback` and `/api/kit-request` routed to the Worker, and all other paths to the static Pages website. Exact zone/account/route ownership remains unverified. The standalone backend's `functions/` folder is not automatically deployed by the website's `out/` export. If choosing Pages Functions instead, intentionally integrate them and bind the same separately deployed Durable Object namespace; the static website build alone cannot supply it. Choose one active write path.

Preserve Access protection. Backend verifies signed `Cf-Access-Jwt-Assertion` issuer/audience/expiry; same-origin browser requests preserve Access session cookies. Verify the policy covers API routes and forwards assertions. Cross-origin Access redirects/preflight/cookies can prevent requests; never bypass with wildcard CORS, frontend service tokens or `no-cors`. Worker allows POST and exact-origin OPTIONS. Security includes 32 KiB streamed body limit, strict fields, server phone validation, Turnstile action `feedback`/`kit` and hostname verification, no-store responses and global 30 unaccepted attempts/minute. No new abuse configuration introduced here.

### Public frontend build variables (not secrets)

`NEXT_PUBLIC_FORM_SUBMISSIONS_ENABLED=false` until activation; `NEXT_PUBLIC_FORMS_API_BASE_URL` empty for preferred same-origin routing; `NEXT_PUBLIC_TURNSTILE_SITE_KEY` matching the approved widget; `NEXT_PUBLIC_PRIVACY_NOTICE_VERSION=KYRO-PRIVACY-2026-01`; `NEXT_PUBLIC_FEEDBACK_CONSENT_VERSION`, `NEXT_PUBLIC_KIT_FOLLOWUP_NOTICE_VERSION`, `NEXT_PUBLIC_MARKETING_CONSENT_VERSION` must match server values exactly. The last three remain blank. Static exports bake these public values at build time; changing them requires a rebuild. No activated test build remains as the final export.

## Remaining approvals and discrepancies

1. Assign approved version IDs to the three existing wording blocks. Feedback: “I agree to be contacted by Kyro Learning about the feedback I've shared.” Marketing: “I'd like to receive updates about new kits, resources and offers from Kyro Learning.” Kit notice: the existing “We'd love to hear how it goes!” disclosure and follow-up paragraph. Preserve independent choices; do not infer marketing permission from requesting the kit. Adult confirmation is recorded under the approved Privacy version, not an invented consent version.
2. Privacy section 2 mentions a necessary privacy acknowledgement; no separately approved acknowledgement checkbox text/version has been supplied. Current forms link the policy and require adult attestation but do not invent privacy-consent wording. Owner must resolve that discrepancy before activation. The approved policies were not edited.
3. The kit notice says “We'll reach out in a few days”; no automated follow-up is implemented or authorized. Confirm a permitted manual channel/process and any required channel-specific permission before collection. Do not interpret this informational notice as blanket permission.
4. Assign manual retention review/deletion owner and request-handling process consistent with approved section 6. This supersedes the old indefinite-retention promise locally; historical Stage 03 reports describe the prior stage, not the current policy.
5. Confirm actual policy effective date, public contact and deployed cookie inventory; verify account/zone/routes, Access audience, widget settings, current secrets and namespace state with authorized operators. No live configuration discovery or infrastructure mutation was performed.

## Recommended authorized activation sequence

1. Resolve wording/version/acknowledgement/follow-up questions and manual privacy operations; keep flags false.
2. Review/version both website and separate backend source through the authorized Git workflow. No commit is authorized in this stage.
3. Authorized operator verifies/reuses credentials, spreadsheet access, exclusive writer and capacity, then binds the coordinator and protected API routes with server settings. Keep real collection disabled until configuration is complete.
4. Configure matching public build values, real Turnstile widget and server versions; rebuild static export. Perform protected preview tests with synthetic records only, verifying both tabs, optional choices, rejected underage/unconfirmed input, retries and downloads; clear matching synthetic rows and invalidate their receipts.
5. After explicit activation approval, enable the coordinated backend/frontend flags and deploy through the approved process. Verify persistence before success, error recovery, Access and cookie behavior on the actual domain. Keep a rollback to the disabled export/server flag.

The public PDF remains directly accessible by URL; the UI gates its download after confirmed storage but does not technically protect the file. No automatic emails, campaigns, production collection or infrastructure changes are part of this stage.
