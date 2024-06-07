import { Show, createSignal } from "solid-js";
import "./App.css";
import { Editor } from "./Editor";
import { Region } from "./Region";
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
  // TODO move to inner components
  const [store, { setFile }] = useAppStore();
  debugLoadFile().then(setFile); // DEBUG

  // TODO remove?
  const [imageRef, setImageRef] = createSignal<HTMLImageElement>();

  return (
    <div class="app">
      <Header />
      <DropImage setFile={setFile} />
      <Show when={store.file}>
        <div class="editor">
          <div>
            Image size: {imageRef()?.naturalWidth} x {imageRef()?.naturalHeight}
          </div>

          <Region trigger="move">
            <div class="editor-canvas">
              <ImageBackground src={store.url} onLoadRef={setImageRef} />
              <Show when={imageRef()}>
                <Editor imageRef={imageRef()!} />
              </Show>
            </div>
          </Region>

          <Texture />
        </div>
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

function ImageBackground(props: {
  src: string;
  onLoadRef: (ref: HTMLImageElement) => void;
}) {
  function onLoad(e: Event) {
    const image = e.target as HTMLImageElement;
    props.onLoadRef(image);
  }

  return <img src={props.src} alt="Uploaded image" onLoad={onLoad} />;
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

function Header() {
  const titles = [
    { icon: "🧦👜", text: "Sockbag" },
    { icon: "👜👜", text: "Bagbag" },
    { icon: "🧦🧦", text: "Socksock" },
    { icon: "👜🧦", text: "Bagsock" },
  ];

  const [title, setTitle] = createSignal(titles[0]);

  function onMouseEnter() {
    const idx = Math.floor(Math.random() * titles.length);
    const title = titles[idx];
    setTitle(title);
  }

  function onMouseLeave() {
    setTitle(titles[0]);
  }

  return (
    <h1
      class="app-title"
      title={`${title().text} Texture Ripper`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {title().icon}
    </h1>
  );
}
