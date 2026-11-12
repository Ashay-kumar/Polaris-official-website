# Stage 07A.2a completion ? 12 November 2026

Local implementation only. No staging, commit, push, branch switch, PR operation or deployment. No packages installed. No existing website or brand source file was modified by this stage.

## Baselines / repository status

Website: feature/polaris-cloudflare-pages at 89cbb5d1ed84a48ff0f0477789a39fb654c9e1bb. GitHub read-only comparison confirms current main one merge commit ahead and zero file differences; PR #2 is already merged. Local remote refs were not fetched. All Stage 06/06.1 changes remain as found: nineteen tracked modifications plus untracked implementation/assets/docs. Index remains empty.

Brand: verification/polaris-v1-linux at e1d965bb280f794a7027992a542f976db77e2f57, initially clean. Approved export baseline 0328f77f90b31a7478866c9af11a3fd69b02ec24 was verified as an ancestor. Local main...HEAD divergence is two main-only and three verification-only commits. No release tags were found in the preceding audit; remote release freshness is not asserted. Only six additive architecture files are introduced. A command-scoped safe.directory exception allows read-only Git inspection; no persistent configuration changes. Filesystem approval was obtained for writes outside the website root.

## Files added

Brand: brand-export/contract.json; brand-export/identity.json; brand-export/logos.json; scripts/brand-sync-core.mjs; scripts/export-brand.mjs; docs/brand-export-release-notes.md.

Website: docs/brand-sync/contract.json; pin.json; logos.json; preflight-hashes.json; workflow.md; stage-07A.2a-report.md; scripts/brand-sync-core.mjs; scripts/brand-sync.mjs; src/lib/brand/identity.json; tests/brand-sync/brand-sync.test.mjs.

Generated disposable bundles/plans are under ignored tmp/. Existing package files, build/hosting configuration, runtime rendering/components/styles, logos, fonts, PDF, previews and original provenance checks remain byte-identical to preflight. preflight-hashes.json records 458 original tracked/nonignored files before additions, including all uncommitted Stage 06.1 work.

## Architecture / release state

Option B: reviewed brand contract -> deterministic local bundle -> website plan -> explicitly approved import -> pinned local resources. No remote build dependency, registry or auto-update. Manifest schema 1; contract 1.0.0; brand release 0.1.0-foundation.1 LOCAL CANDIDATE; logo asset 1.1; Git source commit independently recorded. releaseApproval is null. Do not describe this as an approved published release.

34 entries: seven token outputs, five source definitions, icon adapter, twelve logos, four fonts, three licences and two new configuration/registry files. Bootstrap found 32 identical existing files and added only the identity/registry; no original resource was overwritten. Kyro Learning / Kyro is centrally configured but unconsumed. Public name and outlined wordmarks intentionally remain Polaris.

Pin manifest SHA-256: 0bd5e735625e9d309eb5ed74ae056724bc271de6200e1bf6f44f69cddf37834c.
Contract/build digest: 8bfd88cd8a2c042cd533e5a00d4f40650335888f34eafc9d1289b8c82fc6cd70.

See workflow.md for exact commands, approval policy, example update, ownership, rollback and limitations. Future approved changes also require explicit reconciliation of historical check-foundation/content provenance; these existing protections were not weakened.

## Verification

- Eighteen targeted Node tests passed: real deterministic exports, exact membership, complete metadata/licences, hash checks, missing/tampered/unexpected resources, traversal/Windows aliases, symlink/junction escape, local/unmanaged conflicts, version reuse, pin consistency, reviewed repeat imports, compatibility and original-file preservation.
- TypeScript, website ESLint, production Next static export and check:export passed.
- Existing brand/content/derived resource/245 flag integrity checks passed unchanged.
- All seventeen existing Playwright tests passed, covering five routes at 1440/1024/768/390/320, navigation, menu, modal/picker, activities, feedback state, disabled capture, PDF/favicon/assets and focused axe/keyboard/reduced-motion checks.
- All ten desktop/mobile hero captures were compared as decoded RGBA pixels with Stage 06.1 approved evidence: ZERO changed pixels for each of the five pages at 1440 and 390px. Source hash preservation covers the rest of the unchanged design. This is environment-specific regression evidence, not a new design approval or all-device certification.
- Screenshots: test-results/visual/; approved reference evidence remains qa-artifacts/stage-06.1/after/. Existing artifacts were not replaced.

## Remaining gates / next scope

No implementation blocker remains. Explicit filesystem approvals were needed and granted; baseline is established from verified approved Git objects rather than branch-tip freshness. Release approval is still pending. Checksums and local approval metadata are not digital signatures. Keep contracts/tools reviewed and imported only from trusted sources. Do not run imports concurrently with editing; rollback is best-effort on process errors, not power-loss atomicity.

Stage 07A.2b: approve versioned export release, obtain approved Kyro Learning outlined logo variants, wire identity into public copy/metadata/alt text/consent without route/design changes, decide PDF branding source/export, reconcile provenance deliberately and repeat regression/visual checks. Preserve separate Sheets work after locating it. No backend activation, host/project rename, live settings or deployment is part of this foundation.

Before any later Git operations, obtain separate authorization and use a new reviewed integration plan because PR #2 is already merged. Preserve the approved dirty tree; do not reset or auto-rebase it.
