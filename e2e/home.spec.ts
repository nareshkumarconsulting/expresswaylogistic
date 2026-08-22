import { test, expect } from "@playwright/test";

test.describe("marketing site", () => {
  test("home page loads with brand", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "Global Shipping",
    );
    await expect(page.getByText("ExpressWay").first()).toBeVisible();
  });

  test("track page shows not found for unknown id", async ({ page }) => {
    await page.goto("/track");
    await page.getByLabel(/tracking id/i).fill("EW-99999");
    await page.getByRole("button", { name: /track/i }).click();
    await expect(page.getByText(/no shipment found/i)).toBeVisible();
  });
});
