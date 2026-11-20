# Stage 07B — local only; owner approval required before deployment

Privacy Policy section 9 and Cookie Policy sections 1–5 in `src/content/policies.json` contain proposed analytics wording requiring owner approval. Existing policy/form-consent identifiers are preserved. Analytics has a separate version-1 consent record. If the owner requires a privacy-notice version bump, coordinate frontend consent.json and backend approved notice versions in a separate authorized stage before deployment. No version coordination is implemented here.

GA4 G-85B0Q7PSX8 uses basic consent mode in an empty same-origin sandboxed iframe created only after acceptance. This keeps automatic measurement away from site forms, links and App Router history; it is DOM separation, not a security boundary against trusted Google code. No GTM container is used (gtag.js itself is served by googletagmanager.com). Manual page_view is the sole application event. The local configuration requests send_page_view: false; remote Enhanced measurement must also be disabled before the single-strategy behavior can be accepted. Fixed route/title allowlists, blank analytics referrer and no-referrer resource loading exclude arbitrary paths, query strings, fragments and dynamic titles. Unknown routes stop the frame.

Preferences store version, granted/denied and timestamp for 180 days. Expiry, visibility restoration and cross-tab storage changes fail closed. Blocked storage permits a session choice with a visible persistence notice. Withdrawal synchronously sets the GA disable flag, updates consent to denied, removes the frame, and clears accessible _ga/_gid/_gat cookies at host/parent domains and current path prefixes. Requests already sent and processed data cannot be recalled; inaccessible, HttpOnly, other-path or other-domain cookies cannot be guaranteed removed. Executed code cannot be undone. Cross-tab notification uses asynchronous browser storage events. Consent permits Google to receive network metadata and cookie identifiers; no form information is supplied.

## Owner dashboard actions before deployment

- Disable ALL Enhanced measurement for this stream, including automatic/history page views, forms, downloads, outbound links, search, scroll and video. Manual page_view is the single strategy. The empty frame additionally prevents observation of site forms/history.
- Keep Google signals, user-provided data collection, advertising personalization and cross-domain measurement disabled. Do not attach additional tags or destinations to this Google tag. Review linked advertising activation.
- Review retention (minimum suitable setting), access controls, data sharing, provider terms and international processing; approve the policy wording and 180-day preference/cookie lifetime.
- Validate the real tag in a controlled environment using GA4 Realtime/DebugView after explicit test consent. The eight consent browser tests replace Google's script. A separate real-loader diagnostic intercepted and aborted every collection attempt; no test events were forwarded to GA4. Dashboard settings are not changed by this task.

No backend, deployment settings or dependencies changed. No commit, push or deploy.

## Focused validation and unresolved blocker

- TypeScript (`tsc --noEmit --incremental false`) and targeted ESLint passed.
- Eight consent browser tests passed: undecided/rejected, acceptance/persistence/withdrawal, malformed/expired/future/version-mismatched storage, desktop/mobile Axe and keyboard/overflow checks, form-field isolation and kit access, cross-tab withdrawal, expiry during an open visit, and blocked local storage.
- Two existing policy/privacy-link checks passed after allowing the existing development/static trailing-slash difference in link assertions. No routing was changed.
- Banner and dialog screenshots at 1440 and 320 pixels were captured; mobile images were visually reviewed. Automated accessibility/overflow checks also covered 390 pixels.
- Real Google loader: no Google requests or GA cookies before acceptance; no private query/fragment markers or referrer in intercepted payloads; no new Google requests or GA cookies after withdrawal. All measurement requests were aborted locally, including Google fallback collection endpoints.
- BLOCKER: the live Google tag configuration attempted an automatic frame page_view and scroll in addition to the manual page_view. It also attempted fallback collection after interception. Duplicate-free real-provider page-view collection is NOT verified. The owner must disable Enhanced measurement/automatic page views and review tag destinations, then repeat the real network check before any deployment. The frame prevents access by automatic DOM measurement to site forms, but does not override remote tag settings.
- No build, unrelated suites, live form submission, real private PDF download, backend tests or GA4 dashboard modifications were performed. Existing form/delivery code was unchanged.
- The existing Next.js dev server emitted a security upgrade notice. Packages and configuration were left unchanged as instructed; review separately before deployment.

## Stage 07B.2 ? correction and validation (20 November 2026)

This section supersedes the earlier duplicate-page-view blocker; it does not approve deployment or the draft policies.

### Corrected finding and implementation

The Stage 07B.1 report incorrectly stated that its isolated comparison contained no manual page-view command. The actual diagnostic attaches a script.onload handler that sends the manual event. Its early-global-suppression case therefore already demonstrated the intended single manual view, not a remaining automatic view. The update:true experiment was unnecessary and is not included in application code.

The effective downloaded Google tag has destination initialization on gtm.init. Stream-only configuration arrives too late to govern that initialization: it produced an automatic analytics-frame.html view before the intended manual view. Early global settings fix this using Google's supported gtag('set', ...) API. All existing defaults (send_page_view:false, sanitized location/title/referrer, advertising restrictions and cookie options) are now queued globally before consent is granted and before js/config initialization; the same options remain on the single stream config. The isolated-frame architecture, manual page-view strategy and consent/expiry/withdrawal behaviour are unchanged. No filters discard Google events in application code or tests.

Official references:
- https://developers.google.com/analytics/devguides/collection/ga4/reference/config#send_page_view
- https://support.google.com/analytics/answer/18411054?hl=en

### Effective remote configuration

A new Google HTTP 200 response was fetched with Cache-Control:no-cache in a fresh browser context. Response date: 20 November 2026 08:42:36 UTC; advertised cache lifetime: 900 seconds. SHA-256: 95aba3b65a964e9b2d8b7044dcccf30768925baa423922c2a9eac7233e29116d. Its relevant automatic-event and user-data flags match the prior download; this was not merely reuse of the browser's prior script cache. Upstream service caching and actual account publication state cannot be established without account access.

The response still enables outbound/scroll/download/history/video and automatic user-data-related configuration, while forms are disabled and Google signals are regionally disallowed. This does not prove all such data is collected; local consent restrictions and the empty frame also apply. The owner should inspect the Google tag attached to G-85B0Q7PSX8 (response identifies GTM-N6PT5H8M), its destination settings, current published container version and any pending workspace changes. Ensure unwanted automatic measurement and user-provided collection are disabled in the effective published tag, not just the stream dashboard. Do not blindly change initialization triggers: the early global defaults now work with the effective tag. No account setting was changed here.

### Focused validation

- TypeScript (tsc --noEmit --incremental false): passed.
- Targeted ESLint on consent/controller and focused tests: passed.
- Eight consent regression tests: passed (accept/reject, sanitized navigation, persistence, malformed/expired records, keyboard/Axe/overflow at 1440/390/320, field isolation, cross-tab withdrawal, open-visit expiry and blocked storage).
- Both policy/privacy-link tests: passed. The privacy-link test first failed because its Kit click preceded hydration; it now rejects optional analytics through the hydrated consent UI before opening the unchanged Kit dialog. Only that failing check was rerun. Legal-content/Axe/responsive checks were rerun after policy text refinements and passed.
- Fresh real-loader probe: no pre-consent/rejection requests or cookies; exactly one intended initial view and a 180-day cookie lifetime. Its five-second navigation observation was too short for Google's batching and was not treated as an application failure.
- Extended replay of that exact unmodified real Google response: PASS in 103 seconds. Exactly one view for Home, Our Thinking and Help Shape; no same-page query/fragment/title-change events; no events during the idle observation; no synthetic feedback/contact markers in any intercepted payload. Withdrawal removed the frame and accessible GA cookies, and no further requests occurred through navigation and reload.
- Evidence: tmp/stage07b2-real-network.json (initial timed probe), tmp/stage07b2-replay-network.json (passing extended run). Collection requests were answered locally with HTTP 204 and never forwarded to production GA4. Normal Google cookie/client identifiers and technical browser metadata remain part of consented analytics; no claim of identifier-free analytics is made.

### Policy consistency and boundaries

Privacy section 5 now explicitly identifies Google Analytics separately from intentionally submitted form data. Cookie storage wording distinguishes the requested 180-day lifetime from observed GA session-cookie refreshes; permission expiry still follows the stored choice timestamp. Existing policy identifiers, form-consent versions and all other policy drafts are preserved. No architecture migration or new provider was introduced.

No form/backend/Turnstile/PDF, SEO copy, routes, sitemap, robots, branding, styling or hosting configuration changed in this correction. No package installation, production analytics collection, full build, unrelated suite, commit, push or deployment. The next review must retain existing preview Access protection. Local evidence does not verify GA4 Realtime persistence, all browsers, Google retention settings or live deployment behaviour; those remain owner review items.

Final route coverage: tmp/stage07b2-eight-routes.json records exactly eight page_view events for all eight public routes using the unmodified downloaded real Google tag. Footer links exercise client navigation; populated synthetic kit and feedback inputs did not appear in payloads. No iframe, duplicate, other automatic, query-string or fragment events were observed. Diagnostic selectors were corrected to use same-tab footer links rather than hidden/new-tab form privacy links; no application navigation was changed.

Stage 07B.2 files changed: src/lib/analytics-consent.ts; tests/e2e/analytics-consent.spec.ts; tests/e2e/policies-cookies.spec.ts; two wording refinements in src/content/policies.json; this report. Other pre-existing Stage 07B changes are preserved. Assessment: the local duplicate-event blocker is resolved and ready for owner deployment review, subject to approval of policy drafts and independent confirmation of published Google settings, retention and access. No deployment is authorized or performed.
