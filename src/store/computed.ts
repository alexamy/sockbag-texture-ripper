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
  const rects = createResource(
    () => [stores.file[1].image(), stores.editor[1].quadPoints()] as const,
    async ([image, quads]) => {
      if (!image) return;
      const canvases = projectRectangles(image, quads);
      const blobs = await toBlobs(canvases);
      return blobs;
    }
  );

  return { rects } as const;
}
