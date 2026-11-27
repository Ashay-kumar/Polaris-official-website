# Consent-gated Google Tag Manager

The loader uses `GTM-TCH3MJZH` on `https://kyrolearning.com` after valid analytics consent. Remote previews remain off. On `localhost`, `127.0.0.1`, and `[::1]`, the optional `NEXT_PUBLIC_KYRO_LOCAL_GTM=1` flag enables the same behavior. No production environment variable is required.

For local preview in PowerShell, set the flag in the shell before starting Next.js. Use an intercepted browser test to avoid sending real tracking traffic.

```powershell
$env:NEXT_PUBLIC_KYRO_LOCAL_GTM = '1'
npm.cmd run dev -- --hostname 127.0.0.1 --port 4203
```

The regression spec expects a static export served on loopback with the local flag unset. It tests production behavior by routing the production hostname to the loopback export, with Google endpoints intercepted.

```powershell
$env:POLARIS_TEST_URL = 'http://127.0.0.1:4173'
npm.cmd run test:e2e -- local-gtm.spec.ts
```

Next.js reads the local flag at dev startup or build time. Restart or rebuild after changing it.

## Consent and scope

The loader uses the existing 180-day analytics preference and requires a current valid grant in both the consent store and browser storage. It creates a new script-only sandboxed document with an opaque origin. Inside that document it queues all four denied consent defaults, grants analytics storage only, and queues the GTM bootstrap event before adding the external script. It sends no application events or form information to the container and provides no no-script fallback. The GA4 frame still owns all of the site's manual page views, and Cloudflare campaign counts remain independent.

Withdrawal discards the executing GTM document in response to the consent store notification. Other tabs discard theirs when the browser delivers the storage change. The loader also discards its document on page hide and checks consent again on restoration. This does not cancel requests already sent, retract collected data, or clear storage belonging to third-party destinations. An opaque sandbox can restrict features that expect the top-level URL, cookies or DOM. The intercepted tests cover isolation and lifecycle. They do not prove that a future published container or particular tag can run correctly in that sandbox.

The production scope is loading the reviewed container after analytics consent. The loader reads the latest published container. Kyro should review and approve future versions before publishing them.

## Review before activation

Hitesh should propose each event's purpose, trigger, allowed fields and destination in a Kyro-controlled workspace. Kyro should review Custom HTML, templates, permissions, linked destinations, and consent checks before it publishes. Keep GA4 configuration and page views out of GTM. Ads, remarketing, Meta Pixel, enhanced conversions, form scraping, and user identifiers are outside this stage.

Before adding events, confirm that they fit the existing consent and disclosures. Verify their sandbox compatibility and withdrawal behavior with intercepted endpoints or an approved separate test destination. The container runs in a sandboxed frame, so network verification and top-level Tag Assistant discovery are separate checks.

To roll back production activation, revert the production-origin change and redeploy the previously reviewed build. To disable a local preview, remove `NEXT_PUBLIC_KYRO_LOCAL_GTM`, restart or rebuild, and close or reload tabs that ran an enabled build. Existing GA4 and Cloudflare tracking use their own paths.
