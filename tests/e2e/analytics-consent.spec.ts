import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const key = "kyro.analytics-consent";
const google = /https:\/\/[^/]*(?:google-analytics\.com|googletagmanager\.com|analytics\.google\.com)\//;
type Command = [string, string | object, object?];
async function commands(page: Page): Promise<Command[]> {
  const frame = page.frames().find(f => f.url().endsWith("/analytics-frame.html"));
  return frame ? frame.evaluate(() => Array.from((window as unknown as { dataLayer: ArrayLike<unknown>[] }).dataLayer, c => Array.from(c))) as Promise<Command[]> : [];
}
async function mockGoogle(page: Page) {
  const requests: string[] = [];
  await page.route(google, async route => {
    requests.push(route.request().url());
    await route.fulfill({ contentType: "application/javascript", body: "/* Deliberately no real Google processing in local tests. */" });
  });
  return requests;
}
const banner = (page: Page) => page.getByRole("region", { name: "Your cookie choice" });
const preferences = async (page: Page) => {
  await page.getByRole("button", { name: "Cookie preferences", exact: true }).click();
  return page.getByRole("dialog", { name: "Cookie preferences", exact: true });
};

test("undecided and rejected make no Google requests or cookies; rejection persists", async ({ page, context }) => {
  const requests = await mockGoogle(page);
  await page.goto("/?email=synthetic%40example.test#private");
  await expect(banner(page)).toBeVisible();
  expect(requests).toEqual([]); expect(await context.cookies()).toEqual([]);
  await banner(page).getByRole("button", { name: "Reject optional" }).click();
  await expect(banner(page)).toHaveCount(0);
  await page.reload();
  const dialog = await preferences(page);
  await expect(dialog).toContainText("Rejected");
  expect(await page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key)).toMatchObject({ version: 1, choice: "denied" });
  expect(requests).toEqual([]); expect(await context.cookies()).toEqual([]);
});

test("acceptance sends one sanitized page view per document; persistence and withdrawal", async ({ page, context }) => {
  const requests = await mockGoogle(page);
  await page.goto("/?email=synthetic%40example.test#private");
  await banner(page).getByRole("button", { name: "Accept analytics" }).click();
  await expect.poll(async () => (await commands(page)).filter(c => c[0] === "event").length).toBe(1);
  expect(requests).toHaveLength(1);
  let queue = await commands(page);
  const initialization = queue.findIndex(c => c[0] === "js");
  const earlySettings = queue.slice(0, initialization);
  expect(earlySettings).toContainEqual(["set", "send_page_view", false]);
  expect(earlySettings).toContainEqual(["set", "cookie_expires", 180 * 86400]);
  expect(earlySettings).toContainEqual(["set", "allow_google_signals", false]);
  expect(queue.find(c => c[0] === "config")?.[2]).toMatchObject({ send_page_view: false, allow_google_signals: false });
  expect(queue.filter(c => c[0] === "consent").every(c => {
    const data = c[2] as { ad_storage: string; ad_user_data: string; ad_personalization: string };
    return data.ad_storage === "denied" && data.ad_user_data === "denied" && data.ad_personalization === "denied";
  })).toBe(true);
  expect(queue.find(c => c[0] === "event")?.[2]).toMatchObject({ page_location: "https://kyrolearning.com/", page_title: "Kyro Learning", page_referrer: "" });
  const homeQueue = queue;
  const granted = await page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key);
  expect(granted).toMatchObject({ version: 1, choice: "granted" });
  const homeFrame = page.frames().find(f => f.url().endsWith("/analytics-frame.html"));
  expect(homeFrame).toBeDefined();
  await page.locator("header").getByRole("link", { name: "Our Thinking", exact: true }).click();
  await expect(page).toHaveURL(/\/our-thinking\/?$/);
  await expect.poll(async () => (await commands(page)).filter(c => c[0] === "event").length).toBe(1);
  expect(homeFrame!.isDetached()).toBe(true);
  await expect(banner(page)).toHaveCount(0);
  expect(await page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key)).toEqual(granted);
  queue = await commands(page);
  expect(queue.filter(c => c[0] === "event")).toEqual([["event", "page_view", {
    send_to: "G-85B0Q7PSX8", page_location: "https://kyrolearning.com/our-thinking/", page_title: "Our Thinking", page_referrer: ""
  }]]);
  // The mock records script loads, not collection hits: one per consented document.
  const loader = "https://www.googletagmanager.com/gtag/js?id=G-85B0Q7PSX8";
  expect(requests).toEqual([loader, loader]);
  await page.evaluate(() => { history.pushState(null, "", "?name=private#email"); document.title = "synthetic@example.test"; });
  await page.getByRole("button", { name: "Cookie preferences", exact: true }).click();
  await page.keyboard.press("Escape");
  expect((await commands(page)).filter(c => c[0] === "event")).toEqual(queue.filter(c => c[0] === "event"));
  expect(requests).toEqual([loader, loader]);
  await page.reload();
  await expect(banner(page)).toHaveCount(0);
  await expect.poll(async () => (await commands(page)).filter(c => c[0] === "event").length).toBe(1);
  expect(requests).toEqual([loader, loader, loader]);
  expect(await page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key)).toEqual(granted);
  const reloadQueue = await commands(page);
  expect(reloadQueue.filter(c => c[0] === "event")).toEqual(queue.filter(c => c[0] === "event"));
  expect(JSON.stringify([homeQueue, queue, reloadQueue])).not.toMatch(/synthetic|private|example\.test|\?|#/i);
  await context.addCookies([{ name: "_ga", value: "synthetic", url: "http://127.0.0.1:4173/" }, { name: "_ga_85B0Q7PSX8", value: "synthetic", url: "http://127.0.0.1:4173/" }]);
  const before = requests.length;
  const dialog = await preferences(page);
  await dialog.getByRole("button", { name: "Reject optional" }).click();
  await expect(page.locator('iframe[title="Optional website analytics"]')).toHaveCount(0);
  expect((await context.cookies()).filter(c => c.name.startsWith("_ga"))).toEqual([]);
  await page.locator("header").getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about\/?$/);
  expect(await page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key)).toMatchObject({ version: 1, choice: "denied" });
  expect(requests).toHaveLength(before);
  await page.reload();
  expect(requests).toHaveLength(before);
  queue = await commands(page); expect(queue).toEqual([]);
});

test("malformed, expired, future and wrong-version records fail closed", async ({ page }) => {
  const requests = await mockGoogle(page);
  for (const value of ["broken", "null", "[]", JSON.stringify({ version: 1, choice: "yes", timestamp: Date.now() }), JSON.stringify({ version: 2, choice: "granted", timestamp: Date.now() }), JSON.stringify({ version: 1, choice: "granted", timestamp: "today" }), JSON.stringify({ version: 1, choice: "granted", timestamp: Date.now() + 86400000 }), JSON.stringify({ version: 1, choice: "granted", timestamp: Date.now() - 181 * 86400000 })]) {
    await page.goto("/");
    await page.evaluate(({ key, value }) => localStorage.setItem(key, value), { key, value });
    await page.reload(); await expect(banner(page)).toBeVisible();
    expect(requests).toEqual([]);
  }
});

test("desktop/mobile banner and dialog accessibility, equal choices and keyboard focus", async ({ page }) => {
  await mockGoogle(page); await page.goto("/");
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(banner(page)).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await banner(page).evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).include('[aria-labelledby="cookie-banner-title"]').withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    if (width === 1440 || width === 320) await banner(page).screenshot({ path: `test-results/visual/stage07b-banner-${width}.png` });
  }
  const dialog = await preferences(page);
  await expect(dialog.getByRole("button", { name: "Close cookie preferences" })).toBeFocused();
  await page.keyboard.press("Tab"); await expect(dialog.getByRole("link")).toBeFocused();
  await page.keyboard.press("Shift+Tab"); await expect(dialog.getByRole("button", { name: "Close cookie preferences" })).toBeFocused();
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).include('dialog').withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    if (width === 1440 || width === 320) await dialog.screenshot({ path: `test-results/visual/stage07b-dialog-${width}.png` });
  }
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Cookie preferences", exact: true })).toBeFocused();
});

test("form fields remain outside analytics, and rejection leaves kit access available", async ({ page }) => {
  const requests = await mockGoogle(page);
  await page.goto("/help-shape-polaris/");
  await banner(page).getByRole("button", { name: "Accept analytics" }).click();
  await expect.poll(async () => (await commands(page)).filter(c => c[0] === "event").length).toBe(1);
  await page.locator("textarea").first().fill("Synthetic private feedback never sent to analytics.");
  await page.locator('input[type="email"]').first().fill("synthetic@example.test");
  const queue = await commands(page);
  expect(queue.filter(c => c[0] === "event").map(c => c[1])).toEqual(["page_view"]);
  expect(JSON.stringify(queue)).not.toMatch(/synthetic@example|private feedback/);
  const dialog = await preferences(page); await dialog.getByRole("button", { name: "Reject optional" }).click();
  const before = requests.length;
  await page.goto("/home-leadership-kit/");
  await page.getByRole("button", { name: "Download the Kit", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(requests).toHaveLength(before);
});

test("withdrawal in another tab disables an accepted tab", async ({ page, context }) => {
  await mockGoogle(page); await page.goto("/");
  await banner(page).getByRole("button", { name: "Accept analytics" }).click();
  await expect.poll(async () => (await commands(page)).filter(c => c[0] === "event").length).toBe(1);
  const other = await context.newPage(); await mockGoogle(other); await other.goto("/");
  const dialog = await preferences(other); await dialog.getByRole("button", { name: "Reject optional" }).click();
  await expect(page.locator('iframe[title="Optional website analytics"]')).toHaveCount(0);
  await expect(await preferences(page)).toContainText("Rejected");
});

test("consent expiring during an open visit stops analytics", async ({ page }) => {
  await mockGoogle(page); await page.clock.install(); await page.goto("/");
  await banner(page).getByRole("button", { name: "Accept analytics" }).click();
  await expect.poll(async () => (await commands(page)).filter(c => c[0] === "event").length).toBe(1);
  await page.evaluate(key => {
    localStorage.setItem(key, JSON.stringify({ version: 1, choice: "granted", timestamp: Date.now() - 180 * 86400000 + 1000 }));
    window.dispatchEvent(new StorageEvent("storage", { key }));
  }, key);
  await page.clock.fastForward(2000);
  await expect(banner(page)).toBeVisible();
  await expect(page.locator('iframe[title="Optional website analytics"]')).toHaveCount(0);
});

test("blocked storage fails closed on reload and reports a session-only choice", async ({ page }) => {
  const requests = await mockGoogle(page);
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException("blocked", "SecurityError"); };
    Storage.prototype.setItem = () => { throw new DOMException("blocked", "SecurityError"); };
  });
  await page.goto("/"); await expect(banner(page)).toBeVisible(); expect(requests).toEqual([]);
  await banner(page).getByRole("button", { name: "Accept analytics" }).click();
  await expect(page.getByRole("status")).toContainText("could not save");
  await expect.poll(async () => (await commands(page)).filter(c => c[0] === "event").length).toBe(1);
  await page.reload(); await expect(banner(page)).toBeVisible();
  await expect(page.locator('iframe[title="Optional website analytics"]')).toHaveCount(0);
  await banner(page).getByRole("button", { name: "Reject optional" }).click();
  await expect(page.getByRole("status")).toContainText("could not save");
});
