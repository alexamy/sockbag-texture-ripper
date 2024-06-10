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

  const dnd = createDnd(setFile);
  const resize = createResize();

  return (
    <div
      class="app"
      onDrop={dnd.onDrop}
      onDragEnter={dnd.onDragEnter}
      onDragOver={dnd.onDragOver}
      onDragLeave={dnd.onDragLeave}
      onMouseMove={resize.onMouseMove}
    >
      <Show when={store.blob}>
        <Region toolbar={<EditorToolbar />} width={resize.left()}>
          <Editor />
        </Region>

        <div
          class="region-border"
          onMouseDown={resize.activate}
          onMouseUp={resize.deactivate}
          onDblClick={resize.reset}
        >
          <div class="region-border-handle" />
        </div>

        <Region toolbar={<TextureToolbar />} width={resize.right()}>
          <Texture />
        </Region>
      </Show>

      <Show when={dnd.isDragOver()}>
        <div class="image-drop">Drop image here to upload</div>
      </Show>
    </div>
  );
}

function createResize() {
  const [dragging, setDragging] = createSignal(false);
  const [width, setWidth] = createSignal(50);
  const left = () => width();
  const right = () => 100 - width();

  function onMouseMove(e: MouseEvent) {
    if (dragging()) {
      const width = (e.clientX / window.innerWidth) * 100;
      setWidth(width);
    }
  }

  function reset() {
    setWidth(50);
  }

  function activate() {
    setDragging(true);
  }

  function deactivate() {
    setDragging(false);
  }

  return { width, left, right, onMouseMove, reset, activate, deactivate };
}

async function debugLoadFile() {
  // textrip.jpg, river.jpg, houses.png
  const image = await fetch("http://alexamy.me/pub/river.jpg");
  const blob = await image.blob();
  const file = new File([blob], "source");
  return file;
}
