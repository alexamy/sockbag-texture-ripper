import { Show } from "solid-js";
import "./App.css";
import { Editor } from "./Editor";
import { Texture } from "./Texture";
import { createDnd } from "./createDnd";
import { AppStoreProvider, useAppStore } from "./store";

export default App;

function App() {
  return (
    <AppStoreProvider>
      <TextureRipper />
    </AppStoreProvider>
  );
}

function TextureRipper() {
  const [store, { setFile }] = useAppStore().file;
  debugLoadFile().then(setFile);
  const { isDragOver, onDrop, onDragEnter, onDragOver, onDragLeave } =
    createDnd(setFile);

  return (
    <div
      class="app"
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <Show when={store.blob}>
        <Editor />
        <ResizeBorder />
        <Texture />
      </Show>
      <Show when={isDragOver()}>
        <div class="image-drop">Drop image here</div>
      </Show>
    </div>
  );
}

function ResizeBorder() {
  return <div class="regions-border" />;
}

async function debugLoadFile() {
  // textrip.jpg, river.jpg, houses.png
  const image = await fetch("http://alexamy.me/pub/river.jpg");
  const blob = await image.blob();
  const file = new File([blob], "source");
  return file;
}
