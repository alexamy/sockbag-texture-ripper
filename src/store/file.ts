import { createImageSource } from "@/lib/helper";
import { createStore } from "solid-js/store";

export type FileStore = ReturnType<typeof createFileStore>;

interface StoreData {
  blob: Blob;
  url: string;
  image: HTMLImageElement;
}

// store
export function createFileStore() {
  const [store, setStore] = createStore<StoreData>(getDefaultStore());

  async function setFile(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const image = await createImageSource(url);
    setStore({ blob, url, image });
  }

  const methods = { setFile };

  return [store, methods, setStore] as const;
}

function getDefaultStore() {
  return {
    url: "",
    blob: new Blob(),
    image: new Image(),
  } satisfies StoreData;
}
