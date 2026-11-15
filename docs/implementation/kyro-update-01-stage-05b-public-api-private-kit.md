# Update 01 Stage 05B — public submissions and private kit delivery

15 November 2026. Local implementation on `feature/kyro-update-01`. Stages 02–05A preserved except the explicitly authorized removal of public PDF delivery. No commit, push, deployment, Access/DNS change, R2 provisioning, secret creation or actual Sheet submission. Production activation flags remain false; unresolved consent IDs remain blank.

## Implementation and files

Website:

- `src/lib/form-submission.ts`: validated kit download authorization in confirmed receipts; renewal preserves the original attempt ID and answers. No public-sign-in requirement in API error text.
- `src/components/feedback/protected-kit-download.tsx`: authorized same-origin GET, bearer header, memory-only authorization, blob download, failures/retry/expiry recovery, one-use indication. `kit-access.tsx` uses this component after confirmed storage.
- `src/content/qualities.ts`: kit CTA uses a modal intent, not a PDF URL. Tracker action in `src/app/home-leadership-kit/page.tsx` and `src/components/brand/kit-document-preview.tsx` now open the same modal; corresponding preview CSS preserves appearance.
- All three PDFs formerly under `public/downloads/` relocated byte-for-byte to ignored `private/kit/`. `.gitignore` excludes `private/`. `docs/private-kit-assets.json` records relocation/hash/length, not an R2 object key or credential. Approved eight-page PDF SHA-256: `69dda4c82161de29300c8212d82aef9f078be8ca084e475ef730fd6c1ed955da`, 325137 bytes. Two historical six-page variants remain unchanged privately.
- `scripts/private-kit-files.mjs`, `check-content.mjs`, `check-foundation.mjs`: explicit relocated-file resolution with original hash assertions intact. `check-export.mjs`: checks all eight content routes and rejects every PDF in static output; verifies unchanged private originals.
- Targeted tests: `form-submission.spec.ts`, new `private-kit-export.spec.ts`, updated `kyro-kit.spec.ts`, and the obsolete public-PDF assertion in `website.spec.ts`. README updated. No dependency changes.

Backend (`C:/Users/Mridula Dass/Documents/Polaris-backend`, separate from website Git):

- `src/submissions.js`: public Turnstile-verified POST paths; retains Access verification helper for protected infrastructure. Kit capture fails closed if private storage is unconfigured.
- `src/coordinator.js`: same Sheet allocation/write/retry system, with receipt-bound download authorization and serialized redemption dispatch.
- New `src/kit-delivery.js`: token lifecycle, verified private R2 retrieval, no-store PDF response.
- `src/worker.js`: adds GET `/api/kit-download`; existing POST routes remain. `wrangler.jsonc` adds blank server-only `KIT_OBJECT_KEY`; activation flags stay false. No fake bucket name/binding was invented.
- New `test/public-private-kit.test.mjs`; existing submission/adult/security fixtures updated for required configuration. Existing Access signature tests retained. Backend README updated to distinguish current public routing/private delivery from historical Access requirements.

## Public routing and authentication

`POST /api/feedback` and `POST /api/kit-request` no longer require a Cloudflare Access assertion/session in application code. They still require strict validated fields/adult confirmation, exact approved notice versions, exact configured origin as defense in depth, server-verified Turnstile success/action/hostname, a 32 KiB streamed body limit, configured secrets and exclusive Sheet writes. Turnstile is bot/abuse verification, not proof of a person's identity; an Origin header can be forged and is not authentication.

SubmissionCoordinator retains UUID-based retry/conflict checks, fixed reserved rows, confirmed one-row persistence and the existing 30 unaccepted attempts/minute cap. No credential reaches the frontend. The loopback-only secret test mode remains impossible at a public hostname; production `LOCAL_TEST_MODE` remains false. `accessAllowed` remains implemented and tested, but is intentionally not a prerequisite for the two public form routes.

An authorized operator must separate these three public API paths from reviewer-only Access paths at the routing/policy layer. Current live Access protection was not changed or inspected. A blanket Access application can intercept requests before the Worker, so code changes alone do not make a deployed endpoint public. Use narrowly scoped public route/policy exceptions or an approved public site/API configuration while preserving protection for administrative/reviewer infrastructure. Do not place Access service tokens in browser code. GET download authorization is the bearer token, not a reviewer session.

## Authorization and private storage

After a kit row is confirmed persisted, the same Durable Object creates a 32-byte cryptographically random, base64url token (256 bits), stores its association with that accepted submission, and sets a server-enforced expiry of 15 minutes. Token hash indexes point to the submission record. The raw token is held inside private Durable Object state so a lost-response retry can recover the same unexpired authorization; it is a sensitive capability and must never be logged/exported in operational tooling. Feedback receipts contain no download authorization.

Submission retries before expiry return the same token/receipt without another Sheet write. If unredeemed authorization expires, re-verifying Turnstile and submitting the same unchanged request/ID replaces the expired authorization, revokes its old index and leaves the Sheet row intact. The frontend's “Renew download access” returns to that preserved review flow; it does not reset the submission ID. Already-redeemed submissions do not receive another authorization, including via retries or renewal. A deliberate new form submission remains a separate new record, not a recovery mechanism.

The browser retains authorization only in component/hook memory and sends it as `Authorization: Bearer …` to GET `/api/kit-download`. It is not placed in a query, anchor, third-party request, cookie, localStorage/sessionStorage or analytics. The downloaded file uses a temporary blob URL without the token. Reloading loses the in-memory request and authorization; do not promise reload recovery. Deployment logging must exclude Authorization headers and receipt bodies, including traces/error reporting. Application code logs neither.

Redemption is serialized through the existing single coordinator. It rejects missing/invalid/expired/used tokens, reads the private object through `KIT_STORAGE`, fully buffers this small PDF, verifies its exact byte count and SHA-256 against the approved resource, rechecks expiry, and only then records redemption before returning bytes. Concurrent requests yield one PDF response. A retrieval/integrity failure does not consume the token. Download attempts have an additional global 120/minute coordinator cap.

PDF responses use `application/pdf`, attachment filename, explicit length, `Cache-Control: no-store, private, max-age=0`, `Pragma: no-cache`, `nosniff` and no-referrer. Error replies are no-store and expose neither bucket/key nor credentials. No redirect or public R2 URL is issued.

**Unavoidable delivery limit:** after successful server retrieval and atomic consumption, a lost HTTP response/client disconnect can prevent the visitor saving bytes. The server cannot prove a browser/disk save; a retry then returns already-used. The UI explains the support route. No multi-use recovery or Range/resume bypass was added. Receipt/deletion administration and any owner-authorized re-delivery procedure remain manual dependencies. Do not claim this is DRM: visitors who save the PDF can share it.

## Static protection and historical exposure

The final local export contains no PDFs; all three old `/downloads/…pdf` paths return 404 locally. Tracker/preview clicks cannot retrieve the PDF without the form flow. Approved cover/activity/tracker preview images remain intentionally public excerpts; protecting the PDF does not make already published activity text/images secret.

This is **not yet deployed protection**. Existing live deployments, CDN caches, historical preview deployments, Git history/repository visibility and previously downloaded copies can still expose former public files. Before claiming protection, an authorized operator must remove/update old public deployments, verify/purge applicable cached copies, restrict obsolete previews and assess repository/history exposure. Those actions were not authorized or performed here. Previously distributed content cannot be made secret retroactively.

Private originals are deliberately not committed. A clean checkout needs a secure local copy for source-integrity/content tests; CI running those checks needs a separately approved private-artifact mechanism. `npm run build` itself does not import/package these PDFs and remains static-compatible. Do not solve missing CI fixtures by restoring a public copy or committing the private PDF to a public repository. Existing historical asset-generation scripts are not deployment tooling; do not run them to restore public documents.

## Verification results — local only

- Backend suite: **18/18 passed**, synthetic records and mocked Google/R2/Turnstile. Includes anonymous application-route acceptance without Access env/session, missing/invalid Turnstile, adult rejection, version mismatch, failed persistence/no authorization, retries without another row, expiry/renewal, absent/invalid token, single/concurrent redemption, used-token replay, missing storage binding, retrieval failure, corrupt object and default-disabled configuration. Existing signed Access helper tests also pass. No actual Google Sheet or R2 calls; no real records/cleanup needed.
- Backend Wrangler dry-run bundle passed (275.80 KiB, gzip 64.76 KiB). `--dry-run` exited without deployment; missing R2 binding/object configuration remains an explicit activation dependency.
- Enabled synthetic-build Playwright: **2/2 passed**. Feedback failure/retry/new ID and kit modal retention/consent, confirmed receipt, failed download/retry without new form requests, actual approved-file SHA and focused axe states. HTTP/Turnstile mocked only inside Playwright, never a production fake API.
- Final default-disabled build: TypeScript, zero-warning ESLint, production export, source/content/foundation integrity and whitespace checks passed. No TEST_ONLY config in final output. No PDFs under `out/`.
- Default-export targeted browser checks: **2/2 passed** for all three former PDF paths returning 404, tracker opening the modal/disabled submission, preserved previews and private PDF hash. No unrelated historical browser suite rerun. The legacy foundation check required one additional path-resolution update after relocation; original hash assertions were preserved and passed.

## Exact production prerequisites — not configured

Reuse existing Sheet, service account, Worker and shared `SUBMISSIONS` Durable Object architecture. Continue Stage 05A requirements: `GOOGLE_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY` as server-only secrets; exact `ALLOWED_ORIGINS`; `TURNSTILE_SECRET_KEY` secret and `TURNSTILE_HOSTNAME`; `SHEET_WRITES_EXCLUSIVE` confirmation; approved privacy `KYRO-PRIVACY-2026-01` and still-unassigned separate feedback/kit/marketing identifiers. Required privacy-acknowledgement wording and manual retention/deletion/follow-up operations remain unresolved. No automated contact is implemented.

New private-delivery settings:

| Setting | Required action |
| --- | --- |
| `KIT_STORAGE` | Bind a private Cloudflare R2 bucket to this exact Worker binding name. Actual bucket/account/environment selection requires operator approval; none created or selected here. |
| `KIT_OBJECT_KEY` | Server-only variable identifying the approved uploaded object. Currently blank. Do not expose it via `NEXT_PUBLIC_*`, receipts or public URLs. |
| Private bucket controls | No public `r2.dev` access/custom public domain, no public bucket/object URL. Worker binding access only; no R2 credential needed in browser. |
| Object upload | Authorized operator uploads unchanged approved 325137-byte PDF; independently verify SHA above. No upload performed. |
| Route | Same origin GET `/api/kit-download`, plus existing POST form routes to the Worker. Separate from reviewer Access interception and static Pages routing. |
| Coordinator | Reuse one shared namespace/instance key `existing-website-sheet`; do not deploy independent active writers/namespaces to the same managed tabs. Existing SQLite migration state must be verified before any infrastructure action. |
| Logging/cache | Redact Authorization and receipt bodies; no token-bearing traces/analytics; do not cache private API responses. Assess provider-level logging in live configuration. |

The local Wrangler file intentionally omits a fabricated bucket binding. Authorized configuration must add an `r2_buckets` entry with `binding: "KIT_STORAGE"` and the **actual approved private bucket name**, plus real `KIT_OBJECT_KEY`. `workers_dev:false` and all activation flags remain unchanged. No new token-signing secret is required: random capabilities are coordinated in private Durable Object state.

Frontend: same-origin API routing, matching public Turnstile site key and approved notice IDs; explicit `NEXT_PUBLIC_FORM_SUBMISSIONS_ENABLED` remains false. Do not point form requests to a different origin while expecting same-origin downloads. Public production submission settings no longer need `ACCESS_TEAM_DOMAIN`/`ACCESS_AUD`; retain those settings/helper wherever other protected infrastructure actually uses them.

Recommended sequence: resolve approvals and private-artifact/operational ownership; configure private storage/object and shared coordinator with flags false; configure narrow public API routing while preserving protected infrastructure; remove obsolete public delivery paths/caches; authorize a protected synthetic deployment verification; only then separately approve coordinated backend/frontend activation. No production readiness or protection is claimed merely from these local tests.
