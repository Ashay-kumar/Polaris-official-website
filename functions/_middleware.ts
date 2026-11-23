import routes from "../public/_routes.json";

type CampaignClass = "meta_website_launch" | "other";
type CampaignPoint = {
  blobs: [path: string, campaign: CampaignClass];
  indexes: [campaign: CampaignClass];
};

type Context = {
  request: Request & { cf?: { botManagement?: { verifiedBot?: boolean } } };
  env: { CAMPAIGN_ARRIVALS?: { writeDataPoint(point: CampaignPoint): void } };
  next(): Promise<Response>;
};

const publicPaths = new Set(routes.include);
const productionOrigin = "https://kyrolearning.com";
const campaignTags = new Map([
  ["utm_source", "meta"],
  ["utm_medium", "paid_social"],
  ["utm_campaign", "kyro_website_launch"],
]);
const knownCrawler = /\b(?:facebookexternalhit|facebookcatalog|facebot|meta-externalagent|meta-externalfetcher|googlebot|bingbot)\b/i;
const speculative = /\b(?:prefetch|prerender|preview)\b/i;

function classifyCampaign(query: URLSearchParams): CampaignClass {
  const matched = new Set<string>();
  for (const [key, value] of query) {
    if (!key.toLowerCase().startsWith("utm_")) continue;
    if (matched.has(key) || campaignTags.get(key) !== value) return "other";
    matched.add(key);
  }
  return matched.size === campaignTags.size ? "meta_website_launch" : "other";
}

export async function onRequestGet({ request, env, next }: Context): Promise<Response> {
  const response = await next();
  if (!env.CAMPAIGN_ARRIVALS || request.method !== "GET" || response.status !== 200 ||
      !/^text\/html(?:\s*;|$)/i.test(response.headers.get("content-type") ?? "")) {
    return response;
  }

  const url = new URL(request.url);
  if (url.origin !== productionOrigin || !publicPaths.has(url.pathname) ||
      request.cf?.botManagement?.verifiedBot ||
      knownCrawler.test(request.headers.get("user-agent") ?? "") ||
      speculative.test(request.headers.get("sec-purpose") ?? "") ||
      speculative.test(request.headers.get("purpose") ?? "")) {
    return response;
  }

  const campaign = classifyCampaign(url.searchParams);
  try {
    // Analytics Engine timestamps and writes the point in the background.
    env.CAMPAIGN_ARRIVALS.writeDataPoint({ blobs: [url.pathname, campaign], indexes: [campaign] });
  } catch {
    // Measurement is best effort. Keep the original Pages response.
  }
  return response;
}
