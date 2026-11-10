import { test, expect } from "@playwright/test";
import { sitePath } from "./site-path";
test("Styles, local fonts and decorative assets load at the domain root", async ({ page, request }) => {
  expect((await request.get("/Polaris-official-website/")).status()).toBe(404);
  const failures: string[]=[];
  page.on("response",response=>{if(response.status()>=400)failures.push(response.url());});
  page.on("requestfailed",request=>failures.push(request.url()));
  for (const route of ["/", "/our-thinking/", "/home-leadership-kit/", "/help-shape-polaris/", "/about/"]) {
    await page.goto(sitePath(route));
    expect(await page.content()).not.toContain("/Polaris-official-website");
    // Check the actual web-font families, not platform-specific local fallback faces.
    const loaded = await page.evaluate(async () => {
      await document.fonts.ready;
      return Promise.all([document.body, document.querySelector("h1")!].map(async element => {
        const style = getComputedStyle(element);
        const family = style.fontFamily.split(",")[0];
        const faces = await document.fonts.load(style.fontWeight + " 16px " + family);
        return faces.length > 0 && faces.every(face => face.status === "loaded");
      }));
    });
    expect(loaded).toEqual([true, true]);
    const css = await page.locator('link[rel="stylesheet"]').evaluateAll(links=>links.map(link=>(link as HTMLLinkElement).href));
    for(const href of css) {
      const response=await request.get(href);expect(response.ok()).toBe(true);
      for (const [,url] of (await response.text()).matchAll(/url\(["']?([^\)"']+)["']?\)/g)) {
        if(url.startsWith("data:"))continue;
        const asset=new URL(url,href);
        expect(asset.pathname.startsWith(sitePath("/")),asset.href).toBe(true);
        expect((await request.get(asset.href)).ok(),asset.href).toBe(true);
      }
    }
  }
  expect(failures).toEqual([]);
});
