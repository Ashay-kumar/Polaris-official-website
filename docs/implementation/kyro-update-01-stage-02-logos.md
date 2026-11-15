# Kyro Learning Update 01 — Stage 02 responsive logos

Date: 13 November 2026. Local implementation only; no commit, push or deployment.

## Repository safety

Started on feature/polaris-cloudflare-pages at a0c5c99 with only the untracked Stage 01 audit. Recorded all 484 existing file hashes in ignored tmp/kyro-update-01/preflight.json. Fetched current main with authorization; its source tree was identical to the previous branch. Created feature/kyro-update-01 from origin/main at cf536925fb8787dbd104449556163e332b385b1f. No work was discarded. Git metadata writes required execution approval; no persistent configuration change was made. Audit remains byte-identical and uncommitted.

## Implementation and exact files

| File | Change |
| --- | --- |
| src/components/brand/polaris-logo.tsx | Shared horizontal presentation frame around the original image; unchanged alt text/asset selection; other variants retain original behavior |
| src/components/brand/polaris-logo.module.css | New frame geometry, proportional positioning and transparent-canvas removal |
| src/components/layout/site-header.tsx | 220px header logo and responsive class |
| src/components/layout/site-footer.tsx | 240px footer logo |
| src/components/brand/kit-illustration.tsx | 160px booklet logo, inherited by all four placements |
| src/styles/website.module.css | 175px header below 800px; equal shared kit columns at 680–799px, stacking below 680px |
| tests/e2e/logo-sizing.spec.ts | Twelve tests for rendered sizes, navigation, all shared consumers, visible ink and preservation of every nontransparent SVG pixel |
| docs/implementation/kyro-update-01-stage-02-logos.md | This report |

Stage 01 audit was preserved, not edited. No new artwork, image asset or logo variant was generated.

## Non-destructive whitespace treatment

Approved horizontal SVG remains byte-for-byte unchanged: 1982×794 canvas. The shared frame shows x200/y64/width1280/height672 of that canvas, retaining transparent edge gutters around every visible pixel. The underlying image is scaled uniformly, with its original aspect ratio; only excess transparent canvas falls outside the presentation frame. This is reversible CSS framing, not path editing, recolouring, stretching or content clipping. Source and presentation-frame aspect ratios differ because the original canvas includes asymmetric empty margins; the actual artwork proportions do not change.

All horizontal UI instances use this same treatment. Nonhorizontal variants, v2.0 asset registry, symbol/favicon and brand manifests remain unchanged. The pixel test checks the entire original raster at native dimensions, including low-alpha edge pixels, and asserts none lies outside the frame. Runtime screenshot tests also confirm ink fills over 95% of the header frame, with visible edge gutters.

## Before / after

Approximate visible artwork widths follow native measured ink bounds and were checked against actual browser screenshots, rather than CSS attributes alone.

| Placement | Before box / artwork | After box / artwork |
| --- | --- | --- |
| Desktop header | 156px / ~98px | 220px / ~214px |
| Mobile header | 156px / ~98px | 175px / ~170px |
| Footer | 156px / ~98px | 240px / ~233px |
| Illustrated kit | 125px / ~78px | 160px / ~156px |

Header/footer update every page. Kit component updates Home and Our Thinking shared kit features, kit-page hero and kit download section. Embedded branding in PDF/previews/legacy images was not changed.

## Responsive visual QA

Reviewed actual before/after header, footer and booklet captures at 1440/1024/768/390/320. Desktop/tablet navigation fits; mobile menu and 320px footer remain usable. Header height grows naturally with the logo; no fixed-height clipping was introduced. Larger typography, brand colour tokens, illustration geometry and navigation destinations remain unchanged.

Initial tests found booklet shrinkage to 136–149px in shared kit sections at 768/799px. Equal columns at 680–799px and stacking below 680px resolve this without changing the rest of the page layout. Header/navigation breakpoints remain unchanged. Additional boundary tests cover 1101/1100, 800/799 and 680/679px.

Local evidence: qa-artifacts/kyro-update-01/stage-02/review.html, with preserved before/after captures and metrics.json per phase. These ignored QA files are local review artifacts, not production assets. Existing Playwright screenshots remain under test-results/visual/.

## Verification

- Production static build: passed.
- TypeScript: passed.
- ESLint: passed, zero warnings.
- Foundation validation: passed unchanged, including original assets/tokens/fonts/PDF.
- Static export integrity: passed for five routes/resources.
- Pinned brand verification: passed, 42 files.
- Full browser result: 30/30 Playwright tests passed (3.2 minutes), including twelve new logo checks at eleven widths, all existing route/form/resource regressions and focused axe/keyboard checks..
- Preservation: only five intended pre-existing files changed; all other 479 files in the preflight snapshot retain their hashes, including audit, all approved assets, forms, PDFs and backend/privacy documentation. New files are limited to the CSS Module, test and this report.

No form/backend/privacy implementation was changed. Existing form behavior is exercised only for regression. Automated accessibility checks supplement keyboard/visual review; no new real-device or screen-reader certification is claimed.

## Remaining limitations

The frame is deliberately tied to the current approved v2.0 horizontal geometry. Future artwork updates must remeasure bounds and rerun the retention test; do not blindly reuse offsets. Header occupies more vertical space as a direct consequence of the requested enlargement. This task does not revise existing six-page-source captions, PDFs, privacy notices or submission safeguards. Final designer review of the enlarged presentation is still appropriate.