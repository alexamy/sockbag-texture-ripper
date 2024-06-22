import { expect, test } from "@playwright/test";
import { AppPage } from "./utils/app";

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
  await app.editor.toHaveScreenshot();

  // draw first quad
  await app.editor.content.click({ position: { x: 25, y: 60 } });
  await app.editor.content.click({ position: { x: 90, y: 81 } });
  await app.editor.content.click({ position: { x: 94, y: 168 } });
  await app.editor.content.click({ position: { x: 47, y: 150 } });
  // see the result
  await app.texture.toHaveScreenshot();

  // draw second quad
  await app.editor.content.click({ position: { x: 185, y: 100 } });
  await app.editor.content.click({ position: { x: 320, y: 67 } });
  await app.editor.content.click({ position: { x: 322, y: 214 } });
  await app.editor.content.click({ position: { x: 166, y: 148 } });
  // see the result
  await app.texture.toHaveScreenshot();

  // download the texture
  const file = await app.download();
  expect(file).toMatchSnapshot();

  // persist after the reload
  await app.goto();
  await app.editor.toHaveScreenshot();

  // clear the editor
  await app.buttons.clear.click();
  await app.editor.toHaveScreenshot();

  // TODO clear the texture
  // await app.texture.toHaveScreenshot();
});

test("editor", async ({ page }) => {
  // discrads last drawn point
});

test("texture", async ({ page }) => {
  // increase the gap
});

test("controls the regions", async ({ page }) => {
  // pan the editor
  // zoom the editor
  // pan the texture
  // zoom the texture
});

test("shows the help", async ({ page }) => {});
