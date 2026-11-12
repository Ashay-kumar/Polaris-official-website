> Historical Stage 06 record. Stage 06.1 supersedes its form copy/phone contract; see stage-06.1-refinement.md and forms-backend-handoff.md.

# Stage 06 - final design and frontend closure

Completed locally, 11 November 2026. Base: feature/polaris-cloudflare-pages at 89cbb5d1ed84a48ff0f0477789a39fb654c9e1bb, clean working tree. Cloudflare PR #2 was verified open/unmerged at that same SHA. No branch switch, staging, commit, push, merge, deployment, repository settings change or brand-source write was performed.

## A. Files and architecture

Updated app/layout, the kit page, shared marketing ButtonLink/KitCover, site header, editorial heroes/CSS, shared website CSS, feedback form, existing browser tests and review/backend documents. Added KitIllustration/CSS, KitAccessProvider/dialog/CSS, shared phone syntax validation and design-closure browser tests. No dependencies were added. next.config.ts, package/lockfile, Cloudflare validation workflow, public assets, approved references and all imported brand sources/tokens remain unchanged.

## B. Page changes

- Home: retain Beyond the Marks, four authoritative qualities and all seven sections. Remove the floating hero star, tighten the photographic blue backing and bring the path closer to the exploratory composition. Share Your Perspective has no directional icon.
- Our Thinking: larger report card becomes the defining editorial object beside the headline; smaller human image and a quiet annotation replace the extra rotated frame. Seven sections and native quality disclosures remain.
- Kit: family image plus a tangible booklet/card/tracker CSS composition replaces raw PDF thumbnails in the hero and shared kit features. Approved logo, actual four qualities/count/ages and a real activity title are used. It is explicitly labelled an illustration, not the original cover. All twelve activities, filter/details, tracker and PDF bytes remain unchanged. Resource entry points open the shared dialog.
- Help Shape: speech prompts follow a responsive grid around the human image rather than scattered absolute placements. Existing questions/audience flow is preserved; optional international phone is added in step four and review.
- About: retain the asymmetric editorial collage and six-section narrative; use existing togetherness imagery instead of repeating the Our Thinking portrait. Reduce star/frame/path clutter and keep the illustrative/non-participant context.

## C. Global refinement

Consistent card corners, calmer frame angles, closer path/subject relationships, controlled booklet spacing and mobile stacking. All original sections remain. Only Share Your Perspective directional arrows were removed; unrelated CTA arrows remain. No new brand colours, fonts, logos or motion package were introduced. Static transformations respect the existing reduced-motion setup (no new animated sequence).

## D. Shared kit dialog

Native modal dialog with accessible name/description, labelled full name/email (required), optional international phone, inline errors/summary focus, Escape/close, Tab containment, opener focus restoration, background scroll lock and small-screen internal scrolling. The close row stays available during scroll. Details reset on close. Optional communications consent starts unchecked, separate from requesting the kit; wording is clearly a draft.

Check details is local validation only. The final capture/download action remains disabled even when valid. No success receipt, API, analytics event, browser storage, URL payload or email delivery is created. There is no approved privacy notice URL to link. The intended future flow is verified durable capture followed by immediate original PDF download; see kit-lead-backend-contract.md. The public PDF URL remains accessible without the modal, which is not technical access protection.

## E. Feedback phone

Optional type=tel/inputMode=tel/autocomplete=tel with country-code guidance, shared syntax validation, 40-character display limit and + international prefix with 7-15 digits. Formatting spaces/parentheses/dots/hyphens are accepted. This is not number ownership verification. Back/Next preserves phone; review includes it. Existing separate follow-up consent stays unchecked and still requires email when selected. Future payload is documented; no transport or persistence is enabled.

## F-G. Verification

- Production static build, TypeScript and ESLint passed. Cloudflare domain-root export/integrity passed; no hosting changes or package installs.
- Brand integrity: all 29 approved imports, 75 preserved original assets, 329 tokens, official logos/fonts passed. Original twelve activity fields/PDF and icon/preview checks passed.
- Fifteen distinct Playwright checks were exercised in one full run followed by targeted corrections/rechecks. Final passing coverage includes every route at 1440, 1024, 768, 390 and 320px, no horizontal overflow/broken images/page errors, navigation/menu/Escape, disclosures, all twelve activity details, feedback and phone, skip link/reduced motion, root fonts/CSS/resources, original PDF checksum and icons.
- New dialog tests run all five widths: focus trap/restore, Escape/close, required/optional field syntax, unchecked consent, reset on close, scrolling and disabled capture. No non-GET request, download or local/sessionStorage write occurs in that exercise.
- Axe page scans at desktop/mobile, feedback contact/review and dialog states report zero violations under the selected WCAG tags. This does not certify every browser, device or assistive technology.
- Initial QA caught a one-pixel booklet overflow at 320px and clipped desktop caption. Both were corrected and the affected viewport/dialog checks passed. No repeated full matrix was run for small final polish.

## H. Visual evidence

Open ../qa-artifacts/stage-06/review.html for before/after hero pairs and links to full pages. before and after contain all five full pages plus isolated heroes at 1440 and 390px. after also contains illustrated-kit images, modal top/validation views at desktop/mobile/narrow sizes and feedback-contact-390.png. Full-page overview sheets show section rhythm across all five pages. These files are ignored local QA artifacts, not public assets or page backgrounds. Contact examples are fictional.

Desktop/mobile hero images, full-page overview sheets, kit illustration, modal and contact-step screenshots were visually inspected. The final structure is differentiated without rebuilding: manifesto/photo/path, report-card editorial, physical kit/family, conversational prompts and human collage. No mockup is claimed to be pixel-perfect.

## I. Asset and visual review items

The kit illustration is a faithful CSS editorial packaging concept, not commissioned bespoke artwork or a facsimile of the PDF. It is ready for designer review; approve this treatment rather than implying an approved new physical product. Photographs remain existing provisional/composite crops, not production-approved subjects or verified participants. No new photos were fetched/generated/cropped. The Help hero's yellow rays are baked into its provisional image and require a clean original to remove. Native resolution is respected, but source detail cannot be recovered.

Production replacement list: Home exploration (894x308); Our Thinking thoughtful child (526x252) and progress (311x206); Kit parent/child (362x207); Help welcoming portrait (342x251); About togetherness (423x206), family (359x250) and conversation collage. Other existing section crops remain subject to stage-03-photography.md/photography-replacement-list.md. The About hero now uses our-thinking/our-thinking-togetherness.jpg, so its earlier Stage 03 hero source entry is superseded.

## J. Dependencies before launch

Approve final copy, photograph rights/selection and replacement crops; approve actual privacy notice, purposes/consent/retention and backend ownership; implement secure real lead capture and feedback separately; verify success/failure/abuse handling; complete approved Cloudflare connection/deployment and real-device/screen-reader/pre-launch checks. Collection stays disabled until these are approved. No hosting or backend service was provisioned.

## K. Sign-off recommendation

Ready for final designer review and conditional DESIGN SIGN-OFF of the frontend layouts and interactions. No known content-overlap, horizontal-overflow or section-completeness defect remains at the tested widths. Designer approval of the CSS kit concept and provisional image placements is still required; formal sign-off belongs to the designer/founder. Production photographs and approved privacy/consent copy are separate asset/content gates. Backend, hosting and broader pre-launch verification remain launch dependencies, not unfinished page structure. Do not treat this assessment as public-launch approval.

## Local changed-file inventory

- docs/content-review.md
- docs/feedback-backend-contract.md
- src/app/home-leadership-kit/page.tsx
- src/app/layout.tsx
- src/components/feedback/feedback-form.tsx
- src/components/layout/site-header.tsx
- src/components/pages/editorial-heroes.module.css
- src/components/pages/editorial-heroes.tsx
- src/components/ui/website.tsx
- src/styles/website.module.css
- tests/e2e/website.spec.ts
- docs/kit-lead-backend-contract.md
- docs/stage-06-design-closure.md
- src/components/brand/kit-illustration.module.css
- src/components/brand/kit-illustration.tsx
- src/components/feedback/kit-access.module.css
- src/components/feedback/kit-access.tsx
- src/lib/phone.ts
- tests/e2e/design-closure.spec.ts
