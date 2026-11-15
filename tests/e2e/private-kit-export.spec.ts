import { test, expect } from "@playwright/test";
test("Old PDF URLs are unavailable and tracker/preview entry points request kit access", async ({ request, page }) => {
  for (const path of ["Kyro_Learning_Home_Leadership_Kit.pdf", "polaris-home-leadership-kit.pdf", "Polaris_Home_Leadership_Kit.pdf"]) {
    const response = await request.get("/downloads/" + path); expect(response.status()).toBe(404); expect(response.headers()["content-type"]).not.toContain("application/pdf");
  }
  await page.goto("/home-leadership-kit/");
  await expect(page.locator('a[href*=".pdf"]')).toHaveCount(0);
  await page.getByRole("button", { name: "View the Tracker in the Kit", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Your Kit Is Almost Yours!" })).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("button", { name: "Download the Kit", exact: true })).toBeDisabled();
});
