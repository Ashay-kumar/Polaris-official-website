# Stage 03 creative refinement and verification

Completed locally, 11 November 2026. Existing preview: `http://localhost:3002`. No framework rebuild/reinitialisation, dependency changes, brand-token changes, source-repository modification, commit, push or deployment. The application production build was run for verification only.

## A. Files modified and added

Modified: all five route entry points under `src/app/`; root `layout.tsx` icon metadata; `src/components/ui/website.tsx` shared kit preview; local kit-preview sizing in `src/styles/website.module.css`; existing browser regression tests; asset/content-review documentation.

Added:

- `src/components/pages/editorial-heroes.tsx` and `.module.css`: five distinct server-rendered heroes, personal-progress art and conversation collage.
- `src/components/brand/kit-document-preview.tsx` and `.module.css`: real PDF page thumbnails with original-document links.
- `src/content/kit-previews.json`: verified output dimensions and hashes.
- `src/app/favicon.ico`, `icon.svg`, `apple-icon.png`.
- Three PNGs in `public/images/home-leadership-kit/previews/`.
- `scripts/render-kit-previews.ps1`, `generate-stage-03-assets.mjs`, `check-stage-03-assets.mjs`.
- `tests/e2e/brand-assets.spec.ts`.
- `docs/stage-03-asset-provenance.md`, `stage-03-derived-assets.json`, `stage-03-photography.md` and this report.

Original assets, mockups, the conceptual cover SVG, all twelve activities, typography/font files, logos and generated brand-token files remain intact. No feedback logic was changed.

## B. Homepage hero

Retained Beyond the Marks, current supporting copy and both CTA destinations. Replaced the repeated oval treatment with an Ivory editorial composition: oversized headline, native-resolution telescope image, responsive Blue framing, Lime star, Pink winding path and an authoritative four-quality rail. Communication, Leadership, Curiosity and Resilience remain unchanged.

The headline and photograph have separate space on desktop; all five tested viewport widths include an explicit non-overlap assertion. Mobile reconstructs the sequence as headline, message/actions, exploration image, path and quality names. All seven original narrative sections remain.

## C. Secondary heroes and underdeveloped sections

| Page | Refined direction | Visual QA findings |
| --- | --- | --- |
| Our Thinking | Wide editorial headline on Blue; prominent fictional report card; asymmetric text and human-image arrangement | Caption clearly identifies illustration/non-assessment. Native image and card remain visible on mobile. Personal progress now has a framed image, reflection note and path, replacing the unbalanced empty area. |
| Home Leadership Kit | Ivory/Peach family scene with taped photo and actual PDF pages | Explore/Download remain prominent. Real introduction and communication-page previews replace invented-looking covers. All seven sections, twelve activities, filters, source details and tracker remain. |
| Help Shape Polaris | Expressive typography, staggered conversation bubbles and a welcoming rectangular photographic frame | Prompts connect to the feedback journey. No overlapping oval motif. All four steps, validation, unchecked follow-up consent and disabled real submission remain unchanged. |
| About | Oversized asymmetric headline, overlapping photographic frames and intentional negative space | Core message and six-section narrative preserved. Built Through Conversations now has a layered three-frame collage, shared path artwork and an explicit illustrative-image caption. |

Screenshot review corrected a Home headline/photo collision, an initially clipped decorative path and 2px of About mobile overflow from a decorative pseudo-element. Final screenshots confirm the corrections rather than relying only on compilation.

## D. Authentic kit previews

Rendered complete pages 1, 2 and 6 directly through Windows.Data.Pdf; visually inspected all three. Measured output: 1125×1591 each, approximately 119KB / 122KB / 94KB before Next image optimisation. Original page geometry, wording, colours, instructions and footer disclaimers remain intact. No pages were fabricated or PDF content edited.

The shared kit feature displays page 1. The kit hero layers pages 1 and 2 with the family photo. The lower kit download section displays page 6. Each document preview opens the matching page of the original PDF. The original download hash remains `0a39023cb7a555de06cee6abe39a0b10f0d14407b5d42e478b6c91f8c770bbf5`.

The conceptual cover asset remains in the library, but active kit-preview components no longer render it. See asset provenance and the derived-file hash manifest.

## E. Favicons

Chosen artwork: approved `polaris-icon-primary.svg`, with Ivory artwork on its original Ink square. Compared with the transparent coloured symbol, it gives more consistent small-size contrast on light and dark browser surfaces. No redraw, recolour, distortion, crop or source alteration.

- `/icon.svg`: exact approved SVG bytes.
- `/favicon.ico`: 16/32/48px frames.
- `/apple-icon.png`: 180×180.
- All three routes return HTTP 200 with appropriate image MIME types. Browser metadata references are verified for light and dark colour schemes.
- ICO frame dimensions and generated artwork are checked; Apple dimensions are checked; original SVG equality is checked.
- Native-size review sheet at `qa-artifacts/stage-03/icons/light-dark-review.png` covers 16, 24, 32, 48, 64 and 180px on Ivory and Ink. The silhouette stays recognisable; fine detail is necessarily reduced at 16px. No unauthorised optical simplification was introduced.

## F. Responsive and visual QA

Installed Chrome via the existing Playwright infrastructure: 1440, 1024, 768, 390 and 320px on all five routes. All 25 route/viewport combinations pass: HTTP response, one H1, no horizontal document overflow, no broken decoded image and no uncaught page error.

Captured full-page and isolated hero screenshots at 1440 and 390px for every page; all ten final hero screenshots were visually inspected. Saved 20 images in `qa-artifacts/stage-03/visual/`, using names such as `home-1440.png` and `home-390-hero.png`. No image is presented as proof of pixel-perfect fidelity; this stage intentionally differentiates the compositions from the repeated Stage 02 layout.

No desktop section is removed for mobile. Responsive variants stack/rearrange collage pieces, keep CTA labels readable and avoid shrinking entire desktop layouts into one tiny image. Photos retain their native-resolution limits; document previews are real thumbnails linked to full PDF pages.

## G. Verification results

- Production build: passed; five page routes plus generated icon routes.
- TypeScript: passed.
- ESLint: passed with zero warnings.
- Foundation check: passed for 29 approved imports, all 75 baseline files, fonts, logo variants and tokens.
- Source-content check: all twelve activity names, durations, instructions, rationales and age adaptations match the unchanged PDF.
- Derived-asset check: passed for source hashes, three page previews, SVG identity, Apple icon and ICO frames.
- Full production Playwright suite: **11 passed**, including the existing functional regressions and new icon/preview checks.
- Axe page scans at desktop/mobile and feedback-review state: zero reported violations under the selected WCAG tags.
- Native PDF download, filename, MIME, bytes and internal links: passed.
- Navigation, Escape/focus return, keyboard disclosure, activity selection/details, error focus, answer preservation, separate unchecked consent, unavailable submission, reduced motion and skip-link: passed.

This is automated Chromium/keyboard coverage, not full WCAG certification or Firefox/WebKit/real-device certification. Feedback remains local only; no endpoint, storage or mock successful submission was added.

## H. Missing production imagery

Page-by-page sources, exact dimensions and replacement requirements are in `stage-03-photography.md`. All current hero/collage photos are existing provisional or approval-undocumented assets. Dedicated high-resolution Home exploration, thoughtful-child, parent/child activity, welcoming conversation and About editorial photos remain production inputs. No unlicensed imagery was fetched, and no mockup-photo crops were created in this stage.

## I. Designer review still needed

Approve final photo selection, rights and contextual crops. The thoughtful-child image is still shared by Our Thinking and About until distinct About photography is available. Review the path trajectory and final spacing with the replacement images. Approve the document-thumbnail framing with the original PDF's own legacy colours/typography preserved. Review favicon optical detail on actual small browser tabs and iOS devices; any simplified small-size artwork requires separate approval.

New short visual prompts/captions remain provisional in `content-review.md`; no research findings, testimonials, biographies, history or participant claims were introduced.

## J. Next steps and safeguards

Review the desktop/mobile screenshots, approve photography/copy and perform broader real-device/assistive-technology QA before launch. Hosting/privacy/backend decisions remain unchanged from Stage 02; do not enable feedback until a real approved operation and success receipt exist. Run instructions remain in `local-development.md`; this stage adds no setup dependency.

The existing `localhost:3002` development preview is preserved. The owned loopback production QA server on 4173 is stopped after checks. Branch remains main at `8176f30d8f73ec4e04fcdfd2662fa6e0b5f7f5eb`. No staging, commit, push, branch switch, destructive cleanup, Cloudflare action or deployment was performed. Approved source-brand file hashes are unchanged.
