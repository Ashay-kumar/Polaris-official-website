import { expect, test } from "@playwright/test";

const legacyConsentKey = "kyro.analytics-consent";
const gaCookieName = /^_ga(?:_|$)/;

for (const returningVisitor of [false, true]) {
  test(`GA4 stays retired for a ${returningVisitor ? "returning" : "first-time"} visitor`, async ({ page, context, request, baseURL }) => {
    const analyticsRequests: string[] = [];
    context.on("request", outgoing => {
      const { hostname, pathname } = new URL(outgoing.url());
      if (/(^|\.)(google-analytics\.com|googletagmanager\.com|analytics\.google\.com)$/.test(hostname) ||
          /\/(gtag\/js|g\/collect|analytics-frame\.html)\/?$/.test(pathname)) {
        analyticsRequests.push(outgoing.url());
      }
    });

    if (returningVisitor) {
      await context.addInitScript(key => {
        if (window.top === window && !localStorage.getItem(key)) {
          localStorage.setItem(key, JSON.stringify({ version: 1, choice: "granted", timestamp: Date.now() }));
        }
      }, legacyConsentKey);
      await context.addCookies([{ name: "_ga", value: "GA1.1.123.456", url: baseURL! }]);
    }

    const originalCookies = (await context.cookies()).filter(cookie => gaCookieName.test(cookie.name));
    const checkPage = async () => {
      await expect(page.locator("#cookie-banner-title, #cookie-preferences-title")).toHaveCount(0);
      await expect(page.getByRole("button", { name: "Cookie preferences", exact: true })).toHaveCount(0);
      await expect(page.locator('iframe[src*="analytics-frame.html"]')).toHaveCount(0);
      expect((await context.cookies()).filter(cookie => gaCookieName.test(cookie.name))).toEqual(originalCookies);
    };

    const home = returningVisitor ? "/?utm_source=stage08c" : "/";
    await page.goto(home);
    await checkPage();
    await page.locator("footer").getByRole("link", { name: "Privacy Policy", exact: true }).click();
    await expect(page).toHaveURL(/\/privacy-policy\/?$/);
    await checkPage();
    await page.reload();
    await checkPage();
    await page.goBack();
    await expect(page).toHaveURL(new URL(home, baseURL).href);
    await checkPage();

    expect(analyticsRequests).toEqual([]);
    expect((await request.get("/analytics-frame.html")).status()).toBe(404);
  });
}
