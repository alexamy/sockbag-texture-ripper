import { createEffect, createSignal, onCleanup } from "solid-js";

export function createResize(initialWidth = 50) {
  const [dragging, setDragging] = createSignal(false);
  const [width, setWidth] = createSignal(initialWidth);
  const left = () => width();
  const right = () => 100 - width();

  createEffect(() => {
    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp);

    onCleanup(() => {
      document.body.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseup", onMouseUp);
    });
  });

  function onMouseMove(e: MouseEvent) {
    if (dragging()) {
      const width = (e.clientX / window.innerWidth) * 100;
      setWidth(width);
    }
  }

  function onMouseUp() {
    setDragging(false);
  }

  function reset() {
    setWidth(initialWidth);
  }

  function activate() {
    setDragging(true);
  }

  function deactivate() {
    setDragging(false);
  }

  return { width, left, right, activate, deactivate, reset };
}
