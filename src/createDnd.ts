import { createSignal } from "solid-js";

export function createDnd(setFile: (blob: Blob) => void) {
  const [isDragOver, setIsDraggedOver] = createSignal(false);
  const [counter, setCounter] = createSignal(0);

  function onDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith("image/")) {
      setFile(file);
      setIsDraggedOver(false);
      setCounter(0);
    }
  }

  function onDragEnter() {
    setCounter((prev) => prev + 1);
    if (counter() === 1) setIsDraggedOver(true);
  }

  function onDragLeave() {
    setCounter((prev) => prev - 1);
    if (counter() === 0) setIsDraggedOver(false);
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
  }

  return { isDragOver, onDrop, onDragEnter, onDragOver, onDragLeave };
}
