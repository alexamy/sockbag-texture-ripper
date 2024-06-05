import { createEffect, createMemo, createSignal } from "solid-js";

type Transform = { x: number; y: number; scale: number };

export function Region(props: {
  setTransform?: (transform: Transform) => void;
}) {
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);
  const [scale, setScale] = createSignal(1);

  createEffect(() => {
    if (!props.setTransform) return;
    props.setTransform({ x: x(), y: y(), scale: scale() });
  });

  const transform = createMemo(
    () => `translate(${x()}px, ${y()}px) scale(${scale()})`
  );

  const [startPoint, setStartPoint] = createSignal({ x: 0, y: 0 });

  function onMouseDown(event: MouseEvent) {
    setStartPoint({ x: event.clientX, y: event.clientY });
  }

  function onMouseUp(event: MouseEvent) {}

  function onMouseMove(event: MouseEvent) {
    if (event.buttons === 1) {
      const dx = event.clientX - startPoint().x;
      const dy = event.clientY - startPoint().y;
      setX(x() + dx);
      setY(y() + dy);
      setStartPoint({ x: event.clientX, y: event.clientY });
    }
  }

  function onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    event.stopPropagation();

    const delta =
      Math.sign(event.deltaY) * Math.min(80, Math.abs(event.deltaY));
    const newScale = scale() * (1 - delta / 800);
    setScale(newScale);
  }

  function onScroll(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <div
      class="region"
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
      onWheel={onMouseWheel}
      onScroll={onScroll}
    >
      <div class="region-content" style={{ transform: transform() }}>
        <svg
          class="transparent-background"
          width="40"
          height="40"
          xmlns="http://www.w3.org/2000/svg"
          style={{ transform: "" }}
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
      </div>
    </div>
  );
}
