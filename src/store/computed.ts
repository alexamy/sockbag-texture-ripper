import { createImageSource } from "@/lib/helper";
import { projectRectangles, toBlobs } from "@/lib/projection";
import { createMemo, createResource } from "solid-js";
import { EditorStore } from "./editor";
import { FileStore } from "./file";

export type ComputedStore = ReturnType<typeof createComputedStore>;

// store
export async function createComputedStore(stores: {
  file: FileStore;
  editor: EditorStore;
}) {
  const [file, fileApi] = stores.file;
  const [editor, editorApi] = stores.editor;

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

  return { rects, urls, images } as const;
}
