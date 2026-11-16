import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import { sitePath } from "./site-path";

const sha256 = (bytes: Buffer) =>
  createHash("sha256").update(bytes).digest("hex");

test("Approved Kyro Learning PDF stays private while approved previews remain available", async ({ request, page }) => {
  const pdfPath = "/downloads/Kyro_Learning_Home_Leadership_Kit.pdf";

  const response = await request.get(sitePath(pdfPath));

  expect(response.status()).toBe(404);

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
  await expect(page.getByText("Get all 12 activities, age guidance and the four-week tracker in one free kit.")).toBeVisible();
  await expect(page.getByRole("button", { name: "View the Tracker in the Kit" })).toBeVisible();
});
