import { blobToDataURI, dataURItoBlob, tick } from "@/lib/helper";
import {
  JSXElement,
  createContext,
  createEffect,
  on,
  onMount,
  useContext,
} from "solid-js";
import { ComputedState, createComputedState } from "./computed";
import { EditorStore, Point, Quad, createEditorStore } from "./editor";
import { FileStore, createFileStore } from "./file";
import { TextureStore, createTextureStore } from "./texture";

interface Stores {
  file: FileStore;
  editor: EditorStore;
  texture: TextureStore;
  computed: ComputedState;
}

interface PersistState {
  version: number;
  file: string;
  points: Point[];
  quads: Quad[];
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
  const editor = createEditorStore();
  const texture = createTextureStore();
  const computed = createComputedState({ file, editor, texture });

  const state = { file, editor, texture, computed } satisfies Stores;

  onMount(() => loadFromLocalStorage(state));
  createEffect(() => saveToLocalStorage(state));

  createEffect(
    on(
      () => file[0].blob,
      () => {
        editor[1].reset();
        texture[1].reset();
      }
    )
  );

  return (
    <StoreContext.Provider value={state}>
      {props.children}
    </StoreContext.Provider>
  );
}

// persist
const key = "sockbag-texture-ripper-state";
const version = 1;

async function loadFromLocalStorage(state: Stores) {
  const raw = localStorage.getItem(key);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    if (data.version !== version) return;

    const { file, points, quads } = data;
    const blob = dataURItoBlob(file);

    state.file[2]({ blob });
    await tick();
    state.editor[2]({ points, quads });
  } catch (e) {
    console.log(e);
    return;
  }
}

async function saveToLocalStorage(state: Stores) {
  const { blob } = state.file[0];
  const { points, quads } = state.editor[0];
  const file = await blobToDataURI(blob);

  const data = { version, file, points, quads } satisfies PersistState;
  const raw = JSON.stringify(data);
  localStorage.setItem(key, raw);
}
