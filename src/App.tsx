import cv from "@techstark/opencv-js";
import {
  For,
  Match,
  Switch,
  createEffect,
  createMemo,
  createSignal,
  on,
} from "solid-js";
import "./App.css";
import { Editor } from "./Editor";
import { Quad, editorMachine } from "./editorMachine";
import { createActor, createActorState } from "./hooks";

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

  const projectedUrls = createMemo(() => {
    return projected().map((blob) => URL.createObjectURL(blob));
  });

  // debug
  (async function debugLoadFile() {
    const image = await fetch("http://alexamy.me/pub/river.jpg");
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
            <ImageBackground url={url()} setImageRef={setImageRef} />
            <Editor imageRect={imageRect()} initialEditor={editor} />
            <div>
              Image size: {imageRef()?.naturalWidth} x{" "}
              {imageRef()?.naturalHeight}
            </div>

            <div class="texture">
              <For each={projectedUrls()}>{(url) => <img src={url} />}</For>
            </div>
          </div>
        </Match>
      </Switch>
    </div>
  );
}

async function projectRectangles(file: File, quads: Quad[], scale: number) {
  const image = new Image();
  image.src = URL.createObjectURL(file);
  await new Promise((resolve) => (image.onload = resolve));

  const src = cv.imread(image);
  const blobs: Blob[] = [];

  for (const quad of quads) {
    const [p1, p2, p3, p4] = quad;
    const points = [p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y];
    const scaled = points.map((p) => p * scale);
    const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, scaled);

    const W = 300;
    const H = 300;
    const dst = new cv.Mat();
    const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, W, 0, W, H, 0, H]);

    const transform = cv.getPerspectiveTransform(srcTri, dstTri);
    const dsize = new cv.Size(W, H);
    cv.warpPerspective(
      src,
      dst,
      transform,
      dsize,
      cv.INTER_LINEAR,
      cv.BORDER_CONSTANT
    );

    const canvas = document.createElement("canvas");
    cv.imshow(canvas, dst);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve)
    );
    if (!blob) throw new Error("Failed to extract image rectangle.");

    blobs.push(blob);
  }

  return blobs;
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
