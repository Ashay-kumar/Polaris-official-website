import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { sitePath } from "./site-path";

const sha256 = (bytes: Buffer) =>
  createHash("sha256").update(bytes).digest("hex");

test("Approved Kyro Learning PDF and previews are served intact", async ({ request, page }) => {
  const pdfPath = "/downloads/Kyro_Learning_Home_Leadership_Kit.pdf";
  const expectedHash =
    "69dda4c82161de29300c8212d82aef9f078be8ca084e475ef730fd6c1ed955da";

  const response = await request.get(sitePath(pdfPath));

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("application/pdf");

  const bytes = Buffer.from(await response.body());

  expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
  expect(sha256(bytes)).toBe(expectedHash);

  const previews = JSON.parse(
    fs.readFileSync("src/content/kit-previews.json", "utf8")
  );

  expect(Object.keys(previews).sort()).toEqual(["1", "3", "7"]);

  for (const pageNumber of [1, 3, 7]) {
    const preview = previews[String(pageNumber)];
    const imageResponse = await request.get(sitePath(preview.src));

    expect(imageResponse.status()).toBe(200);
    expect(sha256(Buffer.from(await imageResponse.body()))).toBe(preview.sha256);
  }

  await page.goto(sitePath("/home-leadership-kit"));
  await expect(page.getByText("The updated eight-page Kyro Learning PDF.")).toBeVisible();
  await expect(page.getByRole("link", { name: "View the Tracker in the Kit" }))
    .toHaveAttribute("href", /Kyro_Learning_Home_Leadership_Kit\.pdf#page=7$/);
});
