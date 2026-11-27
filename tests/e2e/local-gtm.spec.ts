import { expect, test, type BrowserContext, type Page } from "@playwright/test";

const key = "kyro.analytics-preference";
const gtm = "https://www.googletagmanager.com/gtm.js?id=GTM-TCH3MJZH";
const banner = (page: Page) => page.getByRole("region", { name: "Your cookie choice" });
const ga4Frame = (page: Page) => page.locator('iframe[src="/analytics-frame.html"]');

async function intercept(context: BrowserContext, baseURL: string) {
  const origin = new URL(baseURL).origin;
  const traffic = { containers: 0, ga4Loaders: 0, pageViews: 0, unexpected: [] as string[] };
  await context.route("**/*", async route => {
    const url = new URL(route.request().url());
    if (url.origin === origin) return route.continue();
    if (url.href === gtm) {
      traffic.containers++;
      return route.fulfill({ contentType: "application/javascript", body: "" });
    }
    if (url.hostname === "www.googletagmanager.com" && url.pathname === "/gtag/js" &&
        url.searchParams.get("id") === "G-85B0Q7PSX8") {
      traffic.ga4Loaders++;
      return route.fulfill({ contentType: "application/javascript", body: `
        window.dataLayer.push = command => {
          if (command[0] === "event" && command[1] === "page_view")
            fetch("https://www.google-analytics.com/mock-page-view", { mode: "no-cors" });
        };
      ` });
    }
    if (url.origin === "https://www.google-analytics.com" && url.pathname === "/mock-page-view") {
      traffic.pageViews++;
    } else {
      traffic.unexpected.push(url.href);
    }
    return route.fulfill({ status: 204 });
  });
  return traffic;
}

async function expectHeadContainer(page: Page) {
  await expect(page.locator(`head script[src="${gtm}"][async]`)).toHaveCount(1);
  await expect(page.locator(`script[src="${gtm}"]`)).toHaveCount(1);
  await expect(page.locator('iframe[title="Local Google Tag Manager"]')).toHaveCount(0);
  expect(await page.evaluate(() => {
    const queue = Reflect.get(window, "dataLayer") as ArrayLike<unknown>[];
    return queue.map(command => Array.from(command)[0]);
  })).toEqual(["js"]);
}

test("loads one GTM container from the head without starting GA4 before acceptance", async ({ page, context, baseURL }) => {
  const traffic = await intercept(context, baseURL!);
  await page.goto("/");
  await expectHeadContainer(page);
  await expect(banner(page)).toBeVisible();
  await expect(ga4Frame(page)).toHaveCount(0);
  expect(traffic).toEqual({ containers: 1, ga4Loaders: 0, pageViews: 0, unexpected: [] });

  await banner(page).getByRole("button", { name: "Accept analytics" }).click();
  await expect.poll(() => traffic.pageViews).toBe(1);
  expect(traffic).toEqual({ containers: 1, ga4Loaders: 1, pageViews: 1, unexpected: [] });
});

for (const preference of [
  { name: "missing", raw: null },
  { name: "invalid", raw: "not-json" },
  { name: "expired", raw: JSON.stringify({ version: 1, choice: "granted", timestamp: 1 }) },
]) {
  test(`${preference.name} consent and rejection keep GA4 off while head GTM loads once per document`, async ({ page, context, baseURL }) => {
    const traffic = await intercept(context, baseURL!);
    await page.addInitScript(({ key, raw }) => {
      if (window.top === window && raw && !localStorage.getItem(key)) localStorage.setItem(key, raw);
    }, { key, raw: preference.raw });
    await page.goto("/");
    await expect(banner(page)).toBeVisible();
    await expect(ga4Frame(page)).toHaveCount(0);
    expect(traffic).toEqual({ containers: 1, ga4Loaders: 0, pageViews: 0, unexpected: [] });
    await banner(page).getByRole("button", { name: "Reject optional" }).click();
    await page.reload();
    await expect(page.getByRole("button", { name: "Cookie preferences", exact: true })).toBeEnabled();
    await expect(banner(page)).toHaveCount(0);
    await expect(ga4Frame(page)).toHaveCount(0);
    await expectHeadContainer(page);
    expect(traffic).toEqual({ containers: 2, ga4Loaders: 0, pageViews: 0, unexpected: [] });
  });
}

test("keeps one GTM loader per navigation and stops GA4 across tabs on withdrawal", async ({ page, context, baseURL }) => {
  const traffic = await intercept(context, baseURL!);
  await page.goto("/");
  await banner(page).getByRole("button", { name: "Accept analytics" }).click();
  await expect.poll(() => traffic.pageViews).toBe(1);

  await page.reload();
  await expect.poll(() => traffic.pageViews).toBe(2);
  await page.goto("/about/");
  await expect.poll(() => traffic.pageViews).toBe(3);
  const otherTab = await context.newPage();
  await otherTab.goto("/");
  await expect.poll(() => traffic.pageViews).toBe(4);
  for (const target of [page, otherTab]) await expectHeadContainer(target);
  expect(traffic).toEqual({ containers: 4, ga4Loaders: 4, pageViews: 4, unexpected: [] });

  await page.getByRole("button", { name: "Cookie preferences", exact: true }).click();
  await page.getByRole("dialog", { name: "Cookie preferences" }).getByRole("button", { name: "Reject optional" }).click();
  for (const target of [page, otherTab]) await expect(ga4Frame(target)).toHaveCount(0);
  expect(traffic).toEqual({ containers: 4, ga4Loaders: 4, pageViews: 4, unexpected: [] });

  await otherTab.reload();
  await expect(otherTab.getByRole("button", { name: "Cookie preferences", exact: true })).toBeEnabled();
  await expectHeadContainer(otherTab);
  await expect(ga4Frame(otherTab)).toHaveCount(0);
  expect(traffic).toEqual({ containers: 5, ga4Loaders: 4, pageViews: 4, unexpected: [] });
});
