import { trackStore } from "@solid-primitives/deep";
import debounce from "debounce";
import localforage from "localforage";
import {
  JSXElement,
  createContext,
  createEffect,
  createResource,
  on,
  useContext,
} from "solid-js";
import { unwrap } from "solid-js/store";
import { ComputedState, createComputedState } from "./computed";
import { EditorStore, PointId, Quad, createEditorStore } from "./editor";
import { FileStore, createFileStore } from "./file";
import { TextureStore, createTextureStore } from "./texture";

interface Stores {
  file: FileStore;
  editor: EditorStore;
  texture: TextureStore;
  computed: ComputedState;
  storage: LocalForage;
}

interface PersistState {
  version: number;
  blob: Blob;
  points: PointId[];
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
  const storage = localforage.createInstance({
    name: "sockbag-texture-ripper",
  });

  const state = {
    file,
    editor,
    texture,
    computed,
    storage,
  } satisfies Stores;

  createPersistence(state);

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
function createPersistence(state: Stores) {
  const [loaded] = createResource(async () => {
    await loadFromLocalStorage(state);
    return true as const;
  });

  const storageDependencies = () =>
    [
      state.file[0].blob,
      state.editor[0].quads,
      trackStore(state.editor[0].points),
    ] as const;

  function save() {
    if (!loaded()) return;
    saveToLocalStorage(state);
  }

  createEffect(
    on(storageDependencies, debounce(save, 500, { immediate: true }))
  );
}

const key = "sockbag-texture-ripper-state";
const version = 3;

async function loadFromLocalStorage(state: Stores) {
  const data = await state.storage.getItem<PersistState>(key);
  if (!data) return;
  if (data.version !== version) return;

  try {
    console.log("loading from local storage", data);
    const { blob, points, quads } = data;
    state.file[2]({ blob });
    state.editor[2]({ points, quads });
  } catch (e) {
    console.error(e);
    return;
  }
}

async function saveToLocalStorage(state: Stores) {
  const { blob } = state.file[0];
  const { points, quads } = state.editor[0];

  const data = {
    version,
    blob,
    points: unwrap(points),
    quads: unwrap(quads),
  } satisfies PersistState;

  console.log("saving to local storage", data);
  state.storage.setItem<PersistState>(key, data);
}
