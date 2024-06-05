import { createMemo, createSignal } from "solid-js";

export function Region() {
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);
  const [scale, setScale] = createSignal(1);
  const transform = createMemo(
    () => `translate(${x()}px, ${y()}px) scale(${scale()})`
  );

  function onMouseDown(event: MouseEvent) {}

  function onMouseWheel(event: WheelEvent) {}

  return (
    <div
      class="region"
      style={{ transform: transform() }}
      onMouseDown={onMouseDown}
      onWheel={onMouseWheel}
    />
  );
}
