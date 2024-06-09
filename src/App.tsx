import { Show } from "solid-js";
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
