# Polaris asset manifest — Stage 02

The machine-readable inventory is `asset-inventory.json`: all 75 original files under `design-references/` and `public/images/`, including dimensions, formats, byte lengths and SHA-256. Existing paths and bytes are preserved. No screenshots are used as page backgrounds.

| Page | Desktop reference | Mobile reference |
| --- | --- | --- |
| Home | `01-home/home-desktop-approved.png` | `01-home/home-mobile-approved.png` |
| Our Thinking | `02-our-thinking/our-thinking-desktop-approved.png` | `02-our-thinking/our-thinking-mobile-approved.png` |
| Home Leadership Kit | `03-home-leadership-kit/home-leadership-kit-desktop-approved.png` | `03-home-leadership-kit/home-leadership-kit-mobile-approved.png.png` |
| Help Shape Polaris | `04-help-shape-polaris/help-shape-polaris-desktop-approved.png` | `04-help-shape-polaris/help-shape-polaris-mobile-approved.png` |
| About | `05-about/about-desktop-approved.png` | `05-about/about-mobile-approved.png.png` |

Paths above are relative to `design-references/`. At the start of Stage 02, both kit mobile and About mobile were present with the actual `.png.png` names shown above, and the current supplied hash inventory already recorded them. There are ten PNG references. Proposed later normalisation: remove the extra `.png` suffix from those two filenames after checking references. No rename has been performed.

Home mobile is a three-panel storyboard and differs from desktop in content/structure. Stage 02 implements its consecutive vertical flow while retaining all seven required narrative sections. About mobile contains corrupted text/navigation; those errors are not reproduced. Mockup star-style logos differ from the actual approved production logo, so the canonical integrated logo is used. Founder review of provisional copy remains required; see `content-review.md`.

| Image folder | JPEGs | SVGs | Status |
| --- | ---: | ---: | --- |
| `home` | 8 | 9 | Photography approval/provenance undocumented; small source sizes |
| `our-thinking` | 8 | 1 | Generated-composite photo crops; provisional |
| `home-leadership-kit` | 5 | 7 | Photos explicitly provisional; cover is conceptual |
| `help-shape-polaris` | 3 | 11 | Photos explicitly provisional; illustration controls are not UI |
| `about` | 0 | 9 | Missing final hero, walking-child and community photography |

Total: 24 JPEGs and 37 SVGs, plus four asset READMEs. Shared home paths, rays and star are referenced rather than duplicated. No byte-identical duplicates were identified in preflight. Existing SVGs parsed successfully in preflight; the kit cover embeds an SVG symbol and uses live text, so it is not the original PDF or an approved standalone logo. Stage 02 browser coverage is recorded separately in its completion report.

Photography remains unchanged. Large uses require approved high-resolution originals. Do not infer release approval from filenames or assume the existing images are suitable for large heroes.

## Founder content

The supplied local kit candidate is `founder-supplied/Polaris_Home_Leadership_Kit.pdf` (13,123 bytes). Its six page objects and six decoded content streams contain the kit introduction, twelve numbered activities across four qualities, age-specific guidance and the four-week tracker. Tracker headings match the supplied asset notes: Week; Quality and activity; What I noticed; What to try next.

SHA-256: `0a39023cb7a555de06cee6abe39a0b10f0d14407b5d42e478b6c91f8c770bbf5`.

The user explicitly confirmed this file is the approved original on 11 November 2026. It was copied unchanged to `public/downloads/polaris-home-leadership-kit.pdf`, with source/destination SHA-256 equality verified. No PDF content has been rewritten. A standalone approved tracker download and final website copy are not supplied. Do not infer that activities or claims in the PDF are independently verified research findings.

## Open decisions for the next stage

Hosting/runtime, feedback storage/delivery, recipient ownership, privacy/retention, separate follow-up consent wording, spam controls, authoritative copy and final image approval remain unresolved. Stage 01 provides no feedback endpoint, service, credentials, consent wording or submission success state.

## Stage 03 derived assets

- Faithful PDF raster previews: `public/images/home-leadership-kit/previews/page-1.png`, `page-2.png`, `page-6.png`, each 1125×1591. Rendered with Windows.Data.Pdf from the unchanged user-confirmed original. The full page canvas is preserved; preview links open the corresponding original PDF page. Source and output hashes are in `stage-03-derived-assets.json`.
- App Router icons: `src/app/icon.svg` (byte-identical approved Ink/Ivory icon), `favicon.ico` (16/32/48px PNG frames) and `apple-icon.png` (180×180). Source artwork is `public/brand/logos/v1.1/svg/polaris-icon-primary.svg`; no geometry, fills or proportions were changed.
- These generated files supplement the 75-file preservation baseline. No original image, logo, PDF or reference file was replaced.
