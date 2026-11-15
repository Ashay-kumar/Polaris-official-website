import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import policies from "../../src/content/policies.json" with { type: "json" };

test("Approved legal content, identifiers, footer links and responsive accessibility", async ({ page, request }) => {
  for (const [slug, policy] of Object.entries(policies)) {
    expect((await request.get(`/${slug}/`)).status()).toBe(200);
    await page.goto(`/${slug}/`);
    const article = page.locator("article[data-policy-id]");
    await expect(article).toHaveAttribute("data-policy-id", policy.id);
    await expect(article.getByRole("heading", { level: 1 })).toHaveText(policy.title);
    expect(await article.getByRole("heading", { level: 2 }).allTextContents()).toEqual(policy.sections.map(s => s.heading));
    expect(await article.locator("section p, section li").allTextContents()).toEqual(policy.sections.flatMap(s => s.blocks.map(b => b.text)));
    await expect(article).not.toContainText("Proposed effective date");
    await expect(article).not.toContainText("ready-to-review licensing decision");
    for (const [path, linkedPolicy] of Object.entries(policies)) await expect(page.locator("footer").getByRole("link", { name: linkedPolicy.title, exact: true })).toHaveAttribute("href", `/${path}`);
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  }
});

test("Necessary-only preferences are accessible and create no browser storage", async ({ page, context }) => {
  const thirdParty: string[] = [];
  page.on("request", request => { if (!request.url().startsWith("http://127.0.0.1:4173")) thirdParty.push(request.url()); });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: "Cookie preferences", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Cookie preferences", exact: true });
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole("button", { name: "Close cookie preferences" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Tab"); await expect(dialog.getByRole("link")).toBeFocused();
  await page.keyboard.press("Shift+Tab"); await expect(close).toBeFocused();
  await expect(dialog.getByRole("checkbox")).toHaveCount(0);
  await expect(dialog.getByRole("button")).toHaveCount(1);
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true);
  }
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.screenshot({ path: "test-results/visual/stage04-cookie-preferences-mobile.png" });
  await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
  await trigger.click(); await close.click(); await expect(trigger).toBeFocused();
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
  expect(await context.cookies()).toEqual([]); expect(thirdParty).toEqual([]);
});

test("Both submission flows retain privacy references after the form UX update", async ({ page }) => {
  await page.goto("/help-shape-polaris/");
  await page.locator("details#preview-info summary").click();
  await expect(page.locator("details#preview-info").getByRole("link", { name: /Privacy Policy/ })).toHaveAttribute("href", "/privacy-policy");
  await page.goto("/home-leadership-kit/");
  await page.getByRole("button", { name: "Download the Kit", exact: true }).click();
  const links = page.getByRole("dialog").getByRole("link", { name: /Privacy Policy/ });
  await expect(links).toHaveCount(2); // Required acknowledgement and retention notice.
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("href", "/privacy-policy"); await expect(link).toHaveAttribute("target", "_blank");
  }
  await expect(page.getByRole("dialog").getByRole("button", { name: "Submit and download kit", exact: true })).toBeDisabled();
});
