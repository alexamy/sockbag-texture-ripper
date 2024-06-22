import { expect, test } from "@playwright/test";

test("loads", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("editor")).toBeVisible();
  await expect(page.getByTestId("texture")).toBeVisible();
});
