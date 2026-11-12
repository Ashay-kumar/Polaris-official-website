# Controlled brand foundation ? Stage 07A.2a

## State and ownership

The founder approved Option B and Kyro Learning / Kyro. Stage 06.1 is the approved visual baseline and remains uncommitted. This stage changes no existing rendering code, styling, font, logo, route, motion, form, PDF or preview. New identity.json is deliberately not imported into rendering. The outlined logos and current public-facing name still say Polaris: an intentional temporary migration state, not a completed rename.

Brand repository: mridulavdass-bit/polaris-brand-design-system. Website: Ashay-kumar/Polaris-official-website. Visual baseline commit: 0328f77f90b31a7478866c9af11a3fd69b02ec24. The brand verification checkout is later e1d965b; it is NOT implicitly approved for export. Its local main and verification branch have diverged (2 main-only, 3 verification-only commits). Remote release freshness was not established by fetching. The existing website provenance and approved Git objects establish the selected baseline.

The brand owns identity, tokens, production logo exports, selected foundations, font provenance and licences. The website owns layouts, marketing CTA recipes, editorial content, forms, phone selector, responsive compositions and motion usage. Do not replace similarly named components. Adapted button/action-link/style files are intentionally excluded from synchronization.

## Contract and release model

Brand files: brand-export/contract.json, identity.json, logos.json; scripts/export-brand.mjs and brand-sync-core.mjs; docs/brand-export-release-notes.md. Website files: docs/brand-sync/contract.json (reviewed trust policy), pin.json (installed release manifest), logos.json and preflight-hashes.json; scripts/brand-sync.mjs and brand-sync-core.mjs; src/lib/brand/identity.json (unconsumed).

Schema version 1 describes the manifest structure. Contract version 1.0.0 describes tool compatibility. Brand release 0.1.0-foundation.1 is a LOCAL CANDIDATE with releaseApproval null. Logo asset version remains 1.1. sourceCommit and approvedSourceBaseline identify the approved historical foundation Git objects, not the new uncommitted identity files. Each entry records kind: git, font-package or contract-file. New identity/registry data use explicit contract-file hashes; they are not misrepresented as files from the old commit. The deterministic build ID is SHA-256 of canonical pretty-printed contract JSON, with no wall clock timestamp.

The exact allowlist has 34 entries: seven generated token stylesheets, five foundation source definitions, one icon adapter, twelve production logos, four fonts, three licence files and two new configuration/registry files. No marketing components, documentation shell, specimens, screenshots, PDF, form logic, environment files or secrets are included. The supplied upstream logo registry contains documentation context; the minimal exported registry describes existing production assets without importing that application.

Font bytes and OFL notices come from installed Fontsource 5.3.0 / 5.3.1 and must match approved recorded SHA-256 values and the baseline lockfile package versions. Other foundation bytes come from Git show at the approved commit. Export never runs a token generator or reads arbitrary current token working files. Approved future token edits must be regenerated and approved in their source repository first; then update the contract to those approved commit/blob hashes.

No actual release has been approved or published. A future approved release requires an explicit approver and durable approval reference, a new immutable release version, source baseline review, licence/compatibility review and release notes. A JSON approval record is review metadata, NOT a cryptographic signature or authentication authority. Hashes detect changes relative to the locally reviewed contract; they do not authenticate a downloaded release by themselves.

## Commands (PowerShell)

From the website root, when Git is not on PATH:

    $env:BRAND_GIT_EXECUTABLE = (Resolve-Path './tmp/git-portable/cmd/git.exe').Path
    node '../polaris-brand-design-system/scripts/export-brand.mjs' --out tmp/brand-release-unique
    node scripts/brand-sync.mjs --plan tmp/brand-release-unique
    node scripts/brand-sync.mjs --check
    $env:BRAND_TEST_EXPORT = 'tmp/brand-release-unique'
    node --test tests/brand-sync/brand-sync.test.mjs

The exporter requires a NEW directory outside the source repository and refuses existing output. There are no network requests or new dependencies. Do not run it in a directory being concurrently modified.

The one-time bootstrap performed in this stage used:

    node scripts/brand-sync.mjs --bootstrap tmp/stage07-export-a <reviewed-plan-id>

Bootstrap accepts a candidate only when all existing allowlisted bytes already match and only the two new identity/registry paths are additions. It does not bless that candidate as an approved release. It cannot replace old foundations or bootstrap over an existing pin.

For subsequent approved releases:

    node scripts/brand-sync.mjs --plan tmp/brand-next > tmp/brand-next-plan.json
    node scripts/brand-sync.mjs --apply tmp/brand-next <reviewed-plan-id>
    node scripts/brand-sync.mjs --check

A plan records installed/target versions, all before/after hashes, text before/after for changes, binary hash differences and a deterministic plan ID. Review both contract and plan; no supplied export can expand the locally reviewed allowlist. Apply revalidates the bundle, installed pin, current local bytes, framework compatibility and plan ID. Candidate releases cannot replace existing resources. Changed same-version releases, removed managed paths and locally modified/unmanaged conflicts are rejected. Resolve adaptation/migration manually through a separately reviewed task; do not overwrite or disable the guard.

Pin updates are local writes, NOT Git staging, approval, PR creation or deployment. Source and old pin bytes are snapshotted in memory before writes; write failures attempt rollback of completed writes. This is not a crash-safe database transaction. Run with exclusive local access and preserve a filesystem/Git baseline before approved real changes. Repeated same-release imports produce the same bytes.

## Trust and validation

Bundle membership is exact; missing/unexpected files, tampered hashes, altered manifest metadata, traversal, Windows ADS/reserved names, symlinks/junctions and redirected roots are rejected. Website contract is a trusted reviewed policy file; never replace it automatically with an untrusted manifest. Treat the import tool itself as maintained code, not executable code downloaded from a release. The small core module exists in both repositories with explicit versioning; it is not executed from an imported bundle. Website builds consume only pinned local files and do not execute the sync tool or contact GitHub.

Existing docs/brand-files.json, local-assets.json, source hashes and check-foundation/check-content protections remain unchanged. An approved future token/logo/font/PDF revision requires a separate explicit provenance migration: preserve historical approvals, update the active provenance/check expectations deliberately and review regression evidence. Do not merely run apply and weaken failing checks. Current CLI provides plan/apply and pin tracking; it does not automatically rewrite older approval records. The Stage 07A.2a preflight-hashes test is a stage-specific freeze of 458 original files; future authorized website changes must explicitly retire/archive that assertion while retaining the historical snapshot.

## Review and rollback

Review source baseline, policy diff, file list, approval reference, hashes/licences, plan and compatibility. Validate TypeScript, ESLint, existing integrity checks, static export, navigation/resources/forms and desktop/mobile visual evidence. Only separately authorized Git/PR actions can deliver it. Production updates still require owner-approved merge and hosting deployment.

To roll back, restore the previous approved contract AND matching pin/resources/provenance together from the reviewed baseline (after separately authorized Git/file operations), verify hashes and rerun checks. The importer deliberately rejects reusing a version with changed content; restoring a prior approved contract/version is allowed when compatibility and local hashes are coherent. Keep original logos/PDFs and review artifacts. Do not reset a dirty tree or revert unrelated work. Runtime deployment rollback is a separate owner operation.

## Later name / logo / PDF workflow

Stage 07A.2b should wire the approved central name into metadata, navigation, alt text, footer and consent/editorial references, preserving URLs and design. It needs approved Kyro Learning outlined wordmarks, not generated text over the existing logo. Version and export approved replacements, retain symbol geometry and validate clear space/wrapping. Favicon regeneration is needed only for an actual approved artwork change.

The original PDF remains untouched and publicly addressable. Obtain its editable source or an approved branding-only document export; compare six pages and all twelve activities, regenerate faithful previews and update document provenance in a separate approved scope. Do not automatically generate the document from marketing copy. No PDF or previews are part of this bundle.

## Integration / automation boundaries

No live backend, Sheets, Cloudflare, domain, project binding, credential or environment configuration is touched. No form submission is enabled. Existing local source has no verified Google Sheets integration; separate work must be located and preserved before future integration. Later automation may prepare an update PR with minimal repository permissions, pinned versions and human approval. Never auto-merge or pull latest branch resources at runtime/build. A package registry is unnecessary now.

PR #2 is already merged. Preserve the approved dirty Stage 06.1 tree and these additive changes; after separate designer/founder authorization, select a dedicated follow-up integration branch based on verified current main without discarding work. This stage does not fetch, switch, stage, commit, push or modify any PR.
