import { Locator, Page, expect } from "@playwright/test";
import internal from "node:stream";
import { resolve } from "./helper";

export class AppPage {
  page: Page;

  editor: Editor;
  texture: Texture;

  inputs: {
    gap: Locator;
  };

  buttons: {
    upload: Locator;
    download: Locator;
    clear: Locator;
    help: Locator;
  };

  constructor(page: Page) {
    this.page = page;

    this.editor = new Editor(page);
    this.texture = new Texture(page);

    this.buttons = {
      upload: page.getByRole("button", { name: "Upload" }),
      download: page.getByRole("button", { name: "Download" }),
      clear: page.getByRole("button", { name: "Clear" }),
      help: page.getByRole("button", { name: "Help" }),
    };

    this.inputs = {
      gap: page.getByLabel("Gap"),
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

  async download() {
    const downloadPromise = this.page.waitForEvent("download");
    await this.buttons.download.click();

    const download = await downloadPromise;
    const stream = await download.createReadStream();
    const file = await readDownload(stream);

    return file;
  }
}

class Editor {
  page: Page;

  /** Full: with toolbar */
  region: Locator;
  /** Main: without toolbar, affected by pan and zoom */
  content: Locator;

  toolbar: Locator;
  footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.region = page.getByTestId("editor-region");
    this.content = page.getByTestId("editor-content");
    this.toolbar = page.getByTestId("editor-toolbar");
    this.footer = page.getByTestId("editor-footer");
  }

  async toHaveScreenshot() {
    await expect(this.content).toHaveScreenshot({
      mask: [this.footer],
    });
  }
}

class Texture {
  page: Page;

  /** Full: with toolbar */
  region: Locator;
  /** Main: without toolbar, affected by pan and zoom */
  content: Locator;

  toolbar: Locator;
  footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.region = page.getByTestId("texture-region");
    this.content = page.getByTestId("texture-content");
    this.toolbar = page.getByTestId("texture-toolbar");
    this.footer = page.getByTestId("texture-footer");
  }

  async toHaveScreenshot() {
    await expect(this.content).toHaveScreenshot({
      mask: [this.footer],
    });
  }
}

function readDownload(stream: internal.Readable): Promise<string> {
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on("error", (err) => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("binary")));
  });
}
