import { test } from "@playwright/test";
import { AppPage } from "./utils/app";

test("discards last draw point by right click", async ({ page }) => {
  const app = new AppPage(page);
  await app.goto();

  // upload image
  await app.upload("./images/cat.png", import.meta.url);

  // draw 3 points
  await app.editor.content.click({ position: { x: 25, y: 60 } });
  await app.editor.content.click({ position: { x: 90, y: 81 } });
  await app.editor.content.click({ position: { x: 94, y: 168 } });
  await page.mouse.move(45, 150);
  await app.editor.toHaveScreenshot();

  // discard last point, only 2 point left
  await app.editor.content.click({
    position: { x: 45, y: 150 },
    button: "right",
  });
  await app.editor.toHaveScreenshot();

  // discard last point, only 1 point left
  await app.editor.content.click({
    position: { x: 45, y: 150 },
    button: "right",
  });
  await app.editor.toHaveScreenshot();

  // discard last point, no point left
  await app.editor.content.click({
    position: { x: 45, y: 150 },
    button: "right",
  });
  await app.editor.toHaveScreenshot();
});
