# Cloudflare Pages preparation - Stage 05

## Build contract

Project name: polaris-official-website (subject to availability).
Repository: Ashay-kumar/Polaris-official-website. Production branch: main.
Framework preset: Next.js (Static HTML Export).
Build command: npm run build. Output directory: out. Repository root: default/blank.
Node: 24, recorded in .node-version; remove conflicting NODE_VERSION overrides or set them to 24 in both production and preview settings.

Next output is export with trailingSlash and unoptimized static images. No basePath, assetPrefix or hosting flag is required. Local development runs at root. Production uses static document navigation to avoid Next segmented-prefetch rewrite assumptions; local development uses Next Link. Assets remain at /images, /brand, /downloads and /_next/static; App Router icon files remain unchanged.

No Workers, Functions, Wrangler, next-on-pages or OpenNext adapter is needed. No credentials/bindings are added. out contains ordinary HTML/CSS/JS/fonts/images/PDF plus a static 404.html; Cloudflare does not need SPA fallback rewrites. npm run check:export verifies the five routes, resources, favicon files, original PDF hash, static 404 and absence of the former repository subpath in generated HTML/CSS/JS.

## Validation-only GitHub Actions

.github/workflows/validate.yml replaces deploy-pages.yml. It retains pull_request/main validation, npm ci, lint, integrity, build, type, export and browser checks. Permissions are contents:read only. There are no Pages artifacts, deployment jobs, environment approval bindings, pages:write or id-token permissions. Obsolete build:pages/preview:pages commands and their build wrapper are removed. Historical Stage 04 documents are explicitly marked superseded.

No GitHub repository settings are changed, and any existing GitHub Pages site remains untouched. After merge, the old GitHub deployment workflow is removed from main; this preparation does not unpublish a site.

## Owner connection steps - later, after approval

1. Review the focused Cloudflare preparation PR and CI. PR #1 was already merged/closed at the start of this stage; no PR was merged during this task.
2. When ready for an actual deployment, in Cloudflare open Workers & Pages > Create application > Pages > Import an existing Git repository.
3. Connect GitHub and grant the Cloudflare GitHub integration access specifically to Ashay-kumar/Polaris-official-website. As this is private, the repository owner may need to approve/install the integration. Do not change repository visibility.
4. Set project name, main production branch, static export preset, npm run build and out as above. Retain the root directory default. Confirm Node 24. Do not carry over POLARIS_STATIC_EXPORT, NEXT_PUBLIC_BASE_PATH or other GitHub Pages overrides; the current configuration does not read them.
5. Review preview-branch controls; leave automatic branch previews disabled until approved if this remains preparation-only. Cloudflare Git integration can deploy automatically on connected branch pushes.
6. Save and Deploy creates a live deployment: do this only with deployment approval, after the configuration is merged into main. Neither project creation nor deployment is performed by this task. No GitHub Pages setting/domain/security setting is changed.
7. After the future deployment, verify /, /our-thinking/, /home-leadership-kit/, /help-shape-polaris/, /about/, direct refresh, static 404, original PDF and icons. The expected project domain is https://polaris-official-website.pages.dev/ if that name is available; it has not been provisioned or verified here.

Official setup: https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/
Node selection: https://developers.cloudflare.com/pages/configuration/build-image/

## Preview limitations and approval gates

The first-draft notice and noindex metadata remain. noindex is not access control. Copy needs founder review, photography remains provisional, and the original supplied six-page kit is unchanged. Feedback cannot submit, has no server/storage/delivery and cannot show a synthetic success. Contact remains optional and follow-up consent starts unchecked.

Before collection: approve backend/storage or delivery, access owners/region, privacy notice, retention/deletion, spam controls, server validation, consent wording and reliable success/failure semantics. See feedback-backend-contract.md, content-review.md and stage-03-photography.md. No privacy language, credentials or service has been invented.

## Verification record

Local and CI results are reported in the completion handover and the focused PR. Successful static export establishes artifact compatibility; actual Cloudflare serving remains unverified until an approved deployment.

Local validation passed: production root export; TypeScript; ESLint; 29 imported brand files/75 preserved assets/329 tokens; all twelve original activities and unchanged PDF; approved icon/preview integrity. Representative browser coverage runs the nine existing checks excluding the unchanged 1024/768/320 full-page matrix: all five pages at 1440/390px, desktop/mobile axe scans, keyboard/navigation, activities, form safeguards, root fonts/CSS, favicons and PDF. No visual styles or page copy were changed.
