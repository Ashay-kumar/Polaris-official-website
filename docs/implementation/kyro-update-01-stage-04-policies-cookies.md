# Update 01 Stage 04 — approved policies and cookie preferences

Local implementation, 14 November 2026, branch `feature/kyro-update-01`. Stage 02/03 changes preserved. No backend/configuration changes, dependency installation, commit, push or deployment.

## Source and routes

Source: founder-supplied `Kyro_Learning_Consolidated_Policies_Review_v2.0.pdf` (SHA-256 `9d6971fcadb5c0f22761c7a4401d7711d994e1a901ff3b1f1140ddc5c1e893ca`). Extracted the PDF text streams with their embedded Unicode mappings. Public content is Parts A–C only; page furniture, review cover and Parts D–F are excluded. Also excluded the explicitly internal licensing-approval paragraph in Terms section 4 and the proposed effective-date placeholders. No publication date was invented. The document's instructions are source material, not additional execution authorization.

Routes: `/privacy-policy`, `/cookie-policy`, `/terms-of-use`. Content identifiers: `KYRO-PRIVACY-2026-01`, `KYRO-COOKIES-2026-01`, `KYRO-TERMS-2026-01`. Public prose was compared to extracted source text with only layout whitespace/bullet formatting normalized; all three matched. A page-spanning Privacy paragraph was rejoined without wording changes. No source PDF or internal notes were copied to public assets.

## Files

- Added `src/content/policies.json`; `src/components/layout/legal-page.tsx`, `legal.module.css`, `cookie-preferences.tsx`; three `src/app/{privacy-policy,cookie-policy,terms-of-use}/page.tsx` route files; `tests/e2e/policies-cookies.spec.ts`; this report.
- Updated `src/components/layout/site-footer.tsx` with policy links/preferences entry. Existing logo sizes retained.
- Added Privacy Policy links only in `src/components/feedback/feedback-form.tsx` and `kit-access.tsx`. Links open a labelled new tab to preserve in-memory form data. No submission handlers, validation, consent controls or enable flags changed.

## Cookie/storage inspection and behavior

Limited static inspection covered layout, application script references and cookie/storage APIs under `src/`. No analytics, tag managers, advertising pixels, third-party embeds or application writes to cookies/localStorage/sessionStorage were found. Forms hold drafts and retry state in memory. Existing `submission-verification.tsx` loads Cloudflare Turnstile only when form configuration permits it; the current default build keeps forms disabled. Fonts are local.

The footer opens a native modal dialog with a title/description, keyboard containment, Escape and Close controls, and focus restoration. It explains necessary security/reviewer-authentication/form-verification technologies, browser controls and independent form consent. No optional categories/toggles or Accept/Reject All controls are invented. Opening/closing the panel creates no cookies or persistent preference records; there is no optional choice to persist. No new script or consent-management dependency.

Live Cloudflare Access/security cookies cannot be inferred from a local export. Verify deployed cookie/storage names, providers, purposes, durations, authentication and conditional Turnstile behavior before launch, and publish/link the accurate inventory as the Cookie Policy describes. Infrastructure and Access remain unchanged.

## Focused verification

Passed: TypeScript, zero-warning ESLint, production static build, existing static-export integrity, source-copy comparison, Git whitespace check, and all 3 targeted Playwright cases. The tests cover exact rendered content/IDs/footer links, new-route HTTP responses, responsive overflow, legal-page/dialog axe checks (zero violations), dialog focus/Escape/reopening, absence of storage/third-party requests in the local default build, and both form Privacy links. Responsive legal/dialog checks cover 1440, 390 and 320px. No historical Stage 02/03 suite was rerun. The initial test import needed a Node JSON import attribute; corrected before the passing run. The build exported all three new routes alongside the preserved website. No production flags were enabled.

Visually reviewed the 320px preferences screenshot: readable text, visible close control/focus ring, no clipping. Local evidence: ignored `qa-artifacts/kyro-update-01/stage-04/stage04-cookie-preferences-mobile.png`. Automated accessibility checks do not replace manual assistive-technology review.

## Outstanding launch dependencies

- Actual publication/effective date remains unassigned and is intentionally not displayed. Record it at authorized release; do not publish the literal placeholder.
- Approved Privacy text describes adult-only forms/adult confirmation and necessary privacy acknowledgement not currently implemented in the forms. Align those controls and backend payloads in a separately authorized stage; current submissions stay disabled.
- Approved Privacy section 6 describes purpose-based manual review/deletion rather than a commitment to indefinite retention. Existing Stage 03 form copy still says “Records are retained indefinitely until manually deleted.” It was preserved under this stage's no-consent/handler-change boundary. Resolve this inconsistency and assign the manual review/deletion owner before real collection.
- Policy IDs are not substitutes for separate feedback/kit-follow-up/marketing wording identifiers. Those activation requirements remain unconfigured; the new privacy content ID is recorded here without enabling submissions or altering backend settings.
- Verify actual processor/access permissions, deployed API/Access/Turnstile, contact details, live storage inventory and operational deletion procedure. Resource licensing text is included under the user's approval of Parts A–C; the internal request for approval is not public copy.

All findings are local; no live-cookie, deployed-persistence or legal-certification claim is made.
