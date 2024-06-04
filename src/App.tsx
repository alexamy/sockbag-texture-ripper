import * as cv from "@techstark/opencv-js";
import { useActorRef } from "@xstate/solid";
import {
  Match,
  Switch,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";
import "./App.css";
import { Editor } from "./EditorComponent";
import { editorMachine } from "./editor";

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

  // debug cv
  createEffect(() => {
    if (!imageRef()) return;

    // create a new image
    const src = cv.imread(imageRef()!);
    const dst = src;
    const dstData = new ImageData(
      new Uint8ClampedArray(dst.data),
      dst.cols,
      dst.rows
    );

    // get data blob
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = dstData.width;
    canvas.height = dstData.height;
    ctx.putImageData(dstData, 0, 0);
    const url = canvas.toDataURL("image/jpeg");
    console.log(url);
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
            <Image url={url()} setImageRef={setImageRef} />
            <Editor imageRect={imageRect()} initialEditor={editor} />
          </div>
        </Match>
      </Switch>
    </div>
  );
}

function Image(props: {
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
