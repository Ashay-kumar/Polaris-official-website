# Stage 04 - first-draft handover

## Preview scope

Five responsive pages, shared approved brand foundations, twelve original kit activities, authentic PDF previews, original PDF download and approved-symbol favicons. Copy requires founder approval. Some photographs are provisional; see stage-03-photography.md. No research outcomes, testimonials or participant claims are implied.

Feedback is local preview only, with a disabled final action and no submission endpoint/storage/delivery. Privacy and data-handling arrangements require final approval before public collection. The separate confirmation component is reserved for a future verified server success.

## GitHub Pages architecture

POLARIS_STATIC_EXPORT=1 enables the Next static export, repository base path /Polaris-official-website, trailing slashes and static images. npm run build:pages sets this flag portably. Normal development/build remain at root. Route links use Next Link; public image/download/icon URLs use publicPath. CSS image imports and local fonts are bundled by Next. Only out is published, not docs, source, design references, tests or local files. check:export verifies the five routes, prefixed HTML asset paths, icons and original PDF hash and creates .nojekyll.

The workflow uses GitHub's official Pages Actions (see https://github.com/actions/starter-workflows/blob/main/pages/nextjs.yml). PRs run checks and browser tests with read-only contents permission, without deployment. Only main push/manual-main runs can publish after validation. The deploy job alone has pages:write/id-token:write, uses the github-pages environment, and deployments are serialised by branch. No repository settings are changed by this task.

## Ashay's required actions

1. Ensure the submitting GitHub account has access to Ashay-kumar/Polaris-official-website (including the connected GitHub app's repository access, if used). A private-repository 404 can mean missing access; visibility must not be changed to work around it.
2. Review the first-draft PR: all five pages, mobile navigation, kit activities/download, icons, provisional copy/photos and disabled feedback form. Confirm CI is green. Check screenshots locally using the instructions in README.
3. As repository owner/admin, open Settings > Pages > Build and deployment > Source and select GitHub Actions. Confirm Pages is available for the repository's current visibility/plan; retain existing visibility and domain. If approval is required for each deploy, configure the github-pages environment's required reviewers before merging.
4. Approve and merge the PR into main when ready. Do not deploy the feature branch. The workflow then validates the merged code and publishes out using the official Pages deployment job. Approve the environment job if configured.
5. Check the Actions run and Pages environment URL. Review https://ashay-kumar.github.io/Polaris-official-website/ and verify direct route refreshes, images/fonts, original PDF and favicons.

This task does not merge, manually deploy, configure Pages, change domains or modify security settings. Owner approval and remote availability remain external gates.

## Before a public launch

Approve founder copy and final licensed photography, finish privacy/data-handling decisions, approve a real feedback backend before enabling collection, and broaden assistive-technology/real-device testing. The preview retains noindex; that is a search-engine request, not access control. GitHub Pages publishes the exported files publicly according to repository Pages settings.

## Local verification

Results and Git/PR status are recorded at the end of this document when the handover is completed. CI can only be confirmed after successful remote push/PR access.

Static-host navigation: the locked Next 16.4.3 export emitted segmented RSC prefetch URLs whose flattened requests did not match exported nested filenames. The Pages build therefore uses ordinary document links through SiteLink, avoiding runtime rewrites and failed prefetches. Root-path development retains Next Link. Keyboard behaviour and route destinations are preserved.

### Verified locally, 11 November 2026

- Production static export and export route/asset checks: passed. Five page documents, icon files and unchanged six-page PDF verified.
- TypeScript and ESLint: passed; generated browser reports are excluded from source linting.
- Brand integrity: 29 approved imports, 75 preserved baseline files, 329 tokens, logos and local fonts passed. Original content and derived icon/PDF-preview checks passed.
- Playwright: 12 tests passed in the final run against the exported repository subpath. All five routes reflow at 1440/1024/768/390/320px. Desktop/mobile page axe scans and feedback-review scan reported zero violations. Navigation, same-page anchors, keyboard/menu, all twelve activities, original PDF download/bytes, icons, CSS, fonts and decorative paths passed. No submission request/synthetic success is enabled.
- Initial failures exposed the export prefetch issue and a hash-only link-prefix issue; both were fixed before the passing final run. No server rewrite is required.
- Intended source/reference/assets/docs review: approximately 21.6 MB, largest file approximately 2.1 MB. No credential patterns or unintended environment/cache/build files found. Both existing PDF filenames have identical approved bytes and are preserved; the website uses the canonical lowercase filename.
- Git 2.56.0 portable is available in ignored tmp/git-portable/cmd/git.exe; no global Git configuration was changed. Authenticated Git HTTPS can read and push to the existing private repository. The connected GitHub app has narrower access, so authenticated Git/REST is used for handover.
- Pages is not yet configured (has_pages=false); no repository setting, merge or deployment was performed. Owner setup/approval remains required. CI/PR status is reported separately after remote handover.

The current moderate development-tool advisories remain a known maintenance item. Browser/axe results do not certify all assistive technology, browser engines or real devices. Copy/photography/privacy/backend limitations remain as described above.

CI follow-up: Linux passed install, lint, integrity, build, type and export checks plus eleven browser tests. The additional font test incorrectly attempted to load Windows-only local fallback faces. It now verifies the actual heading/body web-font families; CSS checks still request every bundled font/decoration URL. This is a cross-platform test correction, with no website/font/token changes. Final remote results are linked from the PR.
