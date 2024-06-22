import { Locator, Page } from "@playwright/test";
import { getFile } from "./helper";

export class AppPage {
  page: Page;

  /** Full: with toolbars */
  regions: {
    editor: Locator;
    texture: Locator;
  };

  /** Main: without toolbars, but affected by pan and zoom */
  areas: {
    editor: Locator;
    texture: Locator;
  };

  /** Native: without toolbars, and not affected by pan and zoom */
  elements: {
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
      editor: page.getByTestId("editor-region"),
      texture: page.getByTestId("texture-region"),
    };

    this.areas = {
      editor: page.getByTestId("editor-region-content"),
      texture: page.getByTestId("texture-region-content"),
    };

    this.elements = {
      editor: page.getByTestId("editor"),
      texture: page.getByTestId("texture"),
    };

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

  async upload(name: string) {
    const image = getFile(name);
    const fileChooserPromise = this.page.waitForEvent("filechooser");

    await this.buttons.upload.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(image);
  }
}
