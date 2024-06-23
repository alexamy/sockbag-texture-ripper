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
  const app = new AppPage(page);
  await app.goto();
  await app.upload("./images/cat.png", import.meta.url);

  // draw quads
  await app.editor.content.click({ position: { x: 25, y: 60 } });
  await app.editor.content.click({ position: { x: 90, y: 81 } });
  await app.editor.content.click({ position: { x: 94, y: 168 } });
  await app.editor.content.click({ position: { x: 47, y: 150 } });
  await app.editor.content.click({ position: { x: 185, y: 100 } });
  await app.editor.content.click({ position: { x: 320, y: 67 } });
  await app.editor.content.click({ position: { x: 322, y: 214 } });
  await app.editor.content.click({ position: { x: 166, y: 148 } });

  // no transformation
  await app.texture.toHaveScreenshot();

  // pan
  await app.texture.content.click({ position: { x: 25, y: 25 } });
  await page.keyboard.down("Space");
  await page.mouse.move(950, 110);
  await app.texture.toHaveScreenshot();
  await page.keyboard.up("Space");

  // zoom in
  await page.keyboard.down("Space");
  await app.texture.region.focus();
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(10);
  }
  await app.texture.toHaveScreenshot();

  // zoom out
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, -100);
    await page.waitForTimeout(10);
  }
  await app.texture.toHaveScreenshot();
  await page.keyboard.up("Space");

  // reset
  await app.texture.buttons.resetView.click();
  await app.texture.toHaveScreenshot();
});
