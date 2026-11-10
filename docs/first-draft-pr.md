> Historical Stage 04 record. Hosting instructions below are superseded by [Cloudflare Pages preparation](cloudflare-pages.md). PR #1 was merged before Stage 05; its GitHub Pages configuration is replaced by validation-only CI.

This first draft introduces the five Polaris website pages: Home, Our Thinking, Home Leadership Kit, Help Shape Polaris and About Polaris. It selectively integrates the approved brand system at commit 0328f77f90b31a7478866c9af11a3fd69b02ec24, preserving Curious Pop tokens, local DM Serif Display/Source Sans 3, official logos and the Phosphor adapter.

## Included

- Shared responsive navigation/footer, differentiated editorial heroes and accessible quality disclosures.
- All twelve founder-supplied kit activities, filtering/details, authentic document previews and unchanged original six-page PDF download.
- Approved-symbol SVG, ICO and Apple favicons.
- Four-step local feedback preview with validation, optional email and separate follow-up consent unchecked by default. Real submission is disabled; no endpoint, persistence, email delivery or fake success is enabled.
- Next.js static GitHub Pages build at /Polaris-official-website/, subpath-safe assets, local fonts/downloads/icons, trailing slashes and static document navigation. Root-path local development remains available.
- GitHub Actions PR validation, with deployment restricted to validated main builds using the github-pages environment. No feature-branch deployment.

## Verification

Production static export, TypeScript, ESLint, brand/content/derived-asset integrity and exported route/asset checks. Playwright covers all five pages at 1440, 1024, 768, 390 and 320px, desktop/mobile axe checks, keyboard/mobile navigation, activity exploration, preview-form validation, PDF integrity/download, favicons, fonts, CSS and decorative asset paths at the repository subpath. See docs/stage-04-handover.md for the final local verification record. GitHub CI results must be reviewed on this PR; local success does not claim a completed hosted run.

## Known limitations

This is an early-stage preview. Website copy needs founder approval; several photos are provisional/low-resolution with production selection and rights still requiring approval. No testimonials, measured outcomes or real participant claims are implied. Privacy/data-handling, storage/delivery ownership, spam controls and final consent wording require approval before feedback collection. Automated Chromium/axe coverage is not full accessibility or real-device certification. The existing moderate development-tool advisories remain documented; runtime dependency versions have not changed.

## Ashay: review and approve

1. Review all five pages locally with npm ci, npm run build:pages, npm run check:export and npm run preview:pages; visit http://127.0.0.1:4173/Polaris-official-website/.
2. Check mobile navigation, activity filtering/details, original PDF, favicon and disabled feedback journey. Approve or request copy/photography changes. Confirm PR checks pass.
3. As owner/admin, select Settings > Pages > Build and deployment > Source: GitHub Actions, subject to Pages eligibility for the existing private repository/plan. Preserve repository visibility/domain. Configure required reviewers for github-pages if deployment approval is desired.
4. Approve and merge into main only when ready. The main workflow validates and deploys the static out artifact; approve the environment deployment if configured. This PR is not merged or manually deployed by the implementation task.

Expected URL after owner-approved deployment: https://ashay-kumar.github.io/Polaris-official-website/.
