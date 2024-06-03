import { For, Match, Switch, createMemo, createSignal } from "solid-js";
import "./App.css";

export function App() {
  const [file, setFile] = createSignal<File | null>(null);
  const url = createMemo(() => file() && URL.createObjectURL(file()!));

  const [imageRef, setImageRef] = createSignal<HTMLImageElement>();
  const [viewBox, setViewBox] = createSignal([0, 0, 0, 0]);

  function getImage() {
    const image = imageRef();
    if (!image) throw new Error("Image not loaded");
    return image;
  }

  function onImageLoad() {
    const image = getImage();
    const { width, height } = image.getBoundingClientRect();
    setViewBox([0, 0, width, height]);
  }

  const [points, setPoints] = createSignal<[number, number][]>([]);

  function onRectanglesClick(e: MouseEvent) {
    const image = getImage();
    const rect = image.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPoints((points) => [...points, [x, y]]);
  }

  return (
    <div class="app">
      <Switch>
        <Match when={!file()}>
          <DropImage setFile={setFile} />
        </Match>
        <Match when={file()}>
          <div class="editor">
            <img
              ref={setImageRef}
              class="image"
              src={url() ?? ""}
              alt="Uploaded image"
              onLoad={onImageLoad}
            />
            <svg
              class="rectangles"
              viewBox={viewBox().join(" ")}
              onClick={onRectanglesClick}
            >
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
          </div>
        </Match>
      </Switch>
    </div>
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
