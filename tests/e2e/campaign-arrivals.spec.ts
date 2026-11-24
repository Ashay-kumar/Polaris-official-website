import { readFile } from "node:fs/promises";
import { registerHooks } from "node:module";
import { expect, test } from "@playwright/test";
import routes from "../../public/_routes.json" with { type: "json" };

// Wrangler bundles the plain JSON import. Node needs an attribute when Playwright loads the source directly.
const middlewareUrl = new URL("../../functions/_middleware.ts", import.meta.url).href;
const jsonHook = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (context.parentURL !== middlewareUrl || specifier !== "../public/_routes.json") {
      return nextResolve(specifier, context);
    }
    const importAttributes = { type: "json" };
    return { ...nextResolve(specifier, { ...context, importAttributes }), importAttributes };
  },
});
let onRequestGet: typeof import("../../functions/_middleware").onRequestGet;
try {
  ({ onRequestGet } = await import("../../functions/_middleware"));
} finally {
  jsonHook.deregister();
}

const origin = "https://kyrolearning.com";
const campaign = "utm_source=meta&utm_medium=paid_social&utm_campaign=kyro_website_launch";
const tagged = "meta_website_launch";
const paths = [
  "/", "/about/", "/cookie-policy/", "/help-shape-polaris/", "/home-leadership-kit/",
  "/our-thinking/", "/privacy-policy/", "/terms-of-use/",
];

type Context = Parameters<typeof onRequestGet>[0];
type Point = Parameters<NonNullable<Context["env"]["CAMPAIGN_ARRIVALS"]>["writeDataPoint"]>[0];

function recorder() {
  const points: Point[] = [];
  return { points, env: { CAMPAIGN_ARRIVALS: { writeDataPoint: (point: Point) => { points.push(point); } } } };
}

function html(status = 200) {
  return new Response("<p>Original HTML</p>", {
    status, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public" },
  });
}

test("Pages export invokes the Function only on the eight exact canonical routes", async () => {
  expect(routes).toEqual({ version: 1, include: paths, exclude: [] });
  expect(JSON.parse(await readFile("out/_routes.json", "utf8"))).toEqual(routes);
  const sitemap = await readFile("out/sitemap.xml", "utf8");
  expect([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]).sort())
    .toEqual(paths.map((path) => origin + path).sort());
});

test("classifies approved campaign parameters and records only fixed dimensions", async () => {
  const { points, env } = recorder();
  const queries = [
    [campaign, tagged],
    ["utm_campaign=kyro_website_launch&utm_source=meta&utm_medium=paid_social", tagged],
    [campaign + "&fbclid=click-marker&email=private%40example.test", tagged],
    ["utm_source=meta&utm_medium=paid_social", "other"],
    [campaign.replace("paid_social", "organic"), "other"],
    [campaign + "&utm_source=meta", "other"],
    [campaign + "&utm_medium=organic", "other"],
    [campaign + "&UTM_SOURCE=meta", "other"],
    [campaign + "&utm_content=unapproved", "other"],
    ["", "other"],
  ];
  for (const [query, classification] of queries) {
    const request = new Request(origin + "/?" + query, {
      headers: { cookie: "private=marker", referer: "https://example.test/private", "cf-connecting-ip": "192.0.2.1" },
    });
    await onRequestGet({ request, env, next: async () => html() });
    expect(points.at(-1)).toEqual({ blobs: ["/", classification], indexes: [classification] });
  }
  expect(points).toHaveLength(queries.length);
});

test("only successful canonical production HTML GETs can count", async () => {
  const { points, env } = recorder();
  for (const path of paths) {
    await onRequestGet({ request: new Request(origin + path + "?" + campaign), env, next: async () => html() });
  }
  expect(points.map(({ blobs }) => blobs)).toEqual(paths.map((path) => [path, tagged]));

  const excludedRequests = [
    ...["/about", "/about/index.html", "/api/feedback", "/api/kit-request", "/api/kit-download",
      "/_next/static/test.js", "/favicon.ico", "/kit.pdf", "/analytics-frame", "/analytics-frame.html", "/missing/"]
      .map((path) => new Request(origin + path + "?" + campaign)),
    new Request("https://example.pages.dev/?" + campaign),
    new Request(origin + "/?" + campaign, { method: "HEAD" }),
    new Request(origin + "/?" + campaign, { method: "POST" }),
    new Request(origin + "/?" + campaign, { headers: { "user-agent": "facebookexternalhit/1.1" } }),
    new Request(origin + "/?" + campaign, { headers: { purpose: "prefetch" } }),
    new Request(origin + "/?" + campaign, { headers: { "sec-purpose": "prefetch;prerender" } }),
    Object.assign(new Request(origin + "/?" + campaign), { cf: { botManagement: { verifiedBot: true } } }),
  ];
  // Use HTML 200 even for excluded URLs to exercise the defensive request checks independently.
  for (const request of excludedRequests) await onRequestGet({ request, env, next: async () => html() });
  for (const response of [html(302), html(308), html(403), html(404), html(500), new Response("{}", {
    headers: { "content-type": "application/json" },
  })]) {
    expect(await onRequestGet({ request: new Request(origin + "/?" + campaign), env, next: async () => response }))
      .toBe(response);
  }
  expect(points).toHaveLength(paths.length);
});

test("missing and failing analytics bindings preserve the original response, headers and body", async () => {
  const request = new Request(origin + "/?" + campaign);
  const brokenBinding = { writeDataPoint() { throw new Error("Synthetic write failure"); } };
  for (const env of [{}, { CAMPAIGN_ARRIVALS: brokenBinding }]) {
    const response = html();
    const result = await onRequestGet({ request, env, next: async () => response });
    expect(result).toBe(response);
    expect(result.headers.get("cache-control")).toBe("public");
    expect(await result.text()).toBe("<p>Original HTML</p>");
  }
});

test("browser navigation serves the static documents and counts requests with GA4 off", async ({ page, context, baseURL }) => {
  const { points, env } = recorder();
  const localOrigin = new URL(baseURL!).origin;
  const external: string[] = [];
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== localOrigin) {
      external.push(url.hostname);
      return route.abort();
    }
    if (!routes.include.includes(url.pathname)) return route.continue();
    const upstream = await route.fetch({ maxRedirects: 0 });
    const request = new Request(new URL(url.pathname + url.search, origin), {
      method: route.request().method(), headers: route.request().headers(),
    });
    await onRequestGet({ request, env, next: async () => new Response(null, {
      status: upstream.status(), headers: upstream.headers(),
    }) });
    return route.fulfill({ response: upstream });
  });

  await page.goto("/?" + campaign);
  await expect(page.locator("footer").getByRole("link", { name: "Cookie Policy", exact: true })).toBeVisible();
  await page.goto("/cookie-policy/");
  await expect(page).toHaveURL(/\/cookie-policy\/$/);
  await expect(page.getByRole("heading", { name: "Cookie Policy", exact: true })).toBeVisible();
  await page.getByRole("region", { name: "Your cookie choice" }).getByRole("button", { name: "Reject optional" }).click();
  await page.reload();
  expect(points.map(({ blobs }) => blobs)).toEqual([
    ["/", tagged], ["/cookie-policy/", "other"], ["/cookie-policy/", "other"],
  ]);
  expect(external).toEqual([]);
});
