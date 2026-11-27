import { expect, test, type BrowserContext, type Page } from "@playwright/test";

// Fail closed if a browser request escapes the interception handlers.
test.use({
  proxy: { server: "http://127.0.0.1:1", bypass: "localhost,127.0.0.1,[::1]" },
  // Keep opaque frames in the instrumented renderer so routing sees their first requests.
  launchOptions: { args: ["--disable-site-isolation-trials"] },
});

const key = "kyro.analytics-preference";
const fixtureOrigin = process.env.POLARIS_TEST_URL ?? "http://127.0.0.1:4173";
const productionOrigin = "https://kyrolearning.com";
const container = 'iframe[title="Local Google Tag Manager"]';
const banner = (page: Page) => page.getByRole("region", { name: "Your cookie choice" });
const accept = (page: Page) => banner(page).getByRole("button", { name: "Accept analytics" }).click();
const reject = (page: Page) => banner(page).getByRole("button", { name: "Reject optional" }).click();

async function intercept(context: BrowserContext, baseURL: string) {
  const origin = new URL(baseURL).origin;
  const traffic = { containers: 0, pageViews: 0, beacons: 0 };
  await context.route("**/*", async route => {
    const url = new URL(route.request().url());
    if (url.origin === origin) {
      if (origin !== productionOrigin) return route.continue();
      const response = await route.fetch({ url: new URL(url.pathname + url.search, fixtureOrigin).href, maxRedirects: 0 });
      return route.fulfill({ response });
    }
    if (url.hostname === "www.googletagmanager.com" && url.pathname === "/gtm.js") {
      expect(url.searchParams.get("id")).toBe("GTM-TCH3MJZH");
      traffic.containers++;
      return route.fulfill({ contentType: "application/javascript", body: `
        window.bootstrap = window.dataLayer.map(item => item.event ? item : Array.from(item));
        try { window.parent.document; window.parentReadable = true; } catch { window.parentReadable = false; }
        setInterval(() => fetch("https://www.google-analytics.com/mock-gtm", {mode:"no-cors"}), 50);
      ` });
    }
    if (url.hostname === "www.googletagmanager.com" && url.pathname === "/gtag/js") {
      expect(url.searchParams.get("id")).toBe("G-85B0Q7PSX8");
      return route.fulfill({ contentType: "application/javascript", body: `
        window.dataLayer.push = command => {
          if (command[0] === "event" && command[1] === "page_view")
            fetch("https://www.google-analytics.com/mock-page-view", {mode:"no-cors"});
        };
      ` });
    }
    if (url.pathname === "/mock-gtm") traffic.beacons++;
    if (url.pathname === "/mock-page-view") traffic.pageViews++;
    return route.fulfill({ status: 204 });
  });
  return traffic;
}

test("GTM is disabled in the default build even after analytics acceptance", async ({ page, context, baseURL }) => {
  const traffic = await intercept(context, baseURL!);
  await page.goto("/");
  await accept(page);
  await expect.poll(() => traffic.pageViews).toBe(1);
  await expect(page.locator(container)).toHaveCount(0);
  expect(await page.evaluate(() => Object.hasOwn(window, "dataLayer"))).toBe(false);
  expect(traffic.containers).toBe(0);
});

test.describe("production hostname served by the local fixture", () => {
  test.use({ baseURL: productionOrigin });

  for (const preference of [
    { name: "missing", raw: null },
    { name: "invalid", raw: "not-json" },
    { name: "expired", raw: JSON.stringify({ version: 1, choice: "granted", timestamp: 1 }) },
  ]) {
    test(`${preference.name} consent and rejection keep GTM off`, async ({ page, context, baseURL }) => {
      const traffic = await intercept(context, baseURL!);
      await page.addInitScript(({ key, raw }) => {
        if (window.top === window && raw && !localStorage.getItem(key)) localStorage.setItem(key, raw);
      }, { key, raw: preference.raw });
      await page.goto("/");
      await expect(banner(page)).toBeVisible();
      await expect(page.locator(container)).toHaveCount(0);
      await reject(page);
      await page.reload();
      await expect(page.getByRole("button", { name: "Cookie preferences", exact: true })).toBeEnabled();
      await expect(banner(page)).toHaveCount(0);
      await expect(page.locator(container)).toHaveCount(0);
      expect(traffic).toEqual({ containers: 0, pageViews: 0, beacons: 0 });
    });
  }

  test("orders consent before boot and withdraws the executing document across tabs", async ({ page, context, baseURL }) => {
    const traffic = await intercept(context, baseURL!);
    await page.goto("/");
    await accept(page);
    await expect.poll(() => traffic.pageViews).toBe(1);
    await expect.poll(() => traffic.beacons).toBeGreaterThan(0);
    expect(traffic.containers).toBe(1);
    const frame = page.frames().find(frame => frame.url() === "about:srcdoc")!;
    expect(await frame.evaluate(() => Reflect.get(window, "bootstrap"))).toEqual([
      ["consent", "default", {
        analytics_storage: "denied", ad_storage: "denied",
        ad_user_data: "denied", ad_personalization: "denied",
      }],
      ["consent", "update", { analytics_storage: "granted" }],
      { "gtm.start": expect.any(Number), event: "gtm.js" },
    ]);
    expect(await frame.evaluate(() => Reflect.get(window, "parentReadable"))).toBe(false);
    await page.reload();
    await expect.poll(() => [traffic.containers, traffic.pageViews]).toEqual([2, 2]);
    await page.goto("/about/");
    await expect.poll(() => [traffic.containers, traffic.pageViews]).toEqual([3, 3]);
    const otherTab = await context.newPage();
    await otherTab.goto("/");
    await expect.poll(() => [traffic.containers, traffic.pageViews]).toEqual([4, 4]);

    for (const target of [page, otherTab]) await expect(target.locator(container)).toHaveCount(1);
    await page.getByRole("button", { name: "Cookie preferences", exact: true }).click();
    await page.getByRole("dialog", { name: "Cookie preferences" }).getByRole("button", { name: "Reject optional" }).click();
    for (const target of [page, otherTab]) await expect(target.locator(container)).toHaveCount(0);
    // Let already intercepted requests drain, then verify no new timer callbacks hit the network.
    await new Promise(resolve => setTimeout(resolve, 200));
    const stoppedCount = traffic.beacons;
    await otherTab.reload();
    await expect(otherTab.getByRole("button", { name: "Cookie preferences", exact: true })).toBeEnabled();
    await new Promise(resolve => setTimeout(resolve, 200));
    expect(traffic).toEqual({ containers: 4, pageViews: 4, beacons: stoppedCount });
  });
});
