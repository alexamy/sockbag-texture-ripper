import { expect, test } from "@playwright/test";
import path from "node:path";
import url from "node:url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

test("loads", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("editor")).toBeVisible();
  await expect(page.getByTestId("texture")).toBeVisible();
});

test("draws and makes the texture", async ({ page }) => {
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

  // draw first quad
  await editor.click({ position: { x: 100, y: 150 } });
  await editor.click({ position: { x: 230, y: 100 } });
  await editor.click({ position: { x: 200, y: 200 } });
  await editor.click({ position: { x: 120, y: 200 } });

  // see the result
  // draw second quad
  // see the result

  // increase the gap
  // download the texture

  // persist after the reload
  // clear the editor
});

test("controls the regions", async ({ page }) => {
  // pan the editor
  // zoom the editor
  // pan the texture
  // zoom the texture
});

test("shows the help", async ({ page }) => {});
