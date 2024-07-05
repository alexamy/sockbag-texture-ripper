import { createStore } from "solid-js/store";

export type TextureStore = ReturnType<typeof createTextureStore>;

interface StoreData {
  gap: number;
}

export function createTextureStore() {
  const [store, setStore] = createStore<StoreData>(getDefaultStore());

  function setGap(gap: number) {
    setStore({ gap });
  }

  function reset() {
    setStore({ ...getDefaultStore(), gap: store.gap });
  }

  const api = { setGap, reset };

  return [store, api, setStore] as const;
}

function getDefaultStore() {
  return {
    gap: 0,
  } satisfies StoreData;
}
