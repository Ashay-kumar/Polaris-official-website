# Run Polaris locally

Requirements: Node.js >=20.9.0, npm and the installed project dependencies. This checkout was validated with Node 26.13.0 and npm 11.20.0. Use `npm.cmd` in Windows PowerShell if script execution blocks npm.ps1.

From `<website-checkout>`:

```powershell
npm.cmd run dev
```

Open the Local URL Next prints. During Stage 02 an existing development server was available at `http://localhost:3002`; it was preserved. Do not start a second Next development server for the same checkout. If a server already owns `.next/dev`, use its printed URL.

Routes: `/`, `/our-thinking`, `/home-leadership-kit`, `/help-shape-polaris`, `/about`.

Production verification:

```powershell
npm.cmd run build
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run check:foundation
npm.cmd run check:content
npm.cmd run start -- --hostname 127.0.0.1 --port 4173
```

With that production server running, in another terminal:

```powershell
npm.cmd run test:e2e
```

The Playwright config uses installed Google Chrome headlessly, one worker and `http://127.0.0.1:4173`. No browser binary was downloaded. To test another local preview, set the test URL:

```powershell
$env:POLARIS_TEST_URL='http://localhost:3002'
npm.cmd run test:e2e
```

Test tooling added for this stage: `@playwright/test` 1.65.0 and `@axe-core/playwright` 4.14.0, development-only. Framework/runtime versions and brand packages remain unchanged. The website has its own package-lock.json.

The suite checks 1440/1024/768/390/320px across all five routes, screenshots at 1440 and 390, axe WCAG-tagged checks at those screenshot widths, navigation, disclosures, twelve activity instructions, the feedback preview, download bytes/native download and reduced-motion/skip-link behaviour. HTML reports and screenshots are under ignored `playwright-report/` and `test-results/`. This is Chromium coverage; Firefox/WebKit and screen-reader/real-device testing remain release checks.

The feedback form is intentionally local only. No environment variables, submission endpoint, database or email service are required. See `feedback-backend-contract.md` before enabling submission. Keep preview robots metadata until launch approval.
