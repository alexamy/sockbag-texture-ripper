import { createImageSource } from "@/lib/helper";
import { createResource } from "solid-js";
import { createStore } from "solid-js/store";

export type FileStore = ReturnType<typeof createFileStore>;

interface StoreData {
  blob: Blob;
}

// store
export function createFileStore() {
  const [store, setStore] = createStore<StoreData>(getDefaultStore());

  async function setFile(blob: Blob) {
    setStore({ blob });
  }

  const [image] = createResource(
    () => store.blob,
    async (blob) => {
      if (blob.size === 0) return;
      const url = URL.createObjectURL(store.blob);
      const image = await createImageSource(url);
      return image;
    }
  );

  const api = { setFile, image };

  return [store, api, setStore] as const;
}

function getDefaultStore() {
  return {
    blob: new Blob(),
  } satisfies StoreData;
}
