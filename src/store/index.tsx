import { JSXElement, createContext, useContext } from "solid-js";
import { FileStore, createFileStore } from "./file";
import { TextureStore, createTextureStore } from "./texture";

interface Stores {
  file: FileStore;
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
  const file = createFileStore();
  const texture = createTextureStore(file[0]);

  return (
    <StoreContext.Provider value={{ file, texture }}>
      {props.children}
    </StoreContext.Provider>
  );
}
