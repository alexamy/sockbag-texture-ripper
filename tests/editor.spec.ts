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

test.skip("drags quad", async ({ page }) => {
  const app = new AppPage(page);
  await app.goto();

  // upload image
  await app.upload("./images/cat.png", import.meta.url);
  await app.editor.toHaveScreenshot();

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
  await app.editor.toHaveScreenshot();

  // drag the first quad
  await page.mouse.move(55, 70);
  await page.mouse.down();
  await page.mouse.move(65, 80);
  await page.mouse.move(75, 90);
  await page.mouse.move(85, 100);
  await page.mouse.move(95, 110);
  await page.mouse.move(105, 120);
  await page.mouse.move(115, 130);
  await page.mouse.up();

  // TODO implement drag
  await app.editor.toHaveScreenshot();

  // TODO drag the older quad over the newer quad
});
