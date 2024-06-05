import {
  JSXElement,
  children,
  createEffect,
  createMemo,
  createSignal,
  onMount,
} from "solid-js";
import "./Region.css";

type Transform = { x: number; y: number; scale: number };

export function Region(props: {
  children: JSXElement;
  setTransform?: (transform: Transform) => void;
}) {
  const {
    x,
    y,
    scale,
    transform,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseWheel,
    onScroll,
  } = createMovement();

  // provide the transform to the parent component
  createEffect(() => {
    if (!props.setTransform) return;
    props.setTransform({ x: x(), y: y(), scale: scale() });
  });

  const [parent, setParent] = createSignal<HTMLElement>();
  const [size, setSize] = createSignal({ width: 0, height: 0 });
  onMount(() => {
    const size = parent()!.getBoundingClientRect();
    setSize(size);
  });

  const resolved = children(() => props.children);

  return (
    <div
      class="region"
      ref={setParent}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseUp}
      onWheel={onMouseWheel}
      onScroll={onScroll}
    >
      <GridBackground
        scale={scale()}
        width={size().width}
        height={size().height}
      />
      <div class="region-content" style={{ transform: transform() }}>
        {resolved()}
      </div>
    </div>
  );
}

function GridBackground(props: {
  width: number;
  height: number;
  scale: number;
}) {
  const size = createMemo(() => {
    const factor = 1 / props.scale;
    return {
      width: props.width * factor,
      height: props.height * factor,
    };
  });

  return (
    <svg
      class="grid-background"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        "transform-origin": "0 0",
        transform: `scale(${props.scale})`,
        width: `${size().width}px`,
        height: `${size().height}px`,
      }}
    >
      <rect width="100%" height="100%" fill="url(#checkerboard)" />
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
    </svg>
  );
}

function createMovement() {
  // transform
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);
  const [scale, setScale] = createSignal(1);
  const transform = createMemo(
    () => `translate(${x()}px, ${y()}px) scale(${scale()})`
  );

  // pan
  const [startPoint, setStartPoint] = createSignal({ x: 0, y: 0 });

  function onMouseDown(event: MouseEvent) {
    setStartPoint({ x: event.clientX, y: event.clientY });
  }

  function onMouseUp(_event: MouseEvent) {}

  function onMouseMove(event: MouseEvent) {
    if (event.buttons === 1) {
      const dx = event.clientX - startPoint().x;
      const dy = event.clientY - startPoint().y;
      setX(x() + dx);
      setY(y() + dy);
      setStartPoint({ x: event.clientX, y: event.clientY });
    }
  }

  // zoom
  function onScroll(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function onMouseWheel(event: WheelEvent) {
    event.preventDefault();
    event.stopPropagation();

    const delta =
      Math.sign(event.deltaY) * Math.min(80, Math.abs(event.deltaY));
    const newScale = scale() * (1 - delta / 800);
    setScale(newScale);
  }

  return {
    x,
    y,
    scale,
    transform,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseWheel,
    onScroll,
  };
}
