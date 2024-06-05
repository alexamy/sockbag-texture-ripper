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
    >
      <Background />
    </div>
  );
}

function Background() {
  return (
    <svg
      class="transparent-background"
      width="40"
      height="40"
      xmlns="http://www.w3.org/2000/svg"
    >
      <pattern
        id="checkerboard"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <rect width="10" height="10" fill="#eeeeee" />
        <rect x="10" width="10" height="10" fill="#ffffff" />
        <rect y="10" width="10" height="10" fill="#ffffff" />
        <rect x="10" y="10" width="10" height="10" fill="#eeeeee" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#checkerboard)" />
    </svg>
  );
}
