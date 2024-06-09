import { createSignal } from "solid-js";

export function createDnd(setFile: (blob: Blob) => void) {
  const [isDraggedOver, setIsDraggedOver] = createSignal(false);

  function onDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files[0];
    if (file && file.type.startsWith("image/")) {
      setFile(file);
    }
  }

  function onDragOver(e: DragEvent) {
    e.preventDefault();
    setIsDraggedOver(true);
  }

  function onDragLeave() {
    setIsDraggedOver(false);
  }

  return { isDraggedOver, onDrop, onDragOver, onDragLeave };
}
