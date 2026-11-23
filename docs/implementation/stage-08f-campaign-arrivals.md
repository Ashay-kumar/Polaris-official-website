# Stage 08F campaign arrival reporting

The website remains a Next.js static export on Cloudflare Pages. The root `functions/_middleware.ts` uses the exported `out/_routes.json` to limit Function invocation to the eight canonical document paths. The handler returns the original Pages response. It writes one Analytics Engine point for a production `GET` that returns `200 text/html` on an allowed path. Assets, the GA4 frame, and form and download APIs bypass this Function.

The point contains the canonical path and one of two fixed classifications. `meta_website_launch` requires exactly one of each approved UTM key with its approved value, in any order. Other `utm_*` keys, duplicates, or wrong values prevent that classification. Unrelated parameters such as `fbclid` are ignored. All other eligible requests count under `other` so the total includes both classifications. Cloudflare supplies the write timestamp. The classification also serves as the sampling key so campaign and other traffic are sampled separately.

The Function excludes requests marked as verified bots where Cloudflare provides that signal, a short list of known crawler user agents, and requests that declare prefetch, prerender, or preview. Reloads, repeated tagged URLs, undetected automation and browser navigation can all affect counts. Browser-cache hits and requests that bypass the Function are absent. These are request counts and cannot establish unique visitors, confirmed human page views, or conversions. GA4 remains independently opt-in.

## Cloudflare setup after approval

1. Verify the deployment in **Workers & Pages → Kyro's existing Pages project**. Confirm the Git integration builds from the repo root with `npm run build`, publishes `out`, and includes root-level Pages Functions. Inspect the deployed commit and custom domain association. Preserve the existing API Worker routes. Before release, confirm the build artifact includes the exact eight-route `_routes.json` and does not contain `out/api`.
2. For the **Production** Pages environment, open **Settings → Bindings → Add → Analytics engine**. Set the variable name to `CAMPAIGN_ARRIVALS` and the dataset to `kyro_campaign_arrivals`. The first successful write materializes the dataset. Leave Preview unbound. The code also limits counting to `https://kyrolearning.com`.
3. On Workers Free, verify **Settings → Runtime → Fail open / closed** uses **Fail open** for this Pages project so quota exhaustion still serves static HTML. Confirm the project has no security-critical Functions that would make fail-open inappropriate. With an absent binding or a synchronous write error, the handler returns the original response.
4. After separately authorized deployment, check a tagged landing and an untagged navigation, a noncanonical redirect, asset and iframe loads, and the three API routes. Compare the dataset and observed Function invocations. Confirm exclusions in the Pages deployment rather than treating the local mock as Cloudflare integration proof. Never attach the production Analytics Engine binding to automated tests.

Workers Free includes 100,000 Worker and Pages Function invocations per day, shared across the account and reset at 00:00 UTC. Paths outside the invocation list remain on the static path. Analytics Engine publishes Free allowances of 100,000 writes and 10,000 SQL queries per day and currently describes Analytics Engine usage as unbilled. Retention is three months. Verify account usage and available settings in the dashboard. [Pages routing](https://developers.cloudflare.com/pages/functions/routing/) · [Pages pricing](https://developers.cloudflare.com/pages/functions/pricing/) · [Bindings](https://developers.cloudflare.com/pages/functions/bindings/#analytics-engine) · [Analytics Engine pricing](https://developers.cloudflare.com/analytics/analytics-engine/pricing/) · [Retention](https://developers.cloudflare.com/analytics/analytics-engine/limits/)

## Private reporting

Send the SQL below as the POST body to `https://api.cloudflare.com/client/v4/accounts/<account_id>/analytics_engine/sql`, using an account-scoped **Account Analytics Read** bearer token. Keep that token in approved private tooling. The application does not expose a reporting endpoint. [SQL API and authentication](https://developers.cloudflare.com/analytics/analytics-engine/sql-api/)

```sql
SELECT
  formatDateTime(timestamp, '%Y-%m-%d', 'Asia/Kolkata') AS local_day,
  blob1 AS page_path,
  blob2 AS campaign,
  SUM(_sample_interval) AS request_count,
  MAX(_sample_interval) AS largest_sample_weight
FROM kyro_campaign_arrivals
WHERE timestamp >= toDateTime('2026-11-24 00:00:00', 'Asia/Kolkata')
  AND timestamp < toDateTime('2026-11-25 00:00:00', 'Asia/Kolkata')
GROUP BY local_day, page_path, campaign
ORDER BY local_day, page_path, campaign
```

The example covers November 24 in Asia/Kolkata. Substitute the inclusive first local midnight and exclusive ending local midnight. Sum the campaign rows by day for daily arrivals, select campaign rows where `page_path = '/'` for homepage arrivals, and retain the route grouping for a page breakdown. Sum both classifications for total eligible requests. Label weighted results as estimates when sample weights exceed one, and distinguish missing data from a measured zero. An observed sample weight of one does not establish complete platform coverage. [Date and time functions](https://developers.cloudflare.com/analytics/analytics-engine/sql-reference/date-time-functions/)

## Privacy disclosure for approval before activation

Add this description to the Privacy Policy's Cloudflare measurement paragraph and a matching summary in the Cookie Policy. The existing disclosures about optional GA4 remain applicable. Preserve the existing policy and form notice IDs unless the owner coordinates a version update.

> Cloudflare helps us count successful requests to public pages and requests that arrive with our approved Meta campaign tags. For this report we record the public page path, a fixed campaign classification, and the time. The report does not store IP addresses, full URLs, click identifiers, cookies, visitor identifiers, or form information. These counts measure requests and operate separately from optional Google Analytics, which remains controlled by your analytics choice.

Cloudflare still processes ordinary request information for hosting and security. Keep exports aggregate and internal. The Function does not retain a referrer field.
