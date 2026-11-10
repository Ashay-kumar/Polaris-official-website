# Stage 03 derived asset provenance

The approved brand source remains `0328f77f90b31a7478866c9af11a3fd69b02ec24`. The source brand repository, logo exports, token files and fonts are unchanged. No dependency or package version was changed.

## Favicons

Selected source: `public/brand/logos/v1.1/svg/polaris-icon-primary.svg`, the official 700×700 Ink-background/Ivory-artwork icon. Its full canvas, original padding, transparent corners and proportions are retained. The coloured primary symbol was also inspected; the official square icon gives a consistent high-contrast presentation on light and dark browser chrome.

- `src/app/icon.svg`: exact byte copy of the approved source.
- `src/app/favicon.ico`: PNG-compressed 16×16, 32×32 and 48×48 frames in an ICO container.
- `src/app/apple-icon.png`: 180×180 raster of the same full canvas.
- Root metadata explicitly references the icon formats; App Router file conventions serve the files on every page.

Generation uses the already-installed Sharp dependency through `node scripts/generate-stage-03-assets.mjs`. No redraw, recolouring, cropping or distortion is applied. The script also creates a native-size 16/24/32/48/64/180px review sheet on Ivory and Ink at `qa-artifacts/stage-03/icons/light-dark-review.png`. At 16px fine internal details are necessarily small; the cap/path silhouette remains identifiable and high-contrast. Further optical simplification would require separately approved artwork and was not attempted.

## PDF previews

Source: `public/downloads/polaris-home-leadership-kit.pdf`, SHA-256 `0a39023cb7a555de06cee6abe39a0b10f0d14407b5d42e478b6c91f8c770bbf5`, user-confirmed original six-page guide. Native Windows.Data.Pdf rendered complete pages 1, 2 and 6. All three images were visually inspected against the source content, including page titles, activities, tracker headings and footer disclaimers.

`scripts/render-kit-previews.ps1` renders to `public/images/home-leadership-kit/previews/`. The native renderer returns 1125×1591 output on this Windows display/runtime for a requested destination width of 900; the actual measured output dimensions are used in the website. Page geometry and original content remain intact. No PDF was authored or edited, so no PDF-creation operation was performed.

Rendering on this Windows host without changing execution policy:

```powershell
& ([scriptblock]::Create((Get-Content -LiteralPath scripts/render-kit-previews.ps1 -Raw)))
node scripts/generate-stage-03-assets.mjs
node scripts/check-stage-03-assets.mjs
```

Generated metadata and hashes: `src/content/kit-previews.json` and `docs/stage-03-derived-assets.json`. The original PDF's internal colours are retained within the document previews, not adopted as website brand tokens. All preview images link to the unchanged PDF; none is a mockup crop or fabricated page.

Run `npm.cmd run check:foundation` and `npm.cmd run check:content` alongside the Stage 03 asset check to verify preservation of all original assets and all twelve activities.
