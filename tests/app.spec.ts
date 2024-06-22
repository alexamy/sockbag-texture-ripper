import { expect, test } from "@playwright/test";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

test("loads", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("editor")).toBeVisible();
  await expect(page.getByTestId("texture")).toBeVisible();
});

test("works", async ({ page }) => {
  await page.goto("/");

  const editor = page.getByTestId("editor");
  const texture = page.getByTestId("texture");

  // upload image
  const image = path.join(__dirname, "cat.png");
  const fileChooserPromise = page.waitForEvent("filechooser");

  await page.getByRole("button", { name: "Upload" }).click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles(image);

  await expect(editor).toHaveScreenshot("editor-upload.png");
});
