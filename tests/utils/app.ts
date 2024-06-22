import { Locator, Page } from "@playwright/test";
import { resolve } from "./helper";

export class AppPage {
  page: Page;

  /** Main: without toolbars, and not affected by pan and zoom */
  editor: Locator;
  texture: Locator;

  /** Full: with toolbars */
  regions: {
    editor: Locator;
    texture: Locator;
  };

  /** Buttons */
  buttons: {
    upload: Locator;
    download: Locator;
    clear: Locator;
    help: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    this.regions = {
      editor: page.getByTestId("editor"),
      texture: page.getByTestId("texture"),
    };

    this.editor = page.getByTestId("editor-content");
    this.texture = page.getByTestId("texture-content");

    this.buttons = {
      upload: page.getByRole("button", { name: "Upload" }),
      download: page.getByRole("button", { name: "Download" }),
      clear: page.getByRole("button", { name: "Clear" }),
      help: page.getByRole("button", { name: "Help" }),
    };
  }

  async goto() {
    await this.page.goto("/");
  }

  async upload(name: string, meta: string) {
    const image = resolve(name, meta);
    const fileChooserPromise = this.page.waitForEvent("filechooser");

    await this.buttons.upload.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(image);
  }
}
