# Stage 06B - Form UX refinements

## Scope and repository state

Local implementation only. Frontend remains on `main` at `b56d5fc`; backend remains on `main` at `0f80da10ad3a9e87bed1f2f7f8a8d367c842af7f`. Changes are uncommitted. No production requests, Sheet records, credentials, production flags, Cloudflare configuration or infrastructure were changed. Stage 06A diagnostic cleanup and single-use delivery implementation remain intact.

## Implementation

- Both forms now place questions/contact inputs before eligibility, required privacy acknowledgement, optional permissions, verification and submission.
- Kit: removed the requested follow-up callout and review step. `Submit and download kit` validates then uses the existing persistence-confirmed receipt. Authorized download starts automatically only after receipt validation. Storage failures retain answers and reuse the existing identifier. Delivery failures offer download retry/authorization renewal without a new Sheet submission. Download requests have a 20-second timeout and an immediate repeated-click guard.
- Feedback: one grouped form with Your perspective, optional contacts, confirmations and consent, verification and final submission. All three substantive answers are individually optional; one must contain at least ten Unicode letters/digits. No character counters or textarea length restrictions. Client and server retain safety checks (8,000 characters per answer; server request cap remains 32 KiB). These bounds are abuse controls, not a requirement to fill every question.
- Both submit buttons stay disabled in server-rendered HTML until hydration; native fallback uses POST, preventing pre-hydration form data from entering URL query strings. A JavaScript-disabled browser test covers this safeguard.
- Feedback eligibility uses required, initially unselected Yes/No radios. Only Yes maps to the existing `adultConfirmed: true`; No cannot submit. Kit keeps its required adult checkbox. Privacy acknowledgement stays mandatory and separate.
- Follow-up and marketing remain optional and initially unchecked. Feedback offers its existing contact permission; Kit offers its existing marketing permission. The Kit schema has no separate feedback-contact permission, so none was invented. Privacy links and retention disclosures remain; all approved policy/consent identifiers and backend metadata are unchanged.
- Share thoughtfully is a native, collapsed-by-default disclosure directly below the conversation introduction. Existing privacy guidance is retained.
- Shared phone controls use a 1:3 country/number grid at every tested width; selected ISO country and dialling code stay visible, with full accessible country names and searchable options.
- The persistence-confirmed feedback success panel uses the existing ivory, blue, pink and ink tokens, with Explore Our Thinking primary and Share another perspective secondary.

## Files changed

Frontend:
- `src/lib/form-submission.ts` (hydration readiness only; submission/receipt logic unchanged)
- `src/app/help-shape-polaris/page.tsx`
- `src/components/feedback/feedback-form.tsx`
- `src/components/feedback/feedback-form.module.css`
- `src/components/feedback/feedback-confirmation.tsx`
- `src/components/feedback/kit-access.tsx`
- `src/components/feedback/protected-kit-download.tsx`
- `src/components/feedback/international-phone.tsx`
- `src/components/feedback/international-phone.module.css`
- `tests/e2e/form-submission.spec.ts`
- `tests/e2e/policies-cookies.spec.ts` (guidance selector and Kit CTA updated during deployment preflight)
- `tests/e2e/form-compliance.spec.ts`
- `tests/e2e/design-closure.spec.ts`
- `tests/e2e/website.spec.ts` (obsolete multi-step assertions updated)
- `scripts/test-forms-local.mjs`
- This report.

Backend (`../Polaris-backend`):
- `src/submissions.js`: targeted feedback answer validation only.
- `test/submissions.test.mjs`: optional-answer, empty/punctuation, and bounded-size cases.

## Verification

Passed:
- `npm.cmd run typecheck`
- `npm.cmd run lint`
- `npm.cmd run build`
- `npm.cmd run check:export`
- `npm.cmd run check:foundation`
- `npm.cmd run check:public-content`
- Backend `npm.cmd test`: 27/27, including Stage 06A token, concurrency, expiry, consent, idempotency and integrity coverage.
- `node scripts/test-forms-local.mjs`: initial 3/3 focused browser tests; after the hydration safeguard, targeted Kit/Feedback recovery and the additional JavaScript-disabled case also passed (4 unique focused cases total). Uses an isolated temporary source/public copy, synthetic site key and mocked Turnstile/API/PDF; does not change the real Next configuration or include private PDFs/secrets. Covers storage failure and same-ID retry, automatic download only after acceptance, download-only retry, required eligibility/privacy, optional permission choices, intentional new IDs, duplicate-click safety, normalized phone, keyboard country search, dialog focus restoration and disclosure keyboard behavior.
- Static-review browser tests: 4/4 (focused `form-compliance.spec.ts` plus dialog/contact checks from `design-closure.spec.ts`).
- Responsive checks: 1440, 1024, 768, 390 and 320px; no horizontal overflow, modal overflow or clipped controls; measured phone ratio 1:3.
- Focused axe scans: zero WCAG 2 A/AA and 2.1 AA violations in tested form, dialog, open country picker and success states. Automated scans do not replace a screen-reader/manual accessibility review.
- Final desktop/320px screenshots: `qa-artifacts/stage06b/feedback-{1440,320}.png` and `kit-{1440,320}.png` (ignored local artifacts). Mocked success screenshots were also visually reviewed during testing.

## Handoff and remaining dependencies

- Deploy the targeted backend validation before the frontend UX so optional answers are accepted end to end. Deployment requires separate approval; nothing was committed, pushed or deployed.
- Production flags and existing static-export review lock were preserved exactly as found. Enabled browser interactions were tested only in the isolated local harness. No claims of deployed/live verification are made.
- Expired unredeemed authorization can be renewed with the same request. Already redeemed authorization cannot be reissued automatically; a lost browser transfer still requires verified manual redelivery. The UI cannot prove a user saved the file to disk.
- No Google Sheets schema, consent identifier, secure-token, R2, rate-limit, Turnstile, origin or privacy-policy changes. No new dependency.

## Production deployment preflight

The production deployment task fast-forwarded frontend main to the existing upstream `d2852d1` configuration change without modifying it. The guidance disclosure retains `preview-info` for the existing footer anchor; its policy-link test uses the new disclosure and Kit CTA. Backend commit `ca0cf7570ba0ac667365cddfd51a675c89b2ef08` passed all 27 tests and Cloudflare Workers Builds reported success before frontend deployment. The Worker submission flag was already false and was not changed.
