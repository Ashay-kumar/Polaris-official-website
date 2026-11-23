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
    for (const [path, linkedPolicy] of Object.entries(policies)) await expect(page.locator("footer").getByRole("link", { name: linkedPolicy.title, exact: true })).toHaveAttribute("href", new RegExp(`^/${path}/?$`));
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 844 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  }
});

test("Both submission flows retain privacy references after the form UX update", async ({ page }) => {
  await page.goto("/help-shape-polaris/");
  await page.locator("details#preview-info summary").click();
  await expect(page.locator("details#preview-info").getByRole("link", { name: /Privacy Policy/ })).toHaveAttribute("href", /^\/privacy-policy\/?$/);
  await page.goto("/home-leadership-kit/");
  await page.getByRole("button", { name: "Download the Kit", exact: true }).click();
  const links = page.getByRole("dialog").getByRole("link", { name: /Privacy Policy/ });
  await expect(links).toHaveCount(2); // Required acknowledgement and retention notice.
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute("href", /^\/privacy-policy\/?$/); await expect(link).toHaveAttribute("target", "_blank");
  }
  await expect(page.getByRole("dialog").getByRole("button", { name: "Submit and download kit", exact: true })).toBeDisabled();
});
