import { createEffect, createSignal, onCleanup } from "solid-js";

export function createDrag<T extends Element>(
  ref: () => T | undefined,
  set: (coords: { x: number; y: number; dx: number; dy: number }) => void
) {
  const [previous, setPrevious] = createSignal<{ x: number; y: number }>();
  const [dragging, setDragging] = createSignal(false);

  function onMouseDown(e: MouseEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function onMouseUp() {
    setDragging(false);
  }

  createEffect(() => {
    const parent = ref()?.parentElement;

    function updater(e: MouseEvent) {
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = x - (previous()?.x ?? x);
      const dy = y - (previous()?.y ?? y);
      setPrevious({ x, y });

      if (dragging()) {
        set({ x, y, dx, dy });
      }
    }

    window.addEventListener("mousemove", updater);
    window.addEventListener("mouseup", onMouseUp);

    onCleanup(() => {
      window.removeEventListener("mousemove", updater);
      window.removeEventListener("mouseup", onMouseUp);
    });
  });

  return [dragging, onMouseDown] as const;
}
