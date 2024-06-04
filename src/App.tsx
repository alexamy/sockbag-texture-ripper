import { fromActorRef, useActorRef } from "@xstate/solid";
import {
  For,
  Match,
  Show,
  Switch,
  createMemo,
  createResource,
  createSignal,
} from "solid-js";
import { ActorRefFrom } from "xstate";
import "./App.css";
import { editorMachine } from "./editor";

type Point = [number, number];
type Rect = [Point, Point, Point, Point];

export function App() {
  const editor = useActorRef(editorMachine);

  const [imageRect, setImageRect] = createSignal<DOMRect>(new DOMRect());

  const [_file, setFile] = createSignal<File>();

  // debug
  const [file] = createResource(async () => {
    const image = await fetch("http://alexamy.me/pub/river.jpg");
    const blob = await image.blob();
    return new File([blob], "river.jpg", { type: "image/jpeg" });
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
            <Image url={url()} setImageRect={setImageRect} />
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
    send({ type: "move", point: [x, y] });
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
  return <circle cx={props.p[0]} cy={props.p[1]} r="4" fill="white" />;
}

function Line(props: { p1: Point; p2: Point }) {
  return (
    <line
      x1={props.p1[0]}
      y1={props.p1[1]}
      x2={props.p2[0]}
      y2={props.p2[1]}
      stroke="white"
      stroke-width="2"
    />
  );
}

function Rect(props: { rect: Rect }) {
  return (
    <>
      <polygon
        points={props.rect.map((point) => point.join(",")).join(" ")}
        fill="white"
        fill-opacity={0.3}
        stroke="white"
        stroke-width="2"
      />
      <For each={props.rect}>{(point) => <Point p={point} />}</For>
    </>
  );
}

function Image(props: { url: string; setImageRect: (rect: DOMRect) => void }) {
  function onLoad(e: Event) {
    const image = e.target as HTMLImageElement;
    props.setImageRect(image.getBoundingClientRect());
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
