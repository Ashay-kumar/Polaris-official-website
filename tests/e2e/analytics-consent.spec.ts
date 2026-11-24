import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import type { BrowserContext, Page } from "@playwright/test";

const measurementId = "G-85B0Q7PSX8";
const key = "kyro.analytics-preference";
const campaign = "utm_source=meta&utm_medium=paid_social&utm_campaign=kyro_website_launch";
const frame = (page: Page) => page.locator('iframe[src="/analytics-frame.html"]');
const banner = (page: Page) => page.getByRole("region", { name: "Your cookie choice" });
const trigger = (page: Page) => page.getByRole("button", { name: "Cookie preferences", exact: true });
const dialog = (page: Page) => page.getByRole("dialog", { name: "Cookie preferences" });

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

test("legacy and expired choices show an accessible banner and rejection keeps GA4 off", async ({ page, context, baseURL }) => {
  const { loaders, events } = await intercept(context, baseURL!);
  await context.addInitScript(key => {
    if (window.top !== window || localStorage.getItem(key)) return;
    localStorage.setItem("kyro.analytics-consent", JSON.stringify({ version: 1, choice: "granted", timestamp: Date.now() }));
    localStorage.setItem(key, JSON.stringify({ version: 1, choice: "granted", timestamp: Date.now() - 180 * 86_400_000 }));
  }, key);
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/?" + campaign);
  await expect(banner(page)).toBeVisible();
  await expect(frame(page)).toHaveCount(0);
  expect(loaders).toEqual([]);
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    expect((await new AxeBuilder({ page }).include("section[aria-labelledby=cookie-banner-title]").analyze()).violations).toEqual([]);
    await trigger(page).focus();
    await page.keyboard.press("Enter");
    await expect(dialog(page)).toBeVisible();
    const close = dialog(page).getByRole("button", { name: "Close cookie preferences" });
    await expect(close).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog(page).getByRole("link", { name: "Read the Cookie Policy" })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(close).toBeFocused();
    expect((await new AxeBuilder({ page }).include("dialog[aria-labelledby=cookie-preferences-title]").analyze()).violations).toEqual([]);
    await page.keyboard.press(width === 320 ? "Escape" : "Enter");
    await expect(dialog(page)).toBeHidden();
    await expect(trigger(page)).toBeFocused();
  }
  await banner(page).getByRole("button", { name: "Reject optional" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Analytics is off." })).toBeVisible();
  await expect(banner(page)).toHaveCount(0);
  await page.reload();
  await trigger(page).click();
  await expect(dialog(page)).toContainText("Rejected");
  await expect(banner(page)).toHaveCount(0);
  await expect(frame(page)).toHaveCount(0);
  expect(loaders).toEqual([]);
  expect(events).toEqual([]);
  expect((await context.cookies()).filter(cookie => /^_ga/.test(cookie.name))).toEqual([]);
});

for (const savedChoice of ["granted", "denied"] as const) {
  test(`keeps an existing ${savedChoice} preference and its original expiry`, async ({ page, context, baseURL }) => {
    const { loaders, events } = await intercept(context, baseURL!);
    const preference = JSON.stringify({ version: 1, choice: savedChoice, timestamp: Date.now() - 86_400_000 });
    await context.addInitScript(({ key, preference }) => {
      if (window.top === window && localStorage.getItem(key) === null) localStorage.setItem(key, preference);
    }, { key, preference });

    await page.goto("/");
    await trigger(page).click();
    await expect(dialog(page)).toContainText(savedChoice === "granted" ? "Accepted" : "Rejected");
    await expect(banner(page)).toHaveCount(0);
    expect(await page.evaluate(key => localStorage.getItem(key), key)).toBe(preference);
    if (savedChoice === "granted") {
      await expect.poll(() => events.length).toBe(1);
      expect(loaders).toEqual([measurementId]);
    } else {
      await expect(frame(page)).toHaveCount(0);
      expect(loaders).toEqual([]);
      expect(events).toEqual([]);
    }
  });
}

test("opt-in emits one sanitized page view per document and withdrawal stops all tabs", async ({ page, context, baseURL }) => {
  const { loaders, events } = await intercept(context, baseURL!);
  await page.goto("/cookie-policy/");
  await expect(banner(page)).toBeVisible();
  await expect(frame(page)).toHaveCount(0);
  expect(loaders).toEqual([]);
  await banner(page).getByRole("button", { name: "Accept analytics" }).focus();
  await page.keyboard.press("Space");
  await expect(page.getByRole("status").filter({ hasText: "Analytics is on." })).toBeVisible();
  await expect(banner(page)).toHaveCount(0);
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
  await expect(banner(page)).toHaveCount(0);
  await expect.poll(() => events.length).toBe(10);

  await page.goBack();
  await expect.poll(() => events.length).toBe(11);
  expect(events[10].get("dl")).toBe("https://kyrolearning.com/terms-of-use/");
  await page.goForward();
  await expect(banner(page)).toHaveCount(0);
  await expect.poll(() => events.length).toBe(12);

  const secondTab = await context.newPage();
  await secondTab.goto("/");
  await expect.poll(() => events.length).toBe(13);
  expect((await context.cookies()).some(cookie => cookie.name === "_ga")).toBe(true);
  const loadedBeforeWithdrawal = loaders.length;
  await trigger(page).click();
  await expect(dialog(page)).toContainText("Accepted");
  await dialog(page).getByRole("button", { name: "Reject optional" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Analytics is off." })).toBeVisible();
  await expect(frame(page)).toHaveCount(0);
  await expect(frame(secondTab)).toHaveCount(0);
  await trigger(secondTab).click();
  await expect(dialog(secondTab)).toContainText("Rejected");
  expect((await context.cookies()).some(cookie => cookie.name === "_ga")).toBe(false);
  await page.reload();
  await trigger(page).click();
  await expect(dialog(page)).toContainText("Rejected");
  await expect(banner(page)).toHaveCount(0);
  await secondTab.goto("/about/");
  await expect(frame(secondTab)).toHaveCount(0);
  expect(loaders).toHaveLength(loadedBeforeWithdrawal);
  expect(events).toHaveLength(13);
});
