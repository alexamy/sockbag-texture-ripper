import { createImageSource } from "@/lib/helper";
import { projectRectangles, toBlobs } from "@/lib/projection";
import potpack from "potpack";
import { createResource } from "solid-js";
import { EditorStore } from "./editor";
import { FileStore } from "./file";
import { TextureStore } from "./texture";

export type ComputedState = ReturnType<typeof createComputedState>;

const defaultData = {
  blobs: [],
  urls: [],
  images: [],
  packs: [],
  dimensions: { w: 0, h: 0, fill: 0 },
  transforms: [],
};

export function createComputedState(stores: {
  file: FileStore;
  editor: EditorStore;
  texture: TextureStore;
}) {
  const [file, fileApi] = stores.file;
  const [editor, editorApi] = stores.editor;
  const [texture, textureApi] = stores.texture;

  const [data] = createResource(
    () => [fileApi.image(), editorApi.quadPoints()] as const,
    async ([image, quads]) => {
      if (!image) return defaultData;
      const canvases = projectRectangles(image, quads);
      const blobs = await toBlobs(canvases);
      const urls = blobs.map((blob) => URL.createObjectURL(blob));
      const images = await Promise.all(urls.map(createImageSource));
      const { packs, dimensions } = autopack(images, texture.gap);

      return { blobs, urls, images, packs, dimensions };
    }
  );

  return { data } as const;
}

function autopack(images: HTMLImageElement[], gap = 0) {
  const packs = images.map((image, i) => ({
    i,
    image,
    w: image.naturalWidth + gap,
    h: image.naturalHeight + gap,
    x: 0,
    y: 0,
  }));

  const dimensions = potpack(packs);
  packs.sort((a, b) => a.i - b.i);

  return { packs, dimensions };
}
