import { projectRectangles, toBlobs } from "@/lib/projection";
import { createResource } from "solid-js";
import { EditorStore } from "./editor";
import { FileStore } from "./file";

export type ComputedStore = ReturnType<typeof createComputedStore>;

// store
export function createComputedStore(stores: {
  file: FileStore;
  editor: EditorStore;
}) {
  const [file, fileApi] = stores.file;
  const [editor, editorApi] = stores.editor;

  const rects = createResource(
    () => [fileApi.image(), editorApi.quadPoints()] as const,
    async ([image, quads]) => {
      if (image) {
        const canvases = projectRectangles(image, quads);
        const blobs = await toBlobs(canvases);
        return blobs;
      }
    }
  );

  return { rects } as const;
}
