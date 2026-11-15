import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";

const routes = ["/", "/our-thinking/", "/home-leadership-kit/", "/help-shape-polaris/", "/about/"];
const widths = [1440, 1101, 1100, 1024, 800, 799, 768, 680, 679, 390, 320];
for (const width of widths) test(`Logo frames and navigation fit at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  for (const route of routes) {
    await page.goto(route);
    await page.evaluate(() => document.fonts.ready);
    const frames = page.locator('[data-logo-frame="horizontal"]');
    await expect(frames).toHaveCount(route === "/home-leadership-kit/" ? 4 : route === "/" || route === "/our-thinking/" ? 3 : 2);
    for (const frame of await frames.all()) {
      const metric = await frame.evaluate(el => ({
        width: parseFloat(getComputedStyle(el).width), height: parseFloat(getComputedStyle(el).height),
        location: el.closest("header") ? "header" : el.closest("footer") ? "footer" : "kit",
      }));
      expect(metric.width, route + " " + metric.location).toBeCloseTo(metric.location === "header" ? (width <= 799 ? 175 : 220) : metric.location === "footer" ? 240 : 160, 1);
      expect(metric.width / metric.height).toBeCloseTo(1280 / 672, 2);
      await expect(frame.locator("img")).toHaveAttribute("alt", "Kyro Learning");
      await expect(frame.locator("img")).toHaveAttribute("src", /kyro-learning-logo-horizontal.svg$/);
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), route + " horizontal overflow").toBe(true);
    const header = page.locator("header [data-logo-frame]");
    const nav = page.locator("header nav");
    if (await nav.isVisible()) {
      const a = await header.boundingBox(), b = await nav.boundingBox();
      expect(a && b && a.x + a.width <= b.x + 1, "Logo and navigation must not collide").toBeTruthy();
      expect(b && b.x + b.width <= width + 1, "Navigation stays on screen").toBeTruthy();
    }
  }
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const frame = page.locator("header [data-logo-frame]");
  await frame.locator("img").evaluate((img: HTMLImageElement) => img.decode());
  const { data, info } = await sharp(await frame.screenshot()).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let left = info.width, right = -1;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    const i = (y * info.width + x) * 4;
    if (data[i] < 100 && data[i + 1] < 140) { left = Math.min(left, x); right = Math.max(right, x); }
  }
  expect((right - left + 1) / info.width, "Actual ink occupies most of frame").toBeGreaterThan(.95);
  expect(left).toBeGreaterThan(0);
  expect(right).toBeLessThan(info.width - 1);
});

test("Approved SVG bytes and all nontransparent artwork are retained", async () => {
  const file = "public/brand/logos/v2.0/svg/kyro-learning-logo-horizontal.svg";
  const contract = JSON.parse(fs.readFileSync("docs/brand-sync/contract.json", "utf8")) as { files: { destination: string; sha256: string }[] };
  expect(createHash("sha256").update(fs.readFileSync(file)).digest("hex")).toBe(contract.files.find(f => f.destination === file)?.sha256);
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let clippedPixels = 0;
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 0 && !(x >= 200 && x < 1480 && y >= 64 && y < 736)) clippedPixels++;
  }
  expect(clippedPixels, "Presentation frame must retain every visible SVG pixel").toBe(0);
});
