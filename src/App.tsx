import { Show, createSignal } from "solid-js";
import "./App.css";
import { Editor, EditorToolbar } from "./Editor";
import { Region } from "./Region";
import { Texture, TextureToolbar } from "./Texture";
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

  const [dragging, setDragging] = createSignal(false);
  const [width, setWidth] = createSignal(50);

  function onMouseMove(e: MouseEvent) {
    if (dragging()) {
      const width = (e.clientX / window.innerWidth) * 100;
      setWidth(width);
    }
  }

  return (
    <div
      class="app"
      onDrop={onDrop}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onMouseMove={onMouseMove}
    >
      <Show when={store.blob}>
        <Region toolbar={<EditorToolbar />} width={width()}>
          <Editor />
        </Region>

        <div
          class="region-border"
          onMouseDown={() => setDragging(true)}
          onMouseUp={() => setDragging(false)}
          onDblClick={() => setWidth(50)}
        >
          <div class="region-border-handle" />
        </div>

        <Region toolbar={<TextureToolbar />} width={100 - width()}>
          <Texture />
        </Region>
      </Show>
      <Show when={isDragOver()}>
        <div class="image-drop">Drop image here</div>
      </Show>
    </div>
  );
}

async function debugLoadFile() {
  // textrip.jpg, river.jpg, houses.png
  const image = await fetch("http://alexamy.me/pub/river.jpg");
  const blob = await image.blob();
  const file = new File([blob], "source");
  return file;
}
