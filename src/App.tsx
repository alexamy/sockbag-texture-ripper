import { Match, Switch, createSignal } from "solid-js";
import "./App.css";

export function App() {
  const [file, setFile] = createSignal<File>();
  const [isDragOver, setIsDragOver] = createSignal(false);

  function onDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file) {
      setFile(file);
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
    <div class="app">
      <Switch>
        <Match when={!file()}>
          <div
            class="image-drop"
            classList={{ "drag-over": isDragOver() }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
          >
            Drop image here
          </div>
        </Match>
        <Match when={file()}>
          <img
            class="image"
            src={URL.createObjectURL(file()!)}
            alt="Uploaded image"
          />
        </Match>
      </Switch>
    </div>
  );
}
