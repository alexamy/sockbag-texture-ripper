import { createImageSource } from "@/lib/helper";
import { projectRectangles, toBlobs } from "@/lib/projection";
import potpack from "potpack";
import { createMemo, createResource } from "solid-js";
import { EditorStore } from "./editor";
import { FileStore } from "./file";
import { TextureStore } from "./texture";

export type ComputedStore = ReturnType<typeof createComputedStore>;

export async function createComputedStore(stores: {
  file: FileStore;
  editor: EditorStore;
  texture: TextureStore;
}) {
  const [file, fileApi] = stores.file;
  const [editor, editorApi] = stores.editor;
  const [texture, textureApi] = stores.texture;

  const [rects] = createResource(
    () => [fileApi.image(), editorApi.quadPoints()] as const,
    async ([image, quads]) => {
      if (image) {
        const canvases = projectRectangles(image, quads);
        const blobs = await toBlobs(canvases);
        return blobs;
      }
    }
  );

  const urls = createMemo(() =>
    rects()?.map((blob) => URL.createObjectURL(blob))
  );

  const [images] = createResource(
    urls,
    async (urls) => await Promise.all(urls.map(createImageSource))
  );

  const packInfo = createMemo(() => {
    if (images()) {
      return autopack(images()!, texture.gap);
    }
  });

  const transforms = createMemo(() =>
    packInfo()?.packs.map(({ x, y }) => `translate(${x}px, ${y}px)`)
  );

  return { rects, urls, images, packInfo, transforms } as const;
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
