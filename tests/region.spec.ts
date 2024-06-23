import { test } from "@playwright/test";
import { AppPage } from "./utils/app";

test("controls the editor region", async ({ page }) => {
  const app = new AppPage(page);
  await app.goto();
  await app.upload("./images/cat.png", import.meta.url);

  // no transformation
  await app.editor.toHaveScreenshot();

  // pan
  await page.mouse.move(0, 0);
  await page.keyboard.down("Space");
  await page.mouse.move(150, 110);
  await app.editor.toHaveScreenshot();
  await page.keyboard.up("Space");

  // zoom in
  await page.keyboard.down("Space");
  await app.editor.region.focus();
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(10);
  }
  await app.editor.toHaveScreenshot();

  // zoom out
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, -100);
    await page.waitForTimeout(10);
  }
  await app.editor.toHaveScreenshot();
  await page.keyboard.up("Space");

  // reset
  await app.editor.resetView.click();
  await app.editor.toHaveScreenshot();
});

test("controls the texture region", async ({ page }) => {
  // pan
  // zoom
  // reset
});
