import { createEffect, on } from "solid-js";
import { createStore } from "solid-js/store";
import { createImageSource } from "../helper";

export type FileStore = ReturnType<typeof createFileStore>;

interface StoreData {
  file: Blob;
  url: string;
  image: HTMLImageElement;
}

// store
export function createFileStore() {
  const [store, setStore] = createStore<StoreData>(getDefaultStore());

  // prettier-ignore
  createEffect(on(() => store.file, async (file) => {
    const url = URL.createObjectURL(file);
    const image = await createImageSource(url);
    setStore({ url, image });
  }));

  function setFile(file: Blob) {
    setStore({ ...getDefaultStore(), file });
  }

  const methods = { setFile };

  return [store, methods, setStore] as const;
}

function getDefaultStore() {
  return {
    url: "",
    file: new Blob(),
    image: new Image(),
  } satisfies StoreData;
}
