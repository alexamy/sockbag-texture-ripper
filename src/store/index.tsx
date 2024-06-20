import {
  JSXElement,
  createContext,
  createEffect,
  onMount,
  useContext,
} from "solid-js";
import { EditorStore, Point, QuadLink, createEditorStore } from "./editor";
import { FileStore, createFileStore } from "./file";
import { TextureStore, createTextureStore } from "./texture";

interface Stores {
  file: FileStore;
  editor: EditorStore;
  texture: TextureStore;
}

interface PersistState {
  version: number;
  file: string;
  points: Point[];
  quadLinks: QuadLink[];
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
  const state = { file, editor, texture } satisfies Stores;

  onMount(() => loadFromLocalStorage(state));
  createEffect(() => saveToLocalStorage(state));

  return (
    <StoreContext.Provider value={state}>
      {props.children}
    </StoreContext.Provider>
  );
}

// persist
const key = "sockbag-texture-ripper-state";
const version = 0;

function loadFromLocalStorage(state: Stores) {
  const raw = localStorage.getItem(key);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    if (data.version !== version) return;

    const { file, points, quadLinks } = data;
    const blob = dataURItoBlob(file);

    state.file[2]({ blob });
    state.editor[2]({ points, quadLinks });
  } catch (e) {
    console.log(e);
    return;
  }
}

async function saveToLocalStorage(state: Stores) {
  const { blob } = state.file[0];
  const { points, quadLinks } = state.editor[0];
  const file = await blobToDataURI(blob);

  const data = { version, file, points, quadLinks } satisfies PersistState;
  const raw = JSON.stringify(data);
  localStorage.setItem(key, raw);
}

function blobToDataURI(blob: Blob) {
  const reader = new FileReader();
  reader.readAsDataURL(blob);

  return new Promise<string>((resolve) => {
    reader.onload = () => {
      resolve(reader.result as string);
    };
  });
}

function dataURItoBlob(dataURI: string) {
  // convert base64 to raw binary data held in a string
  const byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const _ia = new Uint8Array(arrayBuffer);
  for (let i = 0; i < byteString.length; i++) {
    _ia[i] = byteString.charCodeAt(i);
  }

  const dataView = new DataView(arrayBuffer);
  const blob = new Blob([dataView], { type: mimeString });

  return blob;
}
