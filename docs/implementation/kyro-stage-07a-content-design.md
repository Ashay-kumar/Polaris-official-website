# Stage 07A - Approved copy and design integration

## Authoritative source

Read all seven pages of the supplied document at C:/Users/Mridula Dass/Downloads/Kyro_Learning_Website_Copy_SEO_AEO_v2.pdf (SHA-256 4f6ebaa5e85f863336cd76a4e548cde2b1f78bb1d787b4ee362b3a475785034f). The alternate filename ending v2(1).pdf does not exist at the supplied location. Document labels, URLs and implementation descriptions were treated as reference material, subject to the user's explicit decisions and restrictions.

## Changes by page

- Home: preserved the Beyond the Marks heading, telescope artwork and hero layout. Added the approved supporting line; problem -> purpose -> four qualities -> everyday moments -> Kit -> invitation -> short answer. Existing illustrated cards/path and Kit components are reused.
- Our Thinking: approved report-card message, perspective, contextual quality descriptions, home/school/others examples, personal-progress answer, Kit feature and invitation. Expandable Kit examples/reflections remain intact.
- About: approved purpose, principle descriptions, four timeline stages, conversation message and invitation; existing collage retained. Added the why-kyro-exists anchor for the homepage CTA.
- Home Leadership Kit: approved hero, how-to steps, collection introduction, spotlight wording, tracker, resource invitation and CTA copy. All 12 activity records, filtering, detailed instructions, protected request/download flow and private PDF remain unchanged. Removed obsolete six-page references from associated captions.
- Help Shape: approved hero, listening/audience copy, conversation introduction, four questions, optional-contact and confirmation headings, exploration prompts and footer CTA. Kept /help-shape-polaris and the Stage 06C illustrated single-page form.
- Metadata: five exact document titles use absolute metadata to avoid the root title template adding duplicate branding; approved descriptions applied. No robots/noindex, canonical, hosting or deployment configuration changes. Existing header/footer copy already matches the shared document and was preserved.

## Four-response contract - backend stage REQUIRED before deployment

POST /api/feedback gains one optional string property: **earlierLifeSkill**. The UI's four answers map as follows:

| Order | Question | Payload key |
| --- | --- | --- |
| 1 | What is one skill or quality you wish you had practised earlier in life? | earlierLifeSkill (new) |
| 2 | What challenges do you see children facing as they grow? | challenges (existing) |
| 3 | What activities or resources would help? | resources (existing) |
| 4 | What should Kyro understand before building something new? | suggestions (existing) |

The new additional/fourth response property is earlierLifeSkill, although it appears first in visual reading order. The fourth displayed question still uses suggestions. The frontend sends all four trimmed strings, including empty strings for unanswered questions. At least one response must have ten Unicode letters/digits, matching the existing meaningful-response heuristic. Each answer retains an 8,000-character safety bound; individual questions have no required/minLength/maxLength HTML constraints or character counters. Eligibility, privacy acknowledgement, contact-consent independence, Turnstile, notices and submission-ID handling are preserved.

The current backend allowlist rejects earlierLifeSkill; it also validates meaningful content against only the old three answers. Do not deploy this frontend ahead of compatible backend support. No real persistence was tested or claimed during this stage.

Required next-stage backend work:
1. Add earlierLifeSkill to the feedback-only allowlist, string/type/trim/length normalization and meaningful-response validation across all four fields. Retain request size cap, strict versions, adult/privacy enforcement, Turnstile, origins and rate limiting.
2. Preserve compatibility with old clients that omit the field. Preserve normalized legacy payload shape/hashes when the new key is absent so retries from existing tabs do not become conflicts. Include the new value in the normalized hash when present; changed answers must still conflict and identical retries must reuse the same row.
3. Proposed Sheet migration: append column N, header Earlier Life Skill, to the existing **Website Feedback** worksheet. Keep columns A-M and their meanings intact (M is existing consent/privacy metadata). Do not rename the worksheet, move rows, reset allocation or change Kit Requests.
4. Update feedback table width from 13 to 14, write A:N and verify updatedColumns=14. Append earlierLifeSkill after the current metadata cell. Preserve submission IDs in column A, fixed-row allocation, metadata and duplicate detection. Coordinate the header/schema migration with the operator; verify legacy accepted/pending records and retries.
5. Add focused server/Sheet mocks for new-only, each old-only, empty, invalid-type, oversized and mismatched-version cases, concurrent retries and intentional new IDs. Deploy backend compatibility first, then this frontend, without changing production flags in this stage.

## Content conflicts and deliberate exceptions

- **Age conflict:** document page 5 specifies 5-10 / 11-14 for Three-part day. The existing activities.json and verified eight-page Kit (page 3) specify 5-8 / 9-14. Retained 5-8 / 9-14 in the spotlight and did not change either resource. Founder approval is needed to reconcile these bands. Overall 5-14 guidance agrees across sources.
- **Homepage hierarchy:** user explicitly retained Beyond the Marks as H1; The lessons we wish we'd learned sooner. is supporting copy, rather than replacing H1 as the document composition suggests.
- **Route:** document page 6 suggests /help-shape-kyro-learning; retained /help-shape-polaris as instructed.
- **Privacy wording:** document page 6 shortens the acknowledgement to I have read.... Retained the existing approved I acknowledge that I have read... wording and version because this stage preserves compliance controls/policies and supplies no replacement consent identifier. Likewise, email remains required only when optional contact permission is selected. No policy or consent registry was modified.
- Private Kit still has eight pages and SHA-256 69dda4c82161de29300c8212d82aef9f078be8ca084e475ef730fd6c1ed955da. No PDF or preview was regenerated or moved into public assets.

## Files changed

- src/app/about/page.tsx
- src/app/help-shape-polaris/page.tsx
- src/app/home-leadership-kit/page.tsx
- src/app/our-thinking/page.tsx
- src/app/page.tsx
- src/components/brand/kit-illustration.tsx
- src/components/feedback/feedback-form.module.css
- src/components/feedback/feedback-form.tsx
- src/components/pages/activity-explorer.tsx
- src/components/pages/editorial-heroes.tsx
- src/components/pages/quality-cards.tsx
- src/components/ui/website.tsx
- tests/e2e/design-closure.spec.ts
- tests/e2e/form-compliance.spec.ts
- tests/e2e/form-submission.spec.ts
- tests/e2e/kyro-kit.spec.ts
- tests/e2e/website.spec.ts
- src/content/website-copy.ts (new approved metadata and question definitions)
- tests/e2e/stage-07a-content.spec.ts (new focused local mocks and responsive checks)
- docs/implementation/kyro-stage-07a-content-design.md (this report)

Existing test selector/expected-copy edits track the approved labels; no security assertion was relaxed.

## Verification

TypeScript validation and targeted ESLint on all modified TypeScript/TSX files passed. The four-response mock case passed, covering each answer individually, all-empty rejection, adult/privacy enforcement, consent ordering, retry IDs and new IDs. Focused axe scanning of the four-question form at 320px found zero WCAG 2/2.1 A/AA violations. The initial aggregate visual case hit its cumulative two-minute timeout; it was split into per-page cases. The five per-page cases passed, checking exact metadata and horizontal overflow at 1440, 390 and 320px. Thinking/About visual captures were additionally rerun with offscreen images decoded before capture, confirming the existing photography/collage loaded rather than photographing lazy-loading placeholders. No backend or full historical browser suites were run. Harness: node scripts/test-forms-local.mjs tests/e2e/stage-07a-content.spec.ts. This uses an isolated temporary local copy with synthetic verification and mocked responses; it does not change the real environment configuration or send production submissions. Responsive artifacts are under ignored qa-artifacts/stage07a/. No backend tests or historical full-browser suite are in scope.

Local implementation only: no commit, push, deployment, backend edits, Sheet operations, credentials or Cloudflare/DNS/Access changes.
