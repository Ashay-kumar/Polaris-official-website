import { test, expect } from "@playwright/test";
import { sitePath } from "./site-path";
test("Styles, local fonts and decorative assets load under the Pages subpath", async ({ page, request }) => {
  const failures: string[]=[];
  page.on("response",response=>{if(response.status()>=400)failures.push(response.url());});
  page.on("requestfailed",request=>failures.push(request.url()));
  for (const route of ["/", "/our-thinking/", "/home-leadership-kit/", "/help-shape-polaris/", "/about/"]) {
    await page.goto(sitePath(route));
    await page.evaluate(async ()=>{await document.fonts.ready; await Promise.all([...document.fonts].map(font=>font.load()));});
    expect(await page.evaluate(()=>[...document.fonts].every(font=>font.status==="loaded"))).toBe(true);
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
