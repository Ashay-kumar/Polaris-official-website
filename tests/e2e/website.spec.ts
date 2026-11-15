import { sitePath } from "./site-path";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs";

const pages = ["/", "/our-thinking", "/home-leadership-kit", "/help-shape-polaris", "/about"];
const viewports = [1440, 1024, 768, 390, 320];
for (const width of viewports) {
  test(`All routes reflow at ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: width < 500 ? 844 : 1000 });
    for (const route of pages) {
      const errors: string[] = [];
      const listener = (error: Error) => errors.push(error.message);
      page.on("pageerror", listener);
      const response = await page.goto(sitePath(route));
      expect(response?.status(), route).toBe(200);
      await page.evaluate(() => document.fonts.ready);
      await page.locator("img").evaluateAll(async elements => {
        const images = elements as HTMLImageElement[];
        images.forEach(image => { image.loading = "eager"; });
        await Promise.all(images.map(image => image.decode().catch(() => undefined)));
      });
      await expect(page.locator("h1"), route).toHaveCount(1);
      if (route === "/") {
        const headline = await page.locator("h1").boundingBox();
        const image = await page.getByRole("img", { name: "Illustration of a child exploring the world through a cardboard telescope", exact: true }).boundingBox();
        expect(headline && image && (headline.x + headline.width <= image.x + 1 || headline.y + headline.height <= image.y + 1), "Home headline must not overlap its photograph").toBeTruthy();
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${route} overflows at ${width}`).toBe(true);
      const broken = await page.locator("img").evaluateAll(elements => (elements as HTMLImageElement[]).filter(image => image.complete && image.naturalWidth === 0).map(image => image.src));
      expect(broken, route).toEqual([]);
      expect(errors, route).toEqual([]);
      if (width === 1440 || width === 390) {
        await page.screenshot({ path: `test-results/visual/${route === "/" ? "home" : route.slice(1)}-${width}.png`, fullPage: true });
        await page.locator("main > section").first().screenshot({ path: `test-results/visual/${route === "/" ? "home" : route.slice(1)}-${width}-hero.png` });
      }
      if (width === 1440 || width === 390) {
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
        await testInfo.attach(`axe-${route}-${width}`, { body: JSON.stringify(results.violations, null, 2), contentType: "application/json" });
        expect.soft(results.violations, `Accessibility ${route} at ${width}`).toEqual([]);
      }
      page.off("pageerror", listener);
    }
  });
}

test("Mobile navigation supports keyboard, Escape and route changes", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(sitePath("/"));
  const toggle = page.getByRole("button", { name: "Open navigation" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Close navigation" })).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await toggle.click();
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "About", exact: true }).click();
  await expect(page).toHaveURL(/\/about\/?$/);
  await expect(page.getByRole("button", { name: "Open navigation" })).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeHidden();
});

test("Quality disclosures and all twelve original activities are accessible", async ({ page }) => {
  await page.goto(sitePath("/our-thinking"));
  await page.locator("#communication summary").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#communication")).toHaveAttribute("open", "");
  await expect(page.locator("#communication")).toContainText("Three-part day");
  await page.goto(sitePath("/home-leadership-kit"));
  const original = JSON.parse(fs.readFileSync("src/content/activities.json", "utf8"));
  for (const quality of ["Communication", "Leadership", "Curiosity", "Resilience"]) {
    await page.getByRole("radio", { name: `${quality} (3)`, exact: true }).check();
    const selected = original.filter((a: { quality: string }) => a.quality === quality.toLowerCase());
    for (const activity of selected) {
      const card = page.getByRole("article").filter({ has: page.getByRole("heading", { name: activity.name, exact: true }) });
      await card.locator("summary").click();
      await expect(card).toContainText(activity.duration);
      await expect(card).toContainText(activity.instructions);
      await expect(card).toContainText(activity.ages);
    }
  }
});

test("Feedback preserves answers without submitting in the review-release build",async({page})=>{const outgoing:string[]=[];page.on('request',r=>{if(r.method()!=='GET')outgoing.push(r.url());});await page.goto(sitePath('/help-shape-polaris#conversation'));const form=page.getByRole('form');await form.getByRole('radio',{name:'Parent / caregiver',exact:true}).check();await form.getByLabel('What resources or support').fill('Synthetic everyday activities.');await form.getByRole('radio',{name:'Yes',exact:true}).check();await expect(form.getByRole('checkbox',{name:/I agree to be contacted/})).not.toBeChecked();await expect(form.getByRole('button',{name:'Submit your perspective'})).toBeDisabled();expect(outgoing).toEqual([]);await page.reload();await expect(form.getByRole('radio',{name:'Parent / caregiver',exact:true})).not.toBeChecked();});

test("Public PDF is unavailable and all internal links resolve", async ({ page, request }) => {
  const path = "/downloads/polaris-home-leadership-kit.pdf";
  const response = await request.get(sitePath(path));
  expect(response.status()).toBe(404);
  const checked = new Set<string>();
  for (const route of pages) {
    await page.goto(sitePath(route));
    const originUrl = page.url();
    const links = await page.locator("a[href]").evaluateAll(elements => elements.map(e => e.getAttribute("href")!));
    for (const href of links) {
      if (!href.startsWith("/") && !href.startsWith("#")) continue;
      const target = new URL(href, originUrl);
      if (!checked.has(target.pathname)) { expect((await request.get(target.pathname)).ok(), target.pathname).toBe(true); checked.add(target.pathname); }
      if (target.hash && !target.pathname.endsWith(".pdf")) {
        if (target.pathname !== new URL(page.url()).pathname) await page.goto(target.pathname);
        await expect(page.locator(`[id="${target.hash.slice(1)}"]`), href).toHaveCount(1);
      }
    }
  }
  await page.goto(sitePath("/"));
  await page.getByRole("button", { name: "Download the Kit", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Your Kit Is Almost Yours!" })).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("button", { name: "Download the Kit", exact: true })).toBeDisabled();
  await page.keyboard.press("Escape");
});

test("Reduced motion and skip link work", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(sitePath("/"));
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  const duration = await page.locator("main a").first().evaluate(element => getComputedStyle(element).transitionDuration);
  expect(duration).toBe("0s");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("main a").first().focus();
  expect(await page.locator("main a").first().evaluate(element => getComputedStyle(element).outlineColor)).toBe("rgb(26, 64, 181)");
});
