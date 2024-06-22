import { Locator, Page } from "@playwright/test";

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
  }

  async goto() {
    await this.page.goto("/");
  }
}
