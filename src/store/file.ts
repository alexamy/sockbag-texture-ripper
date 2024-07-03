import { createImageSource } from "@/lib/helper";
import { createMemo, createResource } from "solid-js";
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

  const url = createMemo(() => URL.createObjectURL(store.blob));
  const [image] = createResource(url, createImageSource);

  const api = { setFile, url, image };

  return [store, api, setStore] as const;
}

function getDefaultStore() {
  return {
    blob: new Blob(),
  } satisfies StoreData;
}
