import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("Kit dialog preserves focus, optional consent and disabled review-release safeguards",async({page})=>{await page.goto('/home-leadership-kit/');const opener=page.getByRole('button',{name:'Download the Kit',exact:true});await opener.click();const dialog=page.getByRole('dialog');await expect(dialog.getByLabel('Full name',{exact:true})).toBeFocused();await page.keyboard.press('Shift+Tab');await expect(dialog.getByRole('button',{name:'Close kit dialog'})).toBeFocused();await page.keyboard.press('Shift+Tab');await expect(dialog.getByRole('link',{name:/Privacy Policy/}).last()).toBeFocused();await page.keyboard.press('Tab');await expect(dialog.getByRole('button',{name:'Close kit dialog'})).toBeFocused();await expect(dialog.getByRole('checkbox',{name:/receive updates/})).not.toBeChecked();await expect(dialog.getByRole('button',{name:'Submit and download kit'})).toBeDisabled();await page.keyboard.press('Escape');await expect(opener).toBeFocused();});

test("Every resource CTA opens the shared dialog and perspective CTAs have no arrows",async({page})=>{
 for(const route of ["/","/our-thinking/","/home-leadership-kit/","/help-shape-polaris/","/about/"]){
  await page.goto(route);
  const perspective=page.locator('main a[class*="button"], main button[aria-haspopup="dialog"], header a[class*="headerCta"]');
  for(const link of await perspective.all())expect(await link.textContent()).not.toMatch(/[\u2197\u2192\u2193\u2191]/);
  const triggers=page.locator('main button[aria-haspopup="dialog"]');
  for(let i=0;i<await triggers.count();i++){await triggers.nth(i).click();await expect(page.getByRole("dialog",{name:"Your Kit Is Almost Yours!"})).toBeVisible();await page.keyboard.press("Escape");await expect(triggers.nth(i)).toBeFocused();}
 }
});

test("Feedback contact fields remain optional and precede confirmations",async({page})=>{await page.goto('/help-shape-polaris/');const form=page.getByRole('form');await expect(form.getByLabel('Your phone number')).toHaveAttribute('type','tel');await expect(form.getByLabel('Your phone number')).not.toHaveAttribute('required');await form.getByLabel('Your phone number').fill('+12025550123');await form.getByRole('radio',{name:'Yes',exact:true}).check();await expect(form.getByLabel('Your phone number')).toHaveValue('+12025550123');await expect(form.getByRole('button',{name:'Submit Your Perspective'})).toBeDisabled();expect((await new AxeBuilder({page}).include('#conversation').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);});
