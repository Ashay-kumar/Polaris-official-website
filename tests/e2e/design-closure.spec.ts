import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Kit dialog validates, traps/restores focus and never captures or downloads", async ({ page }, testInfo) => {
 const outgoing:string[]=[];const downloads:string[]=[];
 page.on("request",r=>{if(r.method()!=="GET")outgoing.push(r.url());});page.on("download",d=>downloads.push(d.suggestedFilename()));
 for(const width of [1440,1024,768,390,320]) {
  await page.setViewportSize({width,height:844});await page.goto("/home-leadership-kit/");
  const hero = page.locator("main > section").first(); const illustration = hero.locator("figure").first();
  expect((await illustration.boundingBox())!.y+(await illustration.boundingBox())!.height).toBeLessThanOrEqual((await hero.boundingBox())!.y+(await hero.boundingBox())!.height);
  const opener=page.getByRole("button",{name:"Download the Kit",exact:true});await opener.click();
  const dialog=page.getByRole("dialog",{name:"Your Kit Is Almost Yours!"});await expect(dialog).toBeVisible();
  if(width===1440||width===390||width===320)await page.screenshot({path:"test-results/visual/kit-modal-top-"+width+".png"});
  await expect(dialog.getByLabel("Full name",{exact:true})).toBeFocused();
  await page.keyboard.press("Shift+Tab");await expect(dialog.getByRole("button",{name:"Close kit dialog"})).toBeFocused();
  await page.keyboard.press("Shift+Tab");await expect(dialog.getByRole("button",{name:"Review details"})).toBeFocused();
  await page.keyboard.press("Tab");await expect(dialog.getByRole("button",{name:"Close kit dialog"})).toBeFocused();
  await expect(dialog.getByRole("checkbox")).not.toBeChecked();
  await dialog.getByRole("button",{name:"Review details"}).click();await expect(dialog.getByRole("alert")).toBeFocused();
  await expect(dialog.getByRole("alert")).toContainText("Enter your full name");await expect(dialog.getByRole("alert")).toContainText("Enter your phone number");await expect(dialog.getByLabel("Phone number",{exact:true})).toHaveAttribute("required");
  await dialog.getByLabel("Full name",{exact:true}).fill("Preview Visitor");await dialog.getByLabel("Email address",{exact:true}).fill("preview@example.test");
  await dialog.getByLabel("Phone number",{exact:true}).fill("07700");await dialog.getByRole("button",{name:"Review details"}).click();await expect(dialog.getByRole("alert")).toContainText("valid phone");
  await dialog.getByLabel("Phone number",{exact:true}).fill("+1 (202) 555-0123");await dialog.getByRole("button",{name:"Review details"}).click();
  await expect(dialog.getByRole("status")).toContainText("Review your details");if(width===1440){await dialog.getByRole("checkbox").check();await dialog.getByRole("button",{name:"Review details"}).click();await expect(dialog.getByRole("status")).toContainText("Selected");await dialog.getByRole("checkbox").uncheck();await dialog.getByRole("button",{name:"Review details"}).click();await expect(dialog.getByRole("status")).toContainText("Not selected");}
  await expect(dialog.getByRole("button",{name:"Download the Kit"})).toBeDisabled();
  expect(await dialog.evaluate(e=>e.scrollWidth<=e.clientWidth)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(width===1440||width===390||width===320){await page.screenshot({path:'test-results/visual/kit-modal-'+width+'.png'});const axe=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();expect(axe.violations).toEqual([]);}
  await page.keyboard.press("Escape");await expect(dialog).toHaveCount(0);await expect(opener).toBeFocused();
  await opener.click();await expect(page.getByLabel("Full name",{exact:true})).toHaveValue("");await page.getByRole("button",{name:"Close kit dialog"}).click();await expect(opener).toBeFocused();
 }
 expect(outgoing).toEqual([]);expect(downloads).toEqual([]);
 expect(await page.evaluate(()=>({local:localStorage.length,session:sessionStorage.length}))).toEqual({local:0,session:0});
 await testInfo.attach("capture-safeguards",{body:"No non-GET requests, downloads or persistent storage during validation.",contentType:"text/plain"});
});

test("Every resource CTA opens the shared dialog and perspective CTAs have no arrows",async({page})=>{
 for(const route of ["/","/our-thinking/","/home-leadership-kit/","/help-shape-polaris/","/about/"]){
  await page.goto(route);
  const perspective=page.locator('main a[class*="button"], main button[aria-haspopup="dialog"], header a[class*="headerCta"]');
  for(const link of await perspective.all())expect(await link.textContent()).not.toMatch(/[\u2197\u2192\u2193\u2191]/);
  const triggers=page.locator('button[aria-haspopup="dialog"]');
  for(let i=0;i<await triggers.count();i++){await triggers.nth(i).click();await expect(page.getByRole("dialog",{name:"Your Kit Is Almost Yours!"})).toBeVisible();await page.keyboard.press("Escape");await expect(triggers.nth(i)).toBeFocused();}
 }
});

test("Optional feedback phone validates, survives navigation and appears in review",async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto("/help-shape-polaris/#conversation");
 await page.getByRole("radio",{name:"Parent / caregiver",exact:true}).check();await page.getByRole("button",{name:"Next",exact:true}).click();
 await page.getByLabel("one challenge",{exact:false}).fill("Making time for everyday conversations.");await page.getByRole("button",{name:"Next",exact:true}).click();
 await page.getByLabel("What resources or support").fill("Simple activities to explore together.");await page.getByRole("button",{name:"Next",exact:true}).click();
 const phone=page.getByLabel("Your phone number");await expect(phone).toHaveAttribute("type","tel");await expect(phone).not.toHaveAttribute("required");await phone.fill("12345");
 await page.getByRole("button",{name:"Review my answers"}).click();await expect(page.getByRole("form").getByRole("alert")).toContainText("valid phone");
 await phone.fill("+1 (202) 555-0123");await page.getByRole("button",{name:"Back",exact:false}).click();await page.getByRole("button",{name:"Next",exact:true}).click();await expect(phone).toHaveValue("+1 (202) 555-0123");await expect(page.getByRole("checkbox")).not.toBeChecked();
 await phone.scrollIntoViewIfNeeded();await page.screenshot({path:"test-results/visual/feedback-contact-390.png"});await page.getByRole("form").screenshot({path:"test-results/visual/feedback-contact-full.png"});
 const axe=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();expect(axe.violations).toEqual([]);
 await page.getByRole("button",{name:"Review my answers"}).click();await expect(page.getByRole("form")).toContainText("+12025550123");await expect(page.getByRole("button",{name:"Submit feedback"})).toBeDisabled();await page.getByRole("form").screenshot({path:"test-results/visual/feedback-review.png"});
});
