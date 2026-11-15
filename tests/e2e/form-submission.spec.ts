import { test, expect, type Page } from "@playwright/test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import AxeBuilder from "@axe-core/playwright";

test.skip(process.env.KYRO_TEST_FORMS_ENABLED !== "true", "Requires explicit synthetic-version test build; never production defaults.");
async function transport(page: Page, path: string) {
  const requests: { submissionId: string; marketingConsent?: boolean; contactConsent?: boolean }[] = [];
  const stored = new Map<string, { status: string; submissionId: string; persistedAt: string; rowsWritten: number }>();
  await page.route("https://challenges.cloudflare.com/**", route => route.fulfill({ contentType: "application/javascript", body: 'window.turnstile={render:function(el,o){el.textContent="Synthetic verification ready";setTimeout(function(){o.callback("synthetic-test-token");},0);return "test-widget";},remove:function(){}};' }));
  await page.route("**" + path, async route => {
    const data = route.request().postDataJSON(); requests.push(data);
    const receipt = stored.get(data.submissionId) ?? { status: "accepted", submissionId: data.submissionId, persistedAt: new Date().toISOString(), rowsWritten: 1, ...(path.includes("kit-request") ? { download: { status: "ready", token: "t".repeat(43), expiresAt: new Date(Date.now() + 900000).toISOString() } } : {}) };
    stored.set(data.submissionId, receipt);
    // Test-only lost acknowledgement: persistence precedes the simulated 503.
    await route.fulfill({ status: requests.length === 1 ? 503 : 200, contentType: "application/json", body: JSON.stringify(requests.length === 1 ? { error: "Synthetic lost acknowledgement" } : receipt) });
  });
  return { requests, stored };
}
async function perspective(page: Page) {
  await page.getByRole("radio", { name: "Parent / caregiver", exact: true }).check();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByLabel("one challenge", { exact: false }).fill("Synthetic family challenge only.");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await page.getByLabel("What resources or support").fill("Synthetic resources for testing.");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByRole("checkbox", { name: /I agree to be contacted/ })).not.toBeChecked();
  await page.getByRole("checkbox", { name: "I confirm that I am 18 or older.", exact: true }).check();
  await page.getByRole("checkbox", { name: /I acknowledge that I have read/ }).check();
  await page.getByRole("button", { name: "Review my answers" }).click();
}
test("Feedback retains failed answers, reuses ID and permits intentional new submissions", async ({ page }) => {
  const mock = await transport(page, "/api/feedback");
  await page.goto("/help-shape-polaris/"); await perspective(page);
  await page.getByRole("button", { name: "Submit feedback", exact: true }).click();
  await expect(page.getByRole("form").getByRole("alert")).toContainText("Storage could not be confirmed");
  await page.screenshot({ path: "test-results/visual/stage03-feedback-error.png" });
  await expect(page.getByRole("form")).toContainText("Synthetic family challenge only.");
  await page.getByRole("button", { name: "Retry submission", exact: true }).click();
  await expect(page.getByText("Your perspective has been received.")).toBeVisible();
  await page.screenshot({ path: "test-results/visual/stage03-feedback-success.png" });
  expect(mock.requests[0].submissionId).toBe(mock.requests[1].submissionId); expect(mock.stored.size).toBe(1);
  expect(mock.requests[0].contactConsent).toBe(false);
  await page.getByRole("button", { name: "Share another perspective" }).click(); await perspective(page);
  await page.getByRole("button", { name: "Submit feedback", exact: true }).click();
  await expect(page.getByText("Your perspective has been received.")).toBeVisible();
  expect(mock.requests[2].submissionId).not.toBe(mock.requests[0].submissionId); expect(mock.stored.size).toBe(2);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});
test("Kit retries survive modal closure; consent stays separate; real file becomes available after receipt", async ({ page }) => {
  const mock = await transport(page, "/api/kit-request");
  let downloadCalls = 0;
  await page.route("**/api/kit-download", async route => {
    expect(route.request().url()).not.toContain("?");
    expect(route.request().headers().authorization === "Bearer " + "t".repeat(43)).toBe(true);
    downloadCalls++;
    await route.fulfill(downloadCalls === 1 ? { status: 503, contentType: "application/json", body: "{}" } : { status: 200, contentType: "application/pdf", body: fs.readFileSync("private/kit/Kyro_Learning_Home_Leadership_Kit.pdf") });
  });
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto("/home-leadership-kit/");
  await page.getByRole("button", { name: "Download the Kit", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Full name", { exact: true }).fill("Synthetic Visitor");
  await dialog.getByLabel("Email address", { exact: true }).fill("synthetic@example.test");
  await dialog.getByLabel("Phone number", { exact: true }).fill("+1 (202) 555-0123");
  await expect(dialog.getByRole("checkbox", { name: /receive updates/ })).not.toBeChecked(); await dialog.getByRole("checkbox", { name: /receive updates/ }).check();
  await dialog.getByLabel("I confirm that I am 18 or older.", { exact: true }).check();
  await dialog.getByRole("checkbox", { name: /I acknowledge that I have read/ }).check();
  await dialog.getByRole("button", { name: "Review details" }).click();
  await dialog.getByRole("button", { name: "Download the Kit", exact: true }).click();
  await expect(dialog.getByRole("alert")).toContainText("Storage could not be confirmed");
  await page.screenshot({ path: "test-results/visual/stage03-kit-error.png" });
  await page.keyboard.press("Escape"); await page.getByRole("button", { name: "Download the Kit", exact: true }).click();
  await expect(dialog.getByLabel("Full name", { exact: true })).toHaveValue("Synthetic Visitor");
  await expect(dialog.getByRole("checkbox", { name: /receive updates/ })).toBeChecked(); await dialog.getByRole("button", { name: "Retry request" }).click();
  await expect(dialog.getByText("Your kit is ready.")).toBeVisible();
  await dialog.screenshot({ path: "test-results/visual/stage03-kit-success.png" });
  expect(mock.requests[0].submissionId).toBe(mock.requests[1].submissionId); expect(mock.stored.size).toBe(1); expect(mock.requests[0].marketingConsent).toBe(true);
  await dialog.getByRole("button", { name: "Download your kit" }).click();
  await expect(dialog.getByRole("alert")).toContainText("request has already been saved");
  expect(mock.requests.length).toBe(2);
  const downloadEvent = page.waitForEvent("download"); await dialog.getByRole("button", { name: "Download your kit" }).click();
  const download = await downloadEvent, file = await download.path(); expect(file).not.toBeNull();
  expect(createHash("sha256").update(fs.readFileSync(file!)).digest("hex")).toBe("69dda4c82161de29300c8212d82aef9f078be8ca084e475ef730fd6c1ed955da");
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await dialog.getByRole("button", { name: "Start another kit request" }).click();
  await expect(dialog.getByRole("checkbox", { name: /receive updates/ })).not.toBeChecked();
  await expect(dialog.getByLabel("I confirm that I am 18 or older.", { exact: true })).not.toBeChecked();
  await expect(dialog.getByLabel("Full name", { exact: true })).toHaveValue("");
});
