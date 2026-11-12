import {test,expect} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {getCountries,getCountryCallingCode,parsePhoneNumberFromString} from "libphonenumber-js/max";
import fs from "node:fs";
test("Maintained phone metadata and local flags cover every supported country",async({request})=>{
 for(const country of getCountries()){expect(fs.existsSync("public/phone-flags/"+country+".svg")).toBe(true);expect(getCountryCallingCode(country)).toMatch(/^\d+$/);}
 expect((await request.get("/phone-flags/IN.svg")).ok()).toBe(true);expect(parsePhoneNumberFromString("+12025550123")?.isValid()).toBe(true);
});
test("Country picker searches names/codes and supports keyboard without closing the kit",async({page})=>{
 for(const width of [1440,1024,768,390,320]){
 await page.setViewportSize({width,height:844});await page.goto("/home-leadership-kit/");await page.getByRole("button",{name:"Download the Kit",exact:true}).click();const dialog=page.getByRole("dialog");
 const country=dialog.getByRole("button",{name:"Country: India (+91)",exact:true});await country.click();const search=dialog.getByRole("combobox",{name:"Search countries or dialling codes"});await expect(search).toBeFocused();
 await search.fill("United Kingdom");await expect(dialog.getByRole("option")).toHaveCount(1);await page.keyboard.press("ArrowDown");await page.keyboard.press("Enter");await expect(dialog.getByRole("button",{name:"Country: United Kingdom (+44)",exact:true})).toBeFocused();
 await dialog.getByRole("button",{name:"Country: United Kingdom (+44)",exact:true}).click();await search.fill("+91");await expect(dialog.getByRole("option",{name:"India +91",exact:true})).toBeVisible();
 if([1440,390,320].includes(width)){await page.screenshot({path:"test-results/visual/country-picker-"+width+".png"});const axe=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa","wcag22aa"]).analyze();expect(axe.violations).toEqual([]);}
 await page.keyboard.press("Enter");await expect(country).toBeFocused();if(width===1440){await dialog.getByLabel("Phone number",{exact:true}).fill("+12025550123");await dialog.getByRole("button",{name:"Country: United States (+1)",exact:true}).click();await search.fill("India");await page.keyboard.press("Enter");await expect(dialog.getByLabel("Phone number",{exact:true})).toHaveValue("2025550123");await expect(country).toBeFocused();}await country.click();await search.fill("no such country");await expect(dialog.getByRole("option")).toHaveCount(0);await expect(dialog.getByText("No matching countries.")).toBeVisible();await page.keyboard.press("Escape");await expect(dialog).toBeVisible();await expect(country).toBeFocused();await page.keyboard.press("Escape");await expect(dialog).toHaveCount(0);
 }
});
