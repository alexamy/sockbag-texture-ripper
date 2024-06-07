import { Show, createEffect, createMemo, createSignal, on } from "solid-js";
import "./App.css";
import { Editor } from "./Editor";
import { Region } from "./Region";
import { Texture } from "./Texture";
import { editorMachine } from "./editorMachine";
import { createActor, createActorState } from "./hooks";
import { projectRectangles } from "./projection";

export function App() {
  const editor = createActor(editorMachine);
  const state = createActorState(editor);
  const quads = createMemo(() => state.context.quads);

  const [imageRef, setImageRef] = createSignal<HTMLImageElement>();
  const [file, setFile] = createSignal<File>();
  const url = createMemo(() => {
    return file() ? URL.createObjectURL(file()!) : "";
  });

  createEffect(on(file, () => editor.send({ type: "reset" })));

  const [projected, setProjected] = createSignal<Blob[]>([]);
  createEffect(
    on(
      () => quads().length,
      () => {
        if (file()) {
          projectRectangles(file()!, quads()).then(setProjected);
        }
      }
    )
  );

  // DEBUG
  debugLoadFile().then(setFile);

  return (
    <div class="app">
      <Header />
      <DropImage setFile={setFile} />
      <Show when={file()}>
        <div class="editor">
          <div>
            Image size: {imageRef()?.naturalWidth} x {imageRef()?.naturalHeight}
          </div>

          <Region trigger="move">
            <div class="editor-canvas">
              <ImageBackground url={url()} setImageRef={setImageRef} />
              <Show when={imageRef()}>
                <Editor imageRef={imageRef()!} initialEditor={editor} />
              </Show>
            </div>
          </Region>

          <Texture blobs={projected()} />
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
  url: string;
  setImageRef: (ref: HTMLImageElement) => void;
}) {
  function onLoad(e: Event) {
    const image = e.target as HTMLImageElement;
    props.setImageRef(image);
  }

  return <img src={props.url} alt="Uploaded image" onLoad={onLoad} />;
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
