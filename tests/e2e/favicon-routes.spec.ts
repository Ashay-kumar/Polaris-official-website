import { test, expect } from "@playwright/test";
import fs from "node:fs";
test("Every route references only approved favicon resources, including generated cache URLs", async ({ page, request }) => {
  for (const path of ["/", "/our-thinking/", "/home-leadership-kit/", "/help-shape-polaris/", "/about/"]) {
    await page.goto(path);
    const icons = await page.locator('link[rel="icon"],link[rel="apple-touch-icon"],link[rel="shortcut icon"]').evaluateAll(nodes => nodes.map(node => node.getAttribute("href")!));
    expect(icons.length).toBeGreaterThanOrEqual(3);
    for (const url of icons) {
      expect(url).toMatch(/^\/(?:icon\.svg|favicon\.ico|apple-icon\.png)(?:\?|$)/);
      const response = await request.get(url); expect(response.status()).toBe(200);
      expect(await response.body()).toEqual(fs.readFileSync("src/app/" + url.split("?")[0].slice(1)));
    }
  }
});
