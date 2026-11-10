import { sitePath } from "./site-path";
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { createHash } from "node:crypto";
import sharp from "sharp";

test("Approved favicon formats and PDF previews are served intact", async ({ page, request }) => {
  const source = fs.readFileSync("public/brand/logos/v1.1/svg/polaris-icon-primary.svg");
  const svg = await request.get(sitePath("/icon.svg"));
  expect(svg.status()).toBe(200);
  expect(svg.headers()["content-type"]).toContain("image/svg+xml");
  expect((await svg.body()).equals(source)).toBe(true);
  const apple = await request.get(sitePath("/apple-icon.png"));
  expect(apple.status()).toBe(200);
  expect(apple.headers()["content-type"]).toContain("image/png");
  expect(await sharp(await apple.body()).metadata()).toMatchObject({ width: 180, height: 180 });
  const ico = await request.get(sitePath("/favicon.ico"));
  expect(ico.status()).toBe(200);
  expect(ico.headers()["content-type"]).toMatch(/image\/(x-icon|vnd.microsoft.icon)/);
  const bytes = await ico.body();
  expect(bytes.readUInt16LE(2)).toBe(1);
  expect(bytes.readUInt16LE(4)).toBe(3);
  for (let i = 0; i < 3; i++) {
    const entry = 6 + i * 16;
    const size = [16, 32, 48][i];
    expect(bytes[entry]).toBe(size);
    const frame = bytes.subarray(bytes.readUInt32LE(entry + 12), bytes.readUInt32LE(entry + 12) + bytes.readUInt32LE(entry + 8));
    expect(await sharp(frame).metadata()).toMatchObject({ width: size, height: size });
  }
  const previews = JSON.parse(fs.readFileSync("src/content/kit-previews.json", "utf8"));
  for (const preview of Object.values(previews) as { src: string; width: number; height: number; sha256: string }[]) {
    const response = await request.get(sitePath(preview.src));
    expect(response.status()).toBe(200);
    expect(createHash("sha256").update(await response.body()).digest("hex")).toBe(preview.sha256);
  }
  for (const scheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto(sitePath("/"));
    const icons = await page.locator('link[rel="icon"]').evaluateAll(elements => elements.map(element => element.getAttribute("href")));
    expect(icons.some(href => href?.startsWith(sitePath("/icon.svg")))).toBe(true);
    expect(icons.some(href => href?.startsWith(sitePath("/favicon.ico")))).toBe(true);
    await expect(page.locator('link[rel="apple-touch-icon"]').first()).toHaveAttribute("href", /apple-icon/);
  }
});
