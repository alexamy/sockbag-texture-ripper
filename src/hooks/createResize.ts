import { createSignal } from "solid-js";

export function createResize() {
  const [dragging, setDragging] = createSignal(false);
  const [width, setWidth] = createSignal(50);
  const left = () => width();
  const right = () => 100 - width();

  function onMouseMove(e: MouseEvent) {
    if (dragging()) {
      const width = (e.clientX / window.innerWidth) * 100;
      setWidth(width);
    }
  }

  function reset() {
    setWidth(50);
  }

  function activate() {
    setDragging(true);
  }

  function deactivate() {
    setDragging(false);
  }

  return { width, left, right, onMouseMove, reset, activate, deactivate };
}
