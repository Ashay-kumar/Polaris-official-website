# Kyro Learning Website Update 01 — Stage 01 audit and implementation plan

Audit: 13 November 2026, Asia/Calcutta. Read-only except this report. Verified observations are distinguished from proposed configuration and approval-dependent actions. No builds, tests, infrastructure creation or live submissions were performed.

## 1. Verified repository and production-source state

- Workspace: `C:\Users\Mridula Dass\Documents\Polaris-official-website`.
- Remote: `https://github.com/Ashay-kumar/Polaris-official-website.git`.
- Active branch: `feature/polaris-cloudflare-pages`; HEAD `a0c5c99faf23c1734c356d358487c1674cbccb9e`, “fix: validate Kyro Learning logos from approved v2.0 assets”.
- Initial working tree and index: clean; no untracked files. The historical uncommitted Stage 06.1 situation no longer describes this checkout. Its components and subsequent Kyro migration are present; none was overwritten.
- Read-only remote tips: `main` = `cf536925fb8787dbd104449556163e332b385b1f`; Cloudflare feature branch = local HEAD; first-draft branch = `d6239ac25d62164a85f8d510e439cb9e90a9b148`.
- GitHub comparison: remote main is two commits ahead, zero behind, with **no file differences** from local HEAD. Latest production-branch source content is available locally, although local history is behind.
- Local main `8176f30` and cached origin/main `7aa5894` are stale. No fetch or ref modification was performed. PR #2 was previously merged; do not reuse it as an open review vehicle.
- Portable Git `tmp/git-portable/cmd/git.exe` works. A sandbox network restriction on read-only ls-remote was resolved through execution approval. No credentials were printed or configuration changed.
- `next.config.ts:3–6`: static export, trailing slashes, unoptimized images, no repository base path. `package.json`: Next 16.4.3, React/React DOM 19.3.1, TypeScript, CSS Modules and libphonenumber-js 1.13.16; `.node-version`: Node 24. No framework upgrade needed.
- `.github/workflows/validate.yml` is validation-only for PR/main with read-only repository permissions. `docs/cloudflare-pages.md` records production branch main, build `npm run build`, output `out`, Node 24. No Worker/Wrangler/API-route/Sheets implementation was found in current tracked application/configuration.

**Production limitation:** Cloudflare project/domain, active deployed SHA, Google account/Sheet and secrets were not inspected. Source equality does not establish what Cloudflare is currently serving. Owner must confirm deployed SHA/domain before release acceptance.

Safest later workflow: after authorization, preserve this report, recheck work, refresh main and create `feature/kyro-update-01` from verified current main. Use an isolated worktree if unrelated work appears. Do not use stale local main, reset, discard, auto-stash or reopen merged PR #2. No branch creation is part of this audit.

Pre-report inventory: 483 tracked/nonignored files. Application/public baseline digest: `2191edda3bf6ef3071d5732f04698125cb7b9c3f744a7859a344f75fb4dd201a` (SHA-256 over sorted path/content-hash pairs under src/ and public/). Final status should contain only this report.

## 2. Logo audit and enlargement plan

| Visible UI consumer | Source and current size | Approved target image width |
| --- | --- | --- |
| Shared header on all five routes | `src/components/layout/site-header.tsx:15`, width 156 | Desktop 220px; mobile 175px |
| Shared footer on all five routes | `src/components/layout/site-footer.tsx:7`, width 156 | 240px |
| Illustrated booklet | `src/components/brand/kit-illustration.tsx:10`, width 125 | 160px |

`src/components/brand/polaris-logo.tsx:13–18` defaults to the approved horizontal asset, alt “Kyro Learning”, and derives height from intrinsic proportions; next/image is unoptimized, with auto height. It accepts className. Preserve this wrapper, internal identifiers, artwork and accessibility.

Booklet reuse: kit hero (`src/components/pages/editorial-heroes.tsx:31`), kit download section (`src/app/home-leadership-kit/page.tsx:20`), shared KitFeature on Home and Our Thinking (`src/components/ui/website.tsx:35–38`). One booklet edit covers four placements. No additional live JSX logo consumer was found. Branding inside PDFs/previews or legacy conceptual artwork is asset content, not independently scalable UI; do not alter it here.

Registry `src/lib/brand/logos.ts:1–9` selects v2.0 Kyro wordmarks and unchanged v1.1 symbol/icon. All four v2.0 SVG wordmarks are outlined, without text nodes.

Read-only native-size raster alpha measurements (>16/255; not clear-space standards):

| Variant | Canvas/viewBox | Nontransparent bounds | Occupied width |
| --- | --- | --- | --- |
| Horizontal, used by UI | 1982 × 794 | x214–1457; y82–712 | 62.76% |
| Primary | 1253 × 1575 | x128–1124; y0–1532 | 79.57% |
| Ink | 1000 × 1680 | x1–998; y0–1637 | 99.80% |
| Reversed backed | 1383 × 1680 | Full canvas including backing | 100%; backing included |

The horizontal SVG has approximately 214px left/524px right transparent margins. Current width 156 shows ~98px of artwork. Targets 220/175/240/160 show ~138/110/151/100px. Image-box heights are ~88/70/96/64px. Interpret the approved targets as image-box widths. Do not trim the canvas or distort it; a tight-canvas export needs separate design approval.

Layout constraints:

- `src/styles/website.module.css:27–34`: flex header, nonshrinking logo, 88px minimum header height plus existing padding. CTA hides <=1100px (`:166`); menu collapses <=799px and header minimum becomes 76px (`:173–184`). Larger image needs natural header growth, not a forced/clipped old height.
- Footer grid `:118–120`, two columns below 799px, one below 499px. Check 240px against 320px viewport gutters.
- `src/components/brand/kit-illustration.module.css:4–6,23–25`: booklet padding, rotation, max-width and narrow overrides may constrain 160px. Preserve composition; make only necessary local spacing changes after visual review.

Later implementation: targeted header desktop/mobile classes via existing className, width in CSS and height auto; footer/booklet fixed approved widths. Preserve <=799px mobile breakpoint unless an actual tablet collision requires earlier menu collapse. Do not shrink the target logo or overlap navigation to retain the desktop menu. Test 1440/1024/768/390/320, boundaries 799/800 and 1100/1101, and 200% zoom.

## 3. Forms, resources and privacy audit

### Share Your Perspective

`src/components/feedback/feedback-form.tsx:16–69`: four steps plus review; React state preserves Back/Next answers, heading/error-summary focus and labelled progress controls.

- Perspective IDs from `src/content/qualities.ts:11`: parent, educator, professional, visitor.
- Challenge/wish required, 10 trimmed characters minimum; UI maximum 2,000. Understand optional, UI maximum 2,000. Server must enforce maxima, not trust HTML constraints.
- Name optional/max100; email optional/max254 and format check. Existing flow requires email when follow-up is selected, even if phone exists. Preserve unless founder approves changing that rule.
- Phone optional; shared `src/lib/phone.ts:1–18` uses full metadata, strict parsing, selected-country consistency, E.164 and no extensions. `international-phone.tsx` provides searchable flags/names/codes. Valid number does not prove ownership or contact permission.
- followUp defaults false; current wording: “I agree to be contacted by Kyro Learning about the feedback I've shared.” Contact details alone do not imply permission.
- Final action disabled at `:67`, form prevents submission; no fetch or endpoint exists.
- `src/components/feedback/feedback-confirmation.tsx:5–8` requires accepted status, submissionId and persistedAt but is not wired in. Its type/shape is not proof of persistence; activate only from a validated real receipt.

### Home Leadership Kit

`src/components/feedback/kit-access.tsx:7–41`: shared trigger/provider, native dialog, Close/Escape, Tab trap, opener focus restoration and body scroll lock. Closing unmounts/reset drafts; a failed request must not unmount/reset it.

Required name: trim/collapse, 2–100 chars. Required email: trimmed format validation/max254 in UI. Required phone: same international component. Marketing checkbox optional/unchecked. Informational experience-follow-up notice is separate. Review validates and displays E.164 (`:21–25,39–40`); edits invalidate review. Download disabled (`:41`); no successful request state, backend or email delivery. `src/components/ui/website.tsx:10–12` intercepts standard kit CTAs into the shared modal.

### Approved eight-page PDF and bypass paths

`src/content/qualities.ts:10`: `/downloads/Kyro_Learning_Home_Leadership_Kit.pdf`. Verified file: 325,137 bytes, eight page objects, SHA-256 `69dda4c82161de29300c8212d82aef9f078be8ca084e475ef730fd6c1ed955da`. `tests/e2e/kyro-kit.spec.ts:9–45` records the resource/hash. `src/content/kit-previews.json` maps approved pages 1/3/7; tracker is page seven.

Direct tracker link at `src/app/home-leadership-kit/page.tsx:19` opens PDF #page=7. `src/components/brand/kit-document-preview.tsx:27–32` also links directly when consumed (no caller found). These are existing approved preview links, not gated CTAs. Preserve tracker behavior unless founder explicitly wants all UI resource access gated. Public URL remains accessible regardless; never describe it as access-protected.

Legacy six-page PDFs remain unchanged. `kit-illustration.tsx:11` still says original six-page PDF; `activity-explorer.tsx:28` describes original six-page instruction source. `docs/forms-backend-handoff.md`, `docs/cloudflare-pages.md` and asset README text are historical. Reconcile misleading current-resource captions/contracts in later integration, while preserving activity lineage and both PDFs. Retain historical integrity checks plus the Kyro PDF checks.

No approved privacy page/version was found. Footer (`site-footer.tsx:10`) links to feedback information, not privacy policy. Current form wording uses Kyro but historical handoff documents still say Polaris. Design approval does not establish privacy or channel-consent approval.
## 4. Proposed backend architecture and practical limitations

Keep Next static export/Cloudflare Pages unchanged. Add isolated TypeScript project `backend/forms-worker/` with its own pinned tooling/lockfile. Proposed endpoints, not existing services: POST `/v1/feedback`, POST `/v1/kit-requests`, and explicit OPTIONS. Owner selects API domain. Separate API origin avoids changing Pages routes; same-origin routing is optional later. No Next route handler, Pages Functions conversion or OpenNext adapter required.

Flow: existing UI -> HTTPS Worker -> origin/body/schema/bot/rate checks -> durable idempotency/row coordinator -> Google OAuth -> private Sheet -> validated persistence receipt -> existing confirmation or kit access UI.

### Authentication and secrets

Dedicated service account shared as Editor only to the approved private workbook; enable Sheets API in approved project. No broad project Editor/Owner, public sharing or domain-wide delegation required. Sheets scopes are spreadsheet-wide, not tab-specific; separate tabs are not access isolation. If staff require different PII access, use separate workbooks. [Google scopes](https://developers.google.com/workspace/sheets/api/scopes)

Keep signing key, OAuth token generation and access tokens entirely server-side. Cache short-lived tokens with expiry margin/single-flight refresh. Evaluate a maintained Workers/Web-Crypto-compatible JOSE signer plus fetch; do not assume Node Google SDK compatibility. Pin tested dependencies only during implementation. Native signing is possible but security-sensitive; Google recommends libraries. Keyless federation needs a verified trusted identity provider: Workers do not automatically receive a Google workload identity. [Google OAuth](https://developers.google.com/identity/protocols/oauth2/service-account), [Workers Web Crypto](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/)

Proposed Worker secrets: GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY, GOOGLE_SERVICE_ACCOUNT_EMAIL, TURNSTILE_SECRET_KEY, IDEMPOTENCY_HMAC_SECRET. Workbook ID remains Worker-only configuration/secret by owner policy. Exact allowed origins, notice versions, tab IDs/header order and feature gate are server configuration. Public frontend configuration contains only API origin and Turnstile site key. No Google credentials in NEXT_PUBLIC variables, static export, logs, GitHub or build configuration. Local secret files remain ignored/operator-managed. [Cloudflare secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

### Server validation and abuse prevention

- Strict bounded JSON schema; reject unknown keys, invalid types and unexpected country/category values. Revalidate every field, whitespace, lengths, email and full phone metadata. Preserve optional feedback phone versus required kit phone; normalized E.164 only in storage.
- Proposed actual body cap 32 KiB UTF-8, checked while streaming even without trustworthy Content-Length. Reject unsupported media/content encodings. 413 oversize; 415 wrong media. No attachment, executable content, client-selected Sheet range/ID or arbitrary download redirect.
- Exact production/staging Origin allowlists; no wildcard preview hosts, credentials/cookies or permissive null origin. Vary: Origin and restricted methods/headers, JSON/idempotency preflight. CORS is not authentication; nonbrowser clients can forge Origin.
- Server-verify Turnstile success, expected hostname and distinct form action. Refresh near final submit because tokens expire after five minutes and are single-use; obtain fresh token on appropriate retries. Use Siteverify idempotency for verification retry and accessible challenge recovery. Site key is public; secret server-side. [Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- Per-client rate limiting plus coordinator-wide quota/circuit breaker across both forms. Cloudflare rate counters are location-scoped, not strict global Google quota protection. Approve any IP-derived key retention; never log raw PII/bodies. Honeypot/timing may supplement, never fake storage success for rejected traffic. [Rate limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
- Write user-controlled cells as literal strings with valueInputOption=RAW, never USER_ENTERED. Preserve phone + and avoid formula execution. CSV/Excel exports need separate formula-safe handling. [Input semantics](https://developers.google.com/workspace/sheets/api/reference/rest/v4/ValueInputOption)

### Duplicate protection, quotas and retries

Bare append is not idempotent: Google may commit while its response is lost. Blind retry can append twice. Disabled buttons, isolate memory or eventually consistent KV do not solve concurrent delivery. [Append API](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/append), [KV consistency](https://developers.cloudflare.com/kv/concepts/how-kv-works/)

Recommended, subject to owner approval: SQLite-backed Durable Object per workbook. Atomically reserve a row and stable submission ID/timestamp for `(form, idempotency key)`, store a keyed HMAC of canonical payload and explicitly serialize duplicate operations. Same key/different payload -> 409; completed same request -> original minimal receipt, no new write. No full form-content storage in coordinator by default. [Durable storage](https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/)

Use fixed-row spreadsheets.values.update rather than blind append: an uncertain retry writes the identical canonical record at the same reserved row. Mark persisted only after verified Google acknowledgement or matching readback. A crash after Google acceptance can recover without a second row. This is application-level coordination, not a distributed transaction guarantee. [Update API](https://developers.google.com/workspace/sheets/api/reference/rest/v4/spreadsheets.values/update)

Prerequisites: protected ingestion headers/ranges; no physical row insertion/deletion/sorting or manual writes inside managed ranges. Use filter views/separate reporting views. Initialize row counters after controlled header/capacity/readback checks; handle grid expansion safely. Ashay must approve these operational restrictions. If staff need physical row editing, redesign persistence before launch.

Agree a bounded retry window/metadata retention (seven days is only a proposal). Expiring server-issued nonces or retained tombstones must prevent expired replays becoming silently new requests. Specify key/session expiry and modal-close retry behavior. This extra Cloudflare metadata store requires privacy/cost approval. Simpler Worker+append-only is possible but cannot promise the same duplicate protection.

Google documents default read/write quotas 300/min/project, 60/min/user/project; service-account traffic counts as one account. Inspect actual quotas; budget below them across both tabs, including recovery reads. Bounded exponential backoff/jitter for explicit transient/quota failures; uncertain writes reuse reserved row. Fail fast on auth/schema errors; no long blind retries and no accepted success for merely queued work. [Sheets limits](https://developers.google.com/workspace/sheets/api/limits)

Verify selected Workers plan limits, DO availability/cost, JWT/phone-validation CPU, outbound latency, Google organizational sharing/key policy and rotation. Sheets suits low-volume intake, not a general transactional database/high-volume CRM. [Workers limits](https://developers.cloudflare.com/workers/platform/limits/)

## 5. Proposed worksheet and API contracts

Owner creates/chooses one private workbook with exact tabs `Feedback` and `Kit Requests`, protected matching headers and known IDs. Store ISO UTC server timestamps, literal strings and actual booleans. No client selects a range/tab.

Common columns for both:

`submission_id`, `submitted_at_utc`, `request_id`, `schema_version`, `form_version`, `privacy_notice_version`, `choice_recorded_at_utc`, `source_form`, `is_test`, `test_run_id`.

Feedback additional columns:

`perspective`, `challenge`, `wish`, `understand`, `full_name`, `email`, `phone_e164`, `feedback_follow_up_opt_in`, `feedback_consent_version`.

Kit Requests additional columns:

`full_name`, `email`, `phone_e164`, `marketing_opt_in`, `marketing_consent_version`, `kit_follow_up_notice_version`, `kit_asset_version`, `kit_sha256`, `kit_download_path`.

No child profile/name/age/school/DOB, raw phone draft, raw IP/referrer URL, Turnstile token, idempotency secret, OAuth token or private key columns. Free text can still contain sensitive information: retain warning and approve handling/redaction/deletion. is_test/test_run_id are staging/operator policy, not a client bypass flag.

Payload: schema/form versions, high-entropy idempotency key, identifiers for the exact approved visible notices, fresh Turnstile token and form data. Map followUp to feedback_follow_up_opt_in and name to full_name. Validate raw phone/country; store E.164. Empty optional fields become empty cells. Server owns timestamps. Match notice identifiers to approved versions and reject stale/mismatched clients; do not label an old browser's consent as a newer unseen version. No actual policy/consent versions are assigned in this audit. Maintain approved wording/version history. Timestamp of false records a choice, not an opt-in.

Receipt: 201 (replay 200) with `{status:"accepted", submissionId, persistedAt}` only after Sheet persistence. Kit additionally receives a fixed allowlisted same-origin PDF path/hash, not a client-provided URL. Return no contact values, workbook/range, tokens or upstream errors. Pending/unknown is non-success (202 pending or retryable failure), never accepted. Use no-store responses.

Safe errors: field validation (400/422), origin/bot (403), key/version conflict (409), body/media (413/415), rate limit (429 + Retry-After), and retryable upstream/timeout (502/503). Provide stable code, safe message/request ID; no Google internal detail. Define operator reconciliation for unresolved pending rows.

## 6. Frontend integration behavior

Preserve existing steps/review, visual styles and modal/picker controls. Add explicit editing/review/submitting/succeeded/failed state; no simulated success. Disable duplicate action while pending and announce aria-busy/status. Preserve fields/checkboxes on failure. Drafts/retry keys remain memory-only, never URL, browser persistence, analytics or logs. Retry same canonical payload with same key; edits after uncertain storage need deliberate new identity/reconciliation, not silent duplicate submissions.

Feedback: revalidate all fields at final submit, validate real receipt shape, then show FeedbackConfirmation and focus its heading. Contact/permission remain optional, with existing email-if-follow-up rule. Errors retain draft/review and actionable focused summary.

Kit: only confirmed storage reveals/enables Download your kit for the approved eight-page file. Prefer explicit link/button after success because browsers may block downloads triggered asynchronously; retain fallback after any approved automatic attempt. Do not clear/unmount on failure. Preserve Escape/focus restoration and specify close-during-submit/lost-response recovery; no navigation trap. No automatic email delivery or contact campaigns.

The CTA flow is gated, but static PDF and approved tracker anchor remain accessible. Do not call this protected delivery. Keep final actions unavailable if configuration, approved notice versions or backend health is missing. Enablement/deployment requires separate staging UAT and owner approval.
## 7. Required configuration and privacy/security launch gates

**Google owner:** confirm project and any separate integration work; approve auth/service account, enable API, select private workbook/tabs, grant least access, protect ingestion ranges and designate editors. Confirm organization sharing/key restrictions, quotas and key rotation. No authenticated Google resource or existing credential was accessed here.

**Cloudflare owner:** confirm deployed SHA/domain/Pages settings; approve separate Worker environments/API hostname, DO namespace/migration, rate limits, Turnstile hostnames/actions, managed secrets, compatibility date, feature gate/kill switch and monitoring owner. Separate staging workbook/account/secrets from production. Do not bind production writes to arbitrary Pages previews. Logo CSS alone needs no live hosting changes.

**Before collection, approve:**

- Privacy notice with controller/contact identity, collection purposes, Cloudflare/Google processing, sharing/transfers, retention/deletion and rights/contact process. No approved policy/version is evidenced locally.
- Purpose/necessity of required kit phone and channel-specific follow-up permissions. Current “We'll reach out in a few days” notice is informational, not blanket permission. Reconcile that promise with no automatic follow-up being implemented. Obtain extra explicit permission if applicable; never infer it from marketing or download request.
- Independent unchecked marketing and feedback permission wording/versions. Supplying contacts is not opt-in. Confirm email-required-for-feedback-follow-up behavior.
- Data retention, role/access owners, deletion across Sheet, revision history/backups and coordinator metadata; deletion verification, withdrawals, incidents, redacted logs and audit access. Worksheet tabs do not isolate staff permissions.
- Adult/recipient eligibility and handling of unsolicited child-identifying/sensitive free text. Jurisdiction-specific legal review is an owner/legal dependency, not settled by technical/design approval.
- PII-free logs/analytics/error reports and test traces/screenshots. Never log bodies, auth headers, signing keys or tokens. Limit access to provider audit logs/backups too.

## 8. Implementation stages, in execution order

1. **Baseline/decisions:** confirm live source, origins, safe feature branch after authorization, Sheet/auth owner, existing separate integration work, privacy/consent versions, phone purpose, metadata retention, DO plan and tracker-link policy. Capture baseline; no collection enabled.
2. **Logo-only change:** targeted header/footer/booklet widths/classes; preserve asset bytes, ratios and compositions. Review responsive screenshots independently of backend work.
3. **Local backend/contracts:** isolated proposed `backend/forms-worker/{src,tests,wrangler.jsonc,package.json}` and lockfile; small submission/validation contracts as needed. No marketing-component replacement. Test OAuth/Google/Turnstile adapters through test-only fakes, never a production fake-success path. Pin compatible tooling only after verification.
4. **Authorized staging setup:** owner approves/creates Google and Cloudflare resources/secrets. Validate account identity, private permissions, headers/capacity, row allocation and cleanup using synthetic records. No repurposing unknown existing Sheets work.
5. **Frontend connection:** focused feedback-form/kit-access edits, small submission client, receipt validation, privacy links and status styling. Preserve PDF constant/assets and forms' structure. Reconcile historical handoff/current-resource captions only where necessary. Keep feature gate disabled until accepted.
6. **Security/failure UAT:** actual staging writes to both tabs; retry/crash/concurrency, quota/bot controls, keyboard/screen-reader/manual mobile checks and approved download. Review operator runbook/privacy gates and synthetic cleanup evidence.
7. **Release readiness:** review source/assets diff, CI, staging evidence and exact owner-approved configuration. Commit/PR/deployment are separate authorized tasks, not part of this audit.

## 9. Testing and acceptance criteria

No tests were run for this audit. Existing Playwright/axe and Node test source were inspected. Add isolated Worker tests; evaluate compatible Wrangler/Vitest tooling during implementation, without changing Next architecture.

| Area | Acceptance criteria |
| --- | --- |
| Logo | Approved box widths 220 desktop/175 mobile header, 240 footer, 160 booklet; ratio 1982:794, unchanged SVG hashes; no overflow/clipping/navigation collisions at 1440/1024/768/390/320, boundary widths and 200% zoom |
| Navigation/layout | Five routes, keyboard/mobile menu/Escape, footer links, twelve activity filters/details and approved editorial sections preserved |
| Feedback | Category/challenge/wish required, other text/contact optional; no-contact and follow-up false accepted; selected follow-up retains existing email rule; Back/Next/review values persist |
| Kit | Required name/email/phone; review validation; optional marketing false/true preserved; edits invalidate review; no success/download CTA before real persistence; Escape/trap/restoration/mobile scroll work |
| International phone | Empty optional/required cases; national + selected country; pasted E.164; selected-country mismatch; short/long/letter/extension/invalid numbers; shared dial-code countries; normalization on server and review |
| Sheets | Correct private tabs/header mapping; normalized phone; false booleans retained; actual approved consent versions, server UTC timestamps; confirmed write/readback required |
| Retry/deduplication | Double-click, concurrent same key, same key changed body, Google commit with lost response, Worker crash after commit, 429/5xx, OAuth refresh, expired nonce/token: expected recovery without second row under approved retry contract |
| Abuse/security | Forged origin, bot failure/replay, local/global rate caps, oversize/chunked JSON, bad media, unknown fields, absent config/secrets; formula-like text and phone + remain literal; no secrets in static files/logs |
| Failure UX | Offline/DNS/timeout, malformed server receipt, upstream access/quota outage, 409/422/429/503; actionable accessible errors, preserved inputs/choices, retry with no false success |
| Resource | Eight-page SHA above, tracker page seven, previews 1/3/7, legacy resources unchanged; successful kit link works; public URL honestly disclosed |
| Accessibility | Dialog/picker semantics, keyboard/focus, loading/error/success announcements, checkbox labels, contrast, reduced motion, actual mobile keyboard and 320px controls; axe plus manual review |
| Hosting | Next type/lint/static/integrity checks pass; no server-dependent Next feature; isolated Worker tests/build pass; staging API CORS works with approved Pages origins |

Later commands: `npm.cmd run typecheck`, `npm.cmd run lint`, `npm.cmd run build`, `npm.cmd run check:foundation`, `npm.cmd run check:content`, `npm.cmd run check:export`, `node scripts/check-stage-03-assets.mjs`, `node scripts/check-phone-assets.mjs`, `node scripts/brand-sync.mjs --check`, relevant Node brand tests and Playwright (including `tests/e2e/kyro-kit.spec.ts`). Preserve historical resource checks. Replace disabled-only behavior assertions only alongside real integration assertions, retaining an unconfigured/disabled scenario. Do not weaken provenance checks to make tests pass.

Synthetic UAT only: dedicated staging workbook/service account, example.test emails, fictional names and reserved phone examples (validity does not imply deliverability). Assign operator test_run_id and initial row inventory. Verify persistence through a trusted operator/read-only channel; no public PII-read endpoint. After authorized UAT cleanup, clear matching test-run cells and retire their receipts/rate metadata according to retention policy; verify cleanup/counts without logging raw records. Do not physically delete/sort managed rows or reset production allocation counters. Do not delete genuine records. Revision history can retain cleared data: use disposable synthetic staging workbook and approved lifecycle policy.

## 10. Risks, unresolved dependencies and completion

Real collection is blocked on: verified live deployment/domain; authorized Google project/private Sheet/auth; Cloudflare Worker/DO/Turnstile setup; privacy and actual consent versions; phone-purpose/channel decisions; retention/access/deletion approval; acceptance of fixed-row operational rules; staging tests. No existing Sheets integration can be assumed from historical documentation.

Logo work is implementation-ready with padding intentionally preserved. Most likely visual risk: header height/tablet navigation, not intrinsic ratio. Confirm whether target widths mean image boxes (recommended) versus visible ink before any trimming request. Full form enablement is feasible subject to the listed account, operational and privacy gates; no exactly-once, free-tier, legal-compliance or resource-protection guarantee is asserted.

Only this requested report is created. Application source, approved Stage 06.1/Kyro assets, PDFs, Git refs and configuration remain unchanged. No Sheet, credentials, Worker, branch, commit, PR or deployment was created.