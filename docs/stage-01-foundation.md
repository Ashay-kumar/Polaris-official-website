# Stage 01 foundation

Completed locally on 11 November 2026. No deployment, commit, push, branch switch or brand-source modification.

## Repository

Website: `<website-checkout>`, origin `https://github.com/Ashay-kumar/Polaris-official-website.git`, branch `main`, HEAD `8176f30d8f73ec4e04fcdfd2662fa6e0b5f7f5eb`. Existing README, references and image assets were preserved. The design files remain unstaged; no Git index write was performed.

Git CLI could not be located in PATH or the searched standard installation/user directories. No global PATH/configuration change or Git installation was made. Direct read-only Git object/index inspection allowed source verification. Install/locate Git for Windows before future commit/review workflows.

## Packages

Node `26.13.0`, npm `11.20.0`; use `npm.cmd` in this PowerShell environment. Registry metadata confirmed the baseline packages exist and Next's Node/React peer requirements are satisfied. Installation used `--ignore-scripts`; the production build succeeds without enabling dependency lifecycle scripts. The website owns its package.json, node_modules and lockfile.

| Direct package | Installed version |
| --- | --- |
| next / eslint-config-next | 16.4.3 |
| react / react-dom | 19.3.1 |
| @fontsource/dm-serif-display | 5.3.0 |
| @fontsource/source-sans-3 | 5.3.1 |
| @phosphor-icons/react | 2.1.10 |
| typescript | 5.9.3 |
| eslint | 9.39.5 |
| @types/node | 24.19.2 |
| @types/react / @types/react-dom | 19.3.0 |

No Tailwind, UI framework, animation library, form library, feedback service or browser-test dependency was added. `tests/e2e/` is reserved for the later browser verification stage.

## Architecture

```text
src/
  app/                         root layout and foundation placeholder only
  components/
    layout/                    responsive Container with CSS Module
    brand/                     approved icon adapter; logo wrapper
    ui/                        approved button and native action link
    pages/                     reserved
    feedback/                  reserved; no endpoint
  content/                     reserved for verified founder content
  lib/brand/                   approved foundation sources; logo manifest
  styles/
    tokens/                    seven approved CSS token files
    fonts/                     four local WOFF2 files
    globals.css
    polaris-button.css
public/
  brand/logos/v1.1/{svg,png}/  six variants in each format
  images/                      existing assets preserved
  downloads/                   unchanged approved six-page kit
  licenses/                    OFL and MIT notices
design-references/             existing nine mockups preserved
scripts/check-foundation.mjs
tests/e2e/
docs/
```

The placeholder deliberately contains no proposed marketing copy. Robots metadata prevents indexing during foundation development; review it for launch. CSS Modules and global semantic custom properties are configured. There is no chosen hosting/export mode yet.

## Validation

Passed:

- Dependency installation and direct dependency resolution.
- `npm.cmd run typecheck`.
- `npm.cmd run lint` with zero warnings.
- `npm.cmd run build`: Next production build; only `/` and framework `/_not-found` routes.
- `npm.cmd run check:foundation`: approved source/destination hashes, all 75 preserved original files, 329 distinct token names and reference/cycle checks, six SVG/PNG logo pairs, four local fonts and the six-page kit.

No broad browser testing was run at this stage. The unchanged PDF was structurally/text inspected; no PDF renderer was available and its visual/print layout has not been certified in this task.

## Known limitations and next-stage decisions

Installation reports ESLint 9.39.5 as unsupported and seven moderate development-only advisories through typescript-eslint's nested minimatch (GHSA-g3hv-75wg-m249). The compatible `npm audit fix --dry-run --ignore-scripts` proposes zero additions, removals or changes despite reporting a fix available. No forced major upgrade or blanket override was applied. Reassess the lint toolchain before release; the audit reports no high or critical advisories.

The kit's original-file identity was explicitly confirmed by the user on 11 November 2026, then copied byte-for-byte. See `asset-manifest.md`, `local-assets.json`, `asset-inventory.json`, `brand-provenance.md` and `brand-files.json` for hashes and source mappings.

Outstanding page/release inputs: kit mobile mockup; About filename normalisation; final About and other approved high-resolution photography; reconciliation of desktop/mobile structure, copy and mockup logos; authoritative founder website copy; hosting/runtime; feedback storage/delivery ownership; privacy, retention, consent wording and spam controls; final logo small-size/clear-space review.

The shared foundation is ready for the coordinated five-page implementation. These inputs remain explicit implementation/release dependencies. No individual marketing pages or feedback backend were built.
