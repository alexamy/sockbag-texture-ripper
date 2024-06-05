import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createMemo,
  createSignal,
  on,
} from "solid-js";
import "./App.css";
import { Editor } from "./Editor";
import { editorMachine } from "./editorMachine";
import { createActor, createActorState } from "./hooks";
import { projectRectangles } from "./projection";

export function App() {
  const editor = createActor(editorMachine);
  const state = createActorState(editor);
  const quads = createMemo(() => state.context.quads);

  const [imageRef, setImageRef] = createSignal<HTMLImageElement>();
  const imageRect = createMemo(() =>
    imageRef() ? imageRef()!.getBoundingClientRect() : new DOMRect()
  );
  const imageScale = createMemo(() =>
    imageRef() ? imageRef()!.naturalWidth / imageRef()!.width : 1
  );

  const [file, setFile] = createSignal<File>();
  const url = createMemo(() => {
    return file() ? URL.createObjectURL(file()!) : "";
  });

  const [projected, setProjected] = createSignal<Blob[]>([]);
  createEffect(
    on(
      () => quads().length,
      () => {
        if (file()) {
          projectRectangles(file()!, quads(), imageScale()).then(setProjected);
        }
      }
    )
  );

  // debug
  (async function debugLoadFile() {
    const image = await fetch("http://alexamy.me/pub/houses.png");
    const blob = await image.blob();
    const file = new File([blob], "river.jpg", { type: "image/jpeg" });
    setFile(file);
  })();

  return (
    <div class="app">
      <Switch>
        <Match when={!file()}>
          <DropImage setFile={setFile} />
        </Match>
        <Match when={file()}>
          <div class="editor">
            <div>
              Image size: {imageRef()?.naturalWidth} x{" "}
              {imageRef()?.naturalHeight}
            </div>

            <div class="editor-canvas">
              <ImageBackground url={url()} setImageRef={setImageRef} />
              <Editor imageRect={imageRect()} initialEditor={editor} />
            </div>

            <Show when={projected().length}>
              <Texture blobs={projected()} />
            </Show>
          </div>
        </Match>
      </Switch>
    </div>
  );
}

function Texture(props: { blobs: Blob[] }) {
  const urls = createMemo(() => {
    return props.blobs.map((blob) => URL.createObjectURL(blob));
  });

  function onDownload() {}

  return (
    <div>
      <button onClick={onDownload}>Download</button>
      <div class="texture">
        <For each={urls()}>{(url) => <img src={url} />}</For>
      </div>
    </div>
  );
}

function ImageBackground(props: {
  url: string;
  setImageRef: (ref: HTMLImageElement) => void;
}) {
  function onLoad(e: Event) {
    const image = e.target as HTMLImageElement;
    props.setImageRef(image);
  }

  return (
    <img class="image" src={props.url} alt="Uploaded image" onLoad={onLoad} />
  );
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
