# Polaris website brand provenance

Stage 01, 10 November 2026.

## Approved source

- Repository: https://github.com/mridulavdass-bit/polaris-brand-design-system
- Approved commit: `0328f77f90b31a7478866c9af11a3fd69b02ec24`.
- Local source: `<brand-system-checkout>`.
- Commit, tree and imported blob objects were read directly from the local Git object database, including packed objects, and SHA-1 verified. No checkout, branch change or write was made to the source repository.
- `brand-files.json` records every imported source path, Git blob ID, source SHA-256, destination SHA-256 and adaptation flag. Imported files come from the approved commit, not the later working-tree HEAD.

## Reuse scope

The website imports the approved colour, typography, spacing and visual foundation TypeScript sources and their generated CSS, plus button source/tokens and form/card tokens. Colour values, font metrics, spacing, responsive breakpoints, borders, radii and motion values remain unchanged. Do not edit generated tokens independently of their approved source.

Curious Pop bases: Blue `#245CFF`, Pink `#E93C8D`, Lime `#C8EE56`, Peach `#FFB78A`, Ink `#19253D`, Ivory `#FFFDF7`. Semantic and functional derivatives remain intact. Pink is not a general-purpose normal-text colour on Ivory; Lime and Peach are not sufficient essential indicators on Ivory. Use semantic text/focus roles and test the actual surface pairing.

The exact icon adapter is in `src/components/brand/polaris-icon.tsx`. Import individual context-free Phosphor SSR icons at the call site. Do not pass icon component functions across server/client boundaries. Decorative icons are hidden from assistive technology; meaningful icons require labels.

Button and native action-link components retain their original behaviour. Only imports were changed to website paths. Their CSS import path was adjusted; approved values were preserved. The documentation shell, specimen pages, product-pattern demos, deployment configuration and documentation application metadata were not imported. Form/card foundations here are tokens, not a completed form or card library.

Website additions: a typed logo path manifest/wrapper, a responsive container, root font loading, global reset/focus styles, CSS Module support and a non-indexable foundation placeholder. These additions do not represent approved marketing-page copy or completed website designs.

## Logos

All twelve active SVG/PNG files from `public/brand/logos/v1.1/` were copied byte-for-byte. Variants: primary, horizontal, monochrome Ink, reversed, symbol and icon. No historical or alternative logo exports were imported. Do not redraw, recolour, crop or distort them. Reversed artwork requires a dark surface. Source clear-space, minimum-size, cross-export geometry and small-size/framing review remain outstanding technical checks; asset approval does not settle these usage questions.

## Fonts and licences

DM Serif Display 400 and Source Sans 3 400/600/700 Latin normal WOFF2 files are self-hosted in `src/styles/fonts/`, loaded with `next/font/local` and `display: swap`. They come from the exact Fontsource packages used by the approved source: `5.3.0` and `5.3.1`. Local asset hashes and package origins are recorded in `local-assets.json`.

- DM Serif Display and Source Sans 3: SIL Open Font License 1.1. Preserve the full font copyright/OFL notices in `public/licenses/dm-serif-display-OFL.txt` and `public/licenses/source-sans-3-OFL.txt` when redistributing fonts; do not claim exclusive ownership or sell the fonts by themselves.
- Phosphor React icons 2.1.10: MIT; full notice retained at `public/licenses/phosphor-icons-react-LICENSE.txt`. Visible per-icon attribution is not required by that licence.
- Polaris logos and custom brand materials are user-supplied brand assets, reused for this authorised website. No general public redistribution licence is asserted.

## Verification and update policy

Run `npm.cmd run check:foundation` to verify imported hashes, preserved original files, token references, local fonts, logo paths and the kit file if present. Recheck provenance before any future brand update. Package versions use the approved baseline and a website-specific lockfile; no source node_modules directory is linked or reused.
