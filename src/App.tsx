import { Show } from "solid-js";
import "./App.css";
import { Editor, EditorToolbar } from "./Editor";
import { Region } from "./Region";
import { Texture, TextureToolbar } from "./Texture";
import { createDnd, createResize } from "./hooks";
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
        <Region
          toolbar={<EditorToolbar />}
          width={resize.left()}
          resetTrigger={store.blob}
        >
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

        <Region
          toolbar={<TextureToolbar />}
          width={resize.right()}
          resetTrigger={store.blob}
        >
          <Texture />
        </Region>
      </Show>

      <Show when={dnd.isDragOver()}>
        <div class="image-drop">Drop image here to upload</div>
      </Show>
    </div>
  );
}

async function debugLoadFile() {
  // textrip, river, houses, rainbow
  const image = await fetch("http://alexamy.me/pub/river.png");
  const blob = await image.blob();
  const file = new File([blob], "source");
  return file;
}
