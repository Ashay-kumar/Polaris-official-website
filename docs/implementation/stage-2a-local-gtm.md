# Stage 2A local Google Tag Manager

The loader uses `GTM-TCH3MJZH` only when `NEXT_PUBLIC_KYRO_LOCAL_GTM=1` and the browser hostname is `localhost`, `127.0.0.1`, or `[::1]`. The flag defaults to off. The hostname check keeps the loader off on production and remote previews even if the flag is accidentally set. No production activation switch is provided in Stage 2A.

For local preview in PowerShell, set the flag in the shell before starting Next.js. Use an intercepted browser test to avoid sending real tracking traffic.

```powershell
$env:NEXT_PUBLIC_KYRO_LOCAL_GTM = '1'
npm.cmd run dev -- --hostname 127.0.0.1 --port 4203
```

In a second shell, run the enabled browser checks.

```powershell
$env:POLARIS_TEST_URL = 'http://127.0.0.1:4203'
$env:KYRO_TEST_LOCAL_GTM = '1'
npm.cmd run test:e2e -- local-gtm.spec.ts
```

To verify the default build, omit both GTM flags, run the standard static export and preview, and run the same spec. Next.js reads the public feature flag at dev startup or build time. Restart or rebuild after changing it.

## Consent and scope

The loader uses the existing 180-day analytics preference and requires a current valid grant in both the consent store and browser storage. It creates a new script-only sandboxed document with an opaque origin. Inside that document it queues all four denied consent defaults, grants analytics storage only, and queues the GTM bootstrap event before adding the external script. It sends no application events or form information to the container and provides no no-script fallback. The GA4 frame still owns all of the site's manual page views, and Cloudflare campaign counts remain independent.

Withdrawal discards the executing GTM document in response to the consent store notification. Other tabs discard theirs when the browser delivers the storage change. The loader also discards its document on page hide and checks consent again on restoration. This does not cancel requests already sent, retract collected data, or clear storage belonging to third-party destinations. An opaque sandbox can restrict features that expect the top-level URL, cookies or DOM. The intercepted tests cover isolation and lifecycle. They do not prove that a future published container or particular tag can run correctly in that sandbox.

The approved Stage 2A scope is the reported empty Version 1 container and local analytics-only validation. The loader reads the latest published container when used with real network access. Do not use a real-network local preview after its contents change until Kyro has approved the new version.

## Review before activation

Hitesh should propose each event's purpose, trigger, allowed fields and destination in a Kyro-controlled workspace. Kyro should review Custom HTML, templates, permissions, linked destinations, and consent checks before it publishes. Keep GA4 configuration and page views out of GTM. Ads, remarketing, Meta Pixel, enhanced conversions, form scraping, and user identifiers are outside this stage.

Before approving a production design, confirm that the proposed analytics events fit the existing consent and disclosures. Confirm that the reviewed container works in a disposable sandbox, keeps advertising denied, and can run without relaxed production security headers. Test with intercepted endpoints or an approved separate test destination. Removing the loopback restriction would require a reviewed code change. Moving GTM into the top-level page would also require a new withdrawal and isolation review.

To roll back locally, remove `NEXT_PUBLIC_KYRO_LOCAL_GTM` from the environment, restart or rebuild, and close or reload tabs that ran an enabled build. To remove the integration entirely, revert the loader and its root-layout mount. Existing GA4 and Cloudflare tracking use their own paths.
