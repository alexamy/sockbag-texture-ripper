import { Show, createSignal } from "solid-js";
import "./App.css";
import { Editor } from "./Editor";
import { Texture } from "./Texture";
import { AppStoreProvider, useAppStore } from "./store";

export function App() {
  return (
    <AppStoreProvider>
      <TextureRipper />
    </AppStoreProvider>
  );
}

export function TextureRipper() {
  const [store, { setFile }] = useAppStore().file;
  debugLoadFile().then(setFile);

  return (
    <div class="app">
      <DropImage setFile={setFile} />
      <Show when={store.blob}>
        <Editor />
        <ResizeBorder />
        <Texture />
      </Show>
    </div>
  );
}

function ResizeBorder() {
  return <hr class="regions-border" />;
}

async function debugLoadFile() {
  // textrip.jpg, river.jpg, houses.png
  const image = await fetch("http://alexamy.me/pub/river.jpg");
  const blob = await image.blob();
  const file = new File([blob], "source");
  return file;
}

function DropImage(props: { setFile: (file: File) => void }) {
  const [isDragOver, setIsDragOver] = createSignal(false);

  function onDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith("image/")) {
      props.setFile(file);
    }
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function onDragLeave() {
    setIsDragOver(false);
  }

  return (
    <div
      class="image-drop"
      classList={{ "drag-over": isDragOver() }}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      Drop image here
    </div>
  );
}
