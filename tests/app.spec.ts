import { expect, test } from "@playwright/test";
import path from "node:path";
import url from "node:url";
import { AppPage } from "./utils/app";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

test("loads", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("editor")).toBeVisible();
  await expect(page.getByTestId("texture")).toBeVisible();
});

test("draws and makes the texture", async ({ page }) => {
  const app = new AppPage(page);
  await app.goto();

  // upload image
  await app.upload("./images/cat.png", import.meta.url);
  await expect(app.editor).toHaveScreenshot("editor-upload.png");

  // draw first quad
  await app.editor.click({ position: { x: 100, y: 150 } });
  await app.editor.click({ position: { x: 230, y: 100 } });
  await app.editor.click({ position: { x: 200, y: 200 } });
  await app.editor.click({ position: { x: 120, y: 200 } });

  // see the result
  // draw second quad
  // see the result

  // increase the gap
  // download the texture

  // persist after the reload
  // clear the editor
});

test("editor", async ({ page }) => {
  // discrads last drawn point
});

test("controls the regions", async ({ page }) => {
  // pan the editor
  // zoom the editor
  // pan the texture
  // zoom the texture
});

test("shows the help", async ({ page }) => {});
