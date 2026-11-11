Prepare the existing five-page static preview for Cloudflare Pages at the domain root, replacing the GitHub Pages repository-subpath build. PR #1 was already merged and closed before this task; this focused follow-up is opened with explicit authorization.

## Changes

- npm run build now uses Next output: export, trailing slashes and static-compatible images, producing out at /. No framework/package upgrades.
- Remove the repository base path and obsolete build:pages/preview:pages wrapper. npm run dev remains root-path development; npm start/npm run preview serve the export.
- Preserve static document navigation in production, Next navigation in development, all five routes, approved brand assets/fonts/icons and the unchanged original kit PDF.
- Replace deploy-pages.yml with validation-only validate.yml. PR/main checks remain; GitHub Pages upload/deploy jobs and write permissions are removed. No repository settings or existing site were changed/unpublished.
- Add .node-version (24), root asset/export checks, representative browser regression and owner setup documentation in docs/cloudflare-pages.md. Historical GitHub Pages handovers are marked superseded.

## Validation

Production static build, TypeScript, ESLint, brand/content/derived-asset integrity and export checks pass locally. Generated HTML/CSS/JS contain no former /Polaris-official-website dependency. Representative browser checks cover all five pages at desktop/mobile, accessibility, menu/keyboard, activities, form validation and disabled submission, original PDF, logo/icon/font/photograph/decorative assets and /_next/static. The full unchanged intermediate-width matrix is deliberately not repeated for a hosting-only change. Review this PR's current CI result before approval.

## Cloudflare setup after approval

Project: polaris-official-website; production branch: main; preset: Next.js (Static HTML Export); build: npm run build; output: out; root directory: default; Node: 24. Owner must connect the Cloudflare GitHub integration to this private repository and approve the new hosting setup. Creation/Save and Deploy starts hosting; do not perform it as part of preparation. No deployment, domain, visibility or security changes were made.

## Preview limitations

Copy and provisional photography still need approval. Feedback remains browser-memory-only with final submission disabled, no API/storage/delivery and no fake success. Separate follow-up consent stays unchecked by default. Privacy, retention, spam prevention, server validation, storage/delivery ownership and success semantics need approval before collection. The original six-page resource remains unchanged. No merge or deployment is requested from the implementation agent.
