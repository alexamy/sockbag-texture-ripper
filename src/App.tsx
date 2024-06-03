import { createSignal } from 'solid-js';
import './App.css';

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
      <div
        class="image"
        classList={{ 'drag-over': isDragOver() }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        Drop image here
      </div>
    </div>
  )
}
