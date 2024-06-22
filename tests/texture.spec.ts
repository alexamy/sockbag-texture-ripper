import { test } from "@playwright/test";
import { AppPage } from "./utils/app";

test.skip("adds gap between rectangles", async ({ page }) => {
  const app = new AppPage(page);
  await app.goto();

  // upload image
  await app.upload("./images/cat.png", import.meta.url);
  // draw first quad
  await app.editor.content.click({ position: { x: 25, y: 60 } });
  await app.editor.content.click({ position: { x: 90, y: 81 } });
  await app.editor.content.click({ position: { x: 94, y: 168 } });
  await app.editor.content.click({ position: { x: 47, y: 150 } });
  // draw second quad
  await app.editor.content.click({ position: { x: 185, y: 100 } });
  await app.editor.content.click({ position: { x: 320, y: 67 } });
  await app.editor.content.click({ position: { x: 322, y: 214 } });
  await app.editor.content.click({ position: { x: 166, y: 148 } });

  // see the result without gap
  await app.texture.toHaveScreenshot();
  // increase the gap
  await app.inputs.gap.fill("10"); // BUG can't enter value into the input
  // see the result with gap
  await app.texture.toHaveScreenshot();
});
