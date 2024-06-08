import { JSXElement, createContext, useContext } from "solid-js";
import { EditorStore, createEditorStore } from "./editor";
import { FileStore, createFileStore } from "./file";
import { TextureStore, createTextureStore } from "./texture";

interface Stores {
  file: FileStore;
  editor: EditorStore;
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
  const editor = createEditorStore(file[0]);
  const texture = createTextureStore(file[0], editor[0]);

  return (
    <StoreContext.Provider value={{ file, editor, texture }}>
      {props.children}
    </StoreContext.Provider>
  );
}
