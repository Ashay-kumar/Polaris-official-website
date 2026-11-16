# Stage 08 — Technical SEO/AEO integration

## Local implementation

- Root metadata permits indexing and following links; metadata base is `https://kyrolearning.com`.
- Eight public routes have one self-referencing canonical each, with trailing slashes. The homepage inherits `/` from the root layout; seven page modules override it.
- `src/app/sitemap.ts` statically exports precisely those eight production URLs to `/sitemap.xml`. No invented modification dates, API routes, resources or tokens are included.
- `src/app/robots.ts` statically exports `/robots.txt`, allowing public crawling and pointing to the absolute production sitemap.
- Existing approved titles, descriptions, headings, answers, legal wording and form behaviour are unchanged. No structured data, tracking or dependencies added.

## Verification

- Production static export built with the existing review-build setting `NEXT_PUBLIC_FORM_SUBMISSIONS_ENABLED=false`; no production configuration changed.
- TypeScript and targeted ESLint passed.
- `npm run check:export` passed: eight indexing directives/canonicals, single title per route, exact sitemap URL set, robots rules, existing asset/favicon integrity, disabled review forms and no public PDF bytes/API export.
- Focused comparison verified all five exported titles and descriptions exactly against `src/content/website-copy.ts`.
- `src/app/page.tsx` and `src/styles/website.module.css` hashes remained unchanged throughout this task.
- No full Playwright suite run; no commit, push or deployment.

## Launch and preview safety

These static artifacts permit indexing; they do not make an authenticated site publicly crawlable. Cloudflare Access and any response-level `X-Robots-Tag` restrictions remain outside this change and require live verification before launch.

All preview deployments must remain protected by Cloudflare Access and must not be indexed. Canonicals are not access control or a substitute for preview protection. Because previews may share these production-oriented static files, verify every preview hostname is protected; any additional preview-specific noindex response policy must be managed separately by the owner. No Cloudflare settings were inspected or changed here.

Before public indexing, verify the production domain serves the intended deployment, eight canonical pages return successful responses, sitemap/robots are reachable as XML/plain text, no infrastructure-level indexing block remains unintentionally, and preview protection is intact. Removing production Access, if approved, is a separate infrastructure action. Robots rules never protect private kit resources; existing secure delivery remains unchanged.
