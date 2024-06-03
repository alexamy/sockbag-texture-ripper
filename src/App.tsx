import { For, Match, Switch, createMemo, createSignal } from "solid-js";
import "./App.css";

export function App() {
  const [file, setFile] = createSignal<File>();
  const url = createMemo(() => {
    return file() ? URL.createObjectURL(file()!) : "";
  });

  const [imageRect, setImageRect] = createSignal<DOMRect>(new DOMRect());

  return (
    <div class="app">
      <Switch>
        <Match when={!file()}>
          <DropImage setFile={setFile} />
        </Match>
        <Match when={file()}>
          <div class="editor">
            <Image url={url()} setImageRect={setImageRect} />
            <Editor imageRect={imageRect()} />
          </div>
        </Match>
      </Switch>
    </div>
  );
}

function Editor(props: { imageRect: DOMRect }) {
  const viewBox = createMemo(() => {
    const rect = props.imageRect;
    return rect ? [0, 0, rect.width, rect.height] : [0, 0, 0, 0];
  });

  const [points, setPoints] = createSignal<[number, number][]>([]);

  function onClick(e: MouseEvent) {
    const rect = props.imageRect;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints((points) => [...points, [x, y]]);
  }

  return (
    <svg class="svg-canvas" viewBox={viewBox().join(" ")} onClick={onClick}>
      <For each={points()}>
        {(point, i) => (
          <>
            <circle cx={point[0]} cy={point[1]} r="4" fill="white" />
            <line
              x1={point[0]}
              y1={point[1]}
              x2={points()[i() + 1]?.[0] ?? point[0]}
              y2={points()[i() + 1]?.[1] ?? point[1]}
              stroke="white"
              stroke-width="2"
            />
          </>
        )}
      </For>
    </svg>
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
