import { expect, test } from "@playwright/test";
import type { BrowserContext, Page } from "@playwright/test";

const measurementId = "G-85B0Q7PSX8";
const key = "kyro.analytics-preference";
const campaign = "utm_source=meta&utm_medium=paid_social&utm_campaign=kyro_website_launch";
const frame = (page: Page) => page.locator('iframe[src="/analytics-frame.html"]');
const choice = (page: Page) => page.getByRole("checkbox", { name: "Allow optional website analytics" });

const fakeTag = `
  const queue = window.dataLayer;
  const config = Array.from(queue.find(command => command[0] === "config"));
  const consent = Array.from(queue.find(command => command[1] === "update"));
  queue.push = function (command) {
    if (command[0] !== "event" || window["ga-disable-G-85B0Q7PSX8"]) return;
    document.cookie = "_ga=synthetic; path=/";
    fetch("https://www.google-analytics.com/g/collect?" + new URLSearchParams({
      tid: config[1], en: command[1], dl: command[2].page_location, dt: command[2].page_title,
      dr: command[2].page_referrer, config: JSON.stringify(config[2]), consent: JSON.stringify(consent[2])
    })).catch(() => {});
  };
`;

async function intercept(context: BrowserContext, baseURL: string) {
  const loaders: string[] = [];
  const events: URLSearchParams[] = [];
  const origin = new URL(baseURL).origin;
  await context.route("**/*", async route => {
    const url = new URL(route.request().url());
    if (url.origin === origin) return route.continue();
    if (url.hostname === "www.googletagmanager.com" && url.pathname === "/gtag/js") {
      loaders.push(url.searchParams.get("id") ?? "");
      return route.fulfill({ contentType: "application/javascript", body: fakeTag });
    }
    if (url.pathname === "/g/collect") events.push(url.searchParams);
    return route.fulfill({ status: 204, headers: { "access-control-allow-origin": "*" } });
  });
  return { loaders, events };
}

test("legacy and expired choices keep GA4 off with an accessible mobile opt-in", async ({ page, context, baseURL }) => {
  const { loaders, events } = await intercept(context, baseURL!);
  await context.addInitScript(key => {
    if (window.top !== window || localStorage.getItem(key)) return;
    localStorage.setItem("kyro.analytics-consent", JSON.stringify({ version: 1, choice: "granted", timestamp: Date.now() }));
    localStorage.setItem(key, JSON.stringify({ version: 1, choice: "granted", timestamp: Date.now() - 180 * 86_400_000 }));
  }, key);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/?" + campaign);
  await page.locator("footer").getByRole("link", { name: "Cookie Policy", exact: true }).click();
  await expect(choice(page)).toBeEnabled();
  await expect(choice(page)).not.toBeChecked();
  await expect(page.locator("#analytics-status")).toHaveText("Analytics is off.");
  await expect(page.locator("#cookie-banner-title, #cookie-preferences-title")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(frame(page)).toHaveCount(0);
  expect(loaders).toEqual([]);
  expect(events).toEqual([]);
  expect((await context.cookies()).filter(cookie => /^_ga/.test(cookie.name))).toEqual([]);
});

test("opt-in emits one sanitized page view per document and withdrawal stops all tabs", async ({ page, context, baseURL }) => {
  const { loaders, events } = await intercept(context, baseURL!);
  await page.goto("/cookie-policy/");
  await expect(choice(page)).toBeEnabled();
  await choice(page).focus();
  await page.keyboard.press("Space");
  await expect(page.locator("#analytics-status")).toHaveText("Analytics is on.");
  await expect.poll(() => events.length).toBe(1);
  expect(loaders).toEqual([measurementId]);
  expect(events[0].get("tid")).toBe(measurementId);
  expect(events[0].get("en")).toBe("page_view");
  expect(events[0].get("dt")).toBe("Cookie Policy");
  expect(JSON.parse(events[0].get("consent")!)).toEqual({
    analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
  });
  expect(JSON.parse(events[0].get("config")!)).toMatchObject({
    send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
  });

  const visits = [
    ["/?email=synthetic%40example.test&" + campaign + "&fbclid=synthetic#private", "/?" + campaign],
    ["/about/?phone=123&" + campaign + "&utm_source=meta", "/about/"],
    ["/our-thinking/?" + campaign.replace("paid_social", "organic"), "/our-thinking/"],
    ["/help-shape-polaris/?email=synthetic%40example.test", "/help-shape-polaris/"],
    ["/home-leadership-kit/", "/home-leadership-kit/"],
    ["/privacy-policy/", "/privacy-policy/"],
    ["/terms-of-use/", "/terms-of-use/"],
  ];
  for (const [index, [visit, expected]] of visits.entries()) {
    await page.goto(visit);
    await expect.poll(() => events.length).toBe(index + 2);
    expect(events[index + 1].get("dl")).toBe("https://kyrolearning.com" + expected);
    expect(events[index + 1].get("dr")).toBe("");
  }
  await page.reload();
  await expect.poll(() => events.length).toBe(9);
  await page.evaluate(() => { location.hash = "private"; });
  await page.locator("footer").getByRole("link", { name: "Cookie Policy", exact: true }).click();
  await expect(choice(page)).toBeChecked();
  await expect.poll(() => events.length).toBe(10);

  await page.goBack();
  await expect.poll(() => events.length).toBe(11);
  expect(events[10].get("dl")).toBe("https://kyrolearning.com/terms-of-use/");
  await page.goForward();
  await expect(choice(page)).toBeChecked();
  await expect.poll(() => events.length).toBe(12);

  const secondTab = await context.newPage();
  await secondTab.goto("/");
  await expect.poll(() => events.length).toBe(13);
  expect((await context.cookies()).some(cookie => cookie.name === "_ga")).toBe(true);
  const loadedBeforeWithdrawal = loaders.length;
  await choice(page).uncheck();
  await expect(page.locator("#analytics-status")).toHaveText("Analytics is off.");
  await expect(frame(page)).toHaveCount(0);
  await expect(frame(secondTab)).toHaveCount(0);
  expect((await context.cookies()).some(cookie => cookie.name === "_ga")).toBe(false);
  await page.reload();
  await expect(choice(page)).not.toBeChecked();
  await secondTab.goto("/about/");
  await expect(frame(secondTab)).toHaveCount(0);
  expect(loaders).toHaveLength(loadedBeforeWithdrawal);
  expect(events).toHaveLength(13);
});
