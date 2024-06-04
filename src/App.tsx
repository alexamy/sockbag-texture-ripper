import * as cv from "@techstark/opencv-js";
import { useActorRef } from "@xstate/solid";
import { Match, Switch, createMemo, createSignal } from "solid-js";
import "./App.css";
import { Editor } from "./Editor";
import { Rect, editorMachine } from "./editorMachine";

export function App() {
  const editor = useActorRef(editorMachine);

  const [imageRef, setImageRef] = createSignal<HTMLImageElement>();
  const imageRect = createMemo(() =>
    imageRef() ? imageRef()!.getBoundingClientRect() : new DOMRect()
  );

  const [file, setFile] = createSignal<File>();

  // debug
  (async function debugLoadFile() {
    const image = await fetch("http://alexamy.me/pub/river.jpg");
    const blob = await image.blob();
    const file = new File([blob], "river.jpg", { type: "image/jpeg" });
    setFile(file);
  })();

  const projected = createMemo(() => {
    if (imageRef()) {
      return projectRectangles(imageRef()!, []);
    }
  });

  const url = createMemo(() => {
    return file() ? URL.createObjectURL(file()!) : "";
  });

  return (
    <div class="app">
      <Switch>
        <Match when={!file()}>
          <DropImage setFile={setFile} />
        </Match>
        <Match when={file()}>
          <div class="editor">
            <ImageBackground url={url()} setImageRef={setImageRef} />
            <Editor imageRect={imageRect()} initialEditor={editor} />
            <div>
              Image size: {imageRef()?.naturalWidth} x{" "}
              {imageRef()?.naturalHeight}
            </div>

            <div class="texture">
              <img src={projected()} alt="Projected image" />
            </div>
          </div>
        </Match>
      </Switch>
    </div>
  );
}

function projectRectangles(image: HTMLImageElement, rectangles: Rect[]) {
  const src = cv.imread(image);
  const dst = src;

  const canvas = document.createElement("canvas");
  cv.imshow(canvas, dst);

  const url = canvas.toDataURL("image/png");
  return url;
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
