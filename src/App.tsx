import * as cv from "@techstark/opencv-js";
import { fromActorRef, useActorRef } from "@xstate/solid";
import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createMemo,
  createSignal,
} from "solid-js";
import { ActorRefFrom } from "xstate";
import "./App.css";
import { editorMachine, type Point, type Rect } from "./editor";

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
    const src = cv.imread(imageRef()!);
    const dst = src;
    const dstData = new ImageData(
      new Uint8ClampedArray(dst.data),
      dst.cols,
      dst.rows
    );
    console.log(dstData);
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

function Editor(props: {
  imageRect: DOMRect;
  initialEditor: ActorRefFrom<typeof editorMachine>;
}) {
  const state = fromActorRef(props.initialEditor);
  const send = props.initialEditor.send;

  const current = createMemo(() => state().context.current);
  const rectangles = createMemo(() => state().context.rectangles);
  const points = createMemo(() => state().context.points);

  const first = createMemo(() => points()[0]);
  const last = createMemo(() => points()[points().length - 1]);

  const viewBox = createMemo(() => {
    const rect = props.imageRect;
    return [0, 0, rect.width, rect.height].join(" ");
  });

  function onMouseMove(e: MouseEvent) {
    const rect = props.imageRect;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    send({ type: "move", point: { x, y } });
  }

  function onClick() {
    send({ type: "click" });
  }

  return (
    <svg
      class="svg-canvas"
      viewBox={viewBox()}
      onClick={onClick}
      onMouseMove={onMouseMove}
    >
      <For each={rectangles()}>{(rect) => <Rect rect={rect} />}</For>
      <Point p={current()} />
      <For each={points()}>
        {(point, i) => (
          <>
            <Point p={point} />
            <Line p1={point} p2={points()[i() + 1] ?? point} />
          </>
        )}
      </For>
      <Show when={points().length >= 1}>
        <Line p1={last()} p2={current()} />
      </Show>
      <Show when={points().length >= 2}>
        <Line p1={first()} p2={current()} />
      </Show>
    </svg>
  );
}

function Point(props: { p: Point }) {
  return <circle cx={props.p.x} cy={props.p.y} r="4" fill="white" />;
}

function Line(props: { p1: Point; p2: Point }) {
  return (
    <line
      x1={props.p1.x}
      y1={props.p1.y}
      x2={props.p2.x}
      y2={props.p2.y}
      stroke="white"
      stroke-width="2"
    />
  );
}

function Rect(props: { rect: Rect }) {
  return (
    <>
      <polygon
        points={props.rect.map((point) => `${point.x},${point.y}`).join(" ")}
        fill="white"
        fill-opacity={0.3}
        stroke="white"
        stroke-width="2"
      />
      <For each={props.rect}>{(point) => <Point p={point} />}</For>
    </>
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
