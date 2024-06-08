import { JSXElement, createContext, useContext } from "solid-js";
import { MainStore, createMainStore } from "./main";
import { TextureStore, createTextureStore } from "./texture";

interface Stores {
  main: MainStore;
  texture: TextureStore;
}

const StoreContext = createContext<Stores>(undefined as unknown as Stores);

export function useAppStore() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return store;
}

export function AppStoreProvider(props: { children: JSXElement }) {
  const main = createMainStore();
  const texture = createTextureStore(main[0]);

  return (
    <StoreContext.Provider value={{ main, texture }}>
      {props.children}
    </StoreContext.Provider>
  );
}
