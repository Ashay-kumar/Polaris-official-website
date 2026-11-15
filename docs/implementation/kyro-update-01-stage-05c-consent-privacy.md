# Update 01 Stage 05C — approved consent and privacy operations

15 November 2026. Local implementation on `feature/kyro-update-01`; existing Stages 02–05B preserved. Production flags remain false. No Cloudflare/Google changes, dependencies, real submissions, new columns, credentials, automatic contact, commit, push or deployment.

## Approved identifiers and exact wording

The website `src/content/consent.json` and backend `src/consent.json` are byte-identical approved registries. SHA-256: `8038cdac683111e814655182c1c227463c212ea892fca46166a9f9afea5120cf`. UI labels/notices render from this registry; the existing policy content remains unchanged.

| Identifier | Associated visible wording |
| --- | --- |
| `KYRO-PRIVACY-2026-01` | “I acknowledge that I have read the Privacy Policy and understand how Kyro Learning will use the information I submit.” Policy text remains the approved `/privacy-policy` page. |
| `KYRO-FEEDBACK-CONTACT-2026-01` | “I agree to be contacted by Kyro Learning about the feedback I've shared.” |
| `KYRO-KIT-FOLLOWUP-2026-01` | “We may invite you to share your experience with the Home Leadership Kit. Where follow-up requires your permission, we'll contact you only if you choose to receive it.” |
| `KYRO-MARKETING-2026-01` | “I'd like to receive updates about new kits, resources and offers from Kyro Learning.” |

The new acknowledgement is required and initially unchecked in **both** forms, with linked “Privacy Policy” opening a labelled new tab to retain entered data. It is separate from the required adult confirmation and optional permissions. Both review states show acknowledgement. Unchecking invalidates kit review; feedback revalidates before review/submission. Deliberately starting another request resets acknowledgement/adult/optional choices. No optional permission becomes mandatory or preselected.

Kit follow-up is a conditional informational notice, not an opt-in or scheduled promise. The feedback-contact permission remains in Share Your Perspective; marketing permission remains in the kit flow. No new kit follow-up contact field was invented, and marketing opt-in does not establish feedback-purpose permission.

## Backend alignment and persistence

Both public submission endpoints strictly require `privacyAcknowledged === true` and `adultConfirmed === true`. Missing, false, numeric, null and string acknowledgements are rejected before persistence. Validated data includes acknowledgement in the existing retry hash, so altered answers/choices cannot silently replay an old request.

Server configuration must match all four approved registry versions; wrong/unassigned configuration fails closed. Client availability also requires all four exact versions, explicit enablement and a site key. Submitted notice-version mismatch returns 409 before storage. `.env.example` and local `wrangler.jsonc` contain the approved IDs, **not** enabled production flags. No invented identifiers or test IDs are production defaults.

Existing notes metadata in `Website Feedback` column M / `Kit Requests` column J now records `privacyAcknowledged`, `privacyAcknowledgedAt`, approved privacy version, all three other notice versions, adult confirmation and existing choice timestamp. `privacyAcknowledgedAt` is a server UTC timestamp from the first validated allocation, stable across retries; persistence timestamp remains separately confirmed in the receipt. No Sheet columns or existing rows were modified. Optional choices remain independent booleans in their existing columns. Registry preservation supplies the exact wording associated with each recorded version.

This does not retrofit assent onto old rows. Existing historical/synthetic receipts with a different request hash cannot be relabelled or silently reused under the new acknowledgement contract; they require deliberate handling. No production records were migrated in this stage.

## Files changed

Website added:

- `src/content/consent.json`
- `src/components/feedback/privacy-acknowledgement.tsx`
- `docs/operations/privacy-requests-and-kit-redelivery.md`
- This report.

Website modified: `src/components/feedback/feedback-form.tsx`, `kit-access.tsx`, `src/lib/form-submission.ts`, `.env.example`, README; focused tests `form-compliance.spec.ts`, `form-submission.spec.ts`. Existing form fixtures in `design-closure.spec.ts` / `website.spec.ts` now provide required acknowledgement when testing other behavior; those historical suites were not rerun.

Backend workspace added: `src/consent.json`, `test/consent-validation.test.mjs`. Modified `src/submissions.js`, `src/coordinator.js`, local `wrangler.jsonc`, README, and relevant synthetic fixtures in `test/{submissions,adult-confirmation,public-private-kit,security}.test.mjs`. Private token/R2 retrieval code, rate limits, Turnstile and Access helper remain unchanged. Backend edits are separate from the website Git repository; both source workspaces need eventual controlled handover. Before-file backups are ignored under `tmp/kyro-update-01/stage-05c/`.

## Verification

- TypeScript, zero-warning ESLint, production static build and export integrity: passed. All eight content routes retained; no PDF in static output and private PDF hashes unchanged.
- Relevant backend files `consent-validation`, `adult-confirmation`, `submissions`, `public-private-kit`: **18/18 tests passed**, covering strict required booleans, each submitted/configured version mismatch, recorded acknowledgement/timestamp/versions in both tabs, independent optional values, retries/conflicts, anonymous Turnstile flow, expired authorization/renewal, single/concurrent redemption and failed storage. Mock services/synthetic data only; no Google Sheet/R2 calls or cleanup needed.
- Enabled synthetic-build browser `form-submission.spec.ts`: **2/2 passed**, covering existing failure recovery, stable retry IDs, deliberate new feedback submission, kit dialog state, optional choice, acknowledgement-inclusive valid requests, protected download failure/retry and approved PDF hash. Transport and Turnstile are explicitly mocked only in Playwright; no production mock endpoint.
- Final disabled-build `form-compliance.spec.ts`: **2/2 passed**. This checks each acknowledgement's initial state, client rejection, review state, navigation and adult/optional independence. No unrelated visual/Stage 02/04 suites rerun.
- Registry byte identity and Git whitespace checks passed. Policy wording and private PDFs were not altered. Final build is disabled and contains no synthetic site key. Local configuration changed only the approved version values; no deployed settings changed.

## Manual operations and remaining dependencies

The internal runbook is held locally in ignored `docs/operations/privacy-requests-and-kit-redelivery.md`, outside the public source repository. **Ashay Kumar**, via **info@kyrolearning.com**, owns request intake/tracking, proportionate identity/authority verification, access/correction, purpose-specific withdrawal/deletion, quarterly purpose-based retention reviews and verified manual kit redelivery. It coordinates tombstones/token revocation and cell clearing with the same Durable Object/fixed-row allocator; no row shifting or counter reset. No public deletion API or automatic purge was created.

These responsibilities are approved and documented, not verified running. Before launch, confirm the restricted case-register location/access, mailbox operation, initial/quarterly review schedule, secure response/redelivery channel and a reviewed private maintenance procedure that serializes DO/Sheet corrections, withdrawals and deletions. Do not clear a Sheet record while leaving accepted retry/download capabilities active. Keep real case details and credentials out of Git. The runbook is outside `public/` and not statically published; repository access must still be appropriately restricted.

The previously unassigned wording/version and privacy-acknowledgement approvals are resolved by this stage. Remaining infrastructure prerequisites from Stage 05B still apply: real private R2 binding/object upload and integrity verification, shared coordinator deployment, existing Google secret/access verification, exact public origins/Turnstile keys/hostname, narrowly separated public API routing vs protected Access infrastructure, removal/assessment of old publicly deployed PDF copies/caches/history, secure CI/private fixture handling and separately authorized deployment verification/activation. No live deployment or operational completion is claimed. No automatic emails or follow-up scheduled.
