import { createEffect, createSignal, onCleanup } from "solid-js";

export function createResize(initialWidth = 50) {
  const [dragging, setDragging] = createSignal(false);
  const [width, setWidth] = createSignal(initialWidth);
  const left = () => width();
  const right = () => 100 - width();

  createEffect(() => {
    document.body.addEventListener("mousemove", onMouseMove);
    onCleanup(() =>
      document.body.removeEventListener("mousemove", onMouseMove)
    );
  });

  function onMouseMove(e: MouseEvent) {
    if (dragging()) {
      const width = (e.clientX / window.innerWidth) * 100;
      setWidth(width);
    }
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
