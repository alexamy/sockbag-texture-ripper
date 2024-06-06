import {
  Accessor,
  JSXElement,
  createContext,
  createMemo,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import "./Region.css";

interface Transform {
  x: Accessor<number>;
  y: Accessor<number>;
  scale: Accessor<number>;
  transform: Accessor<string>;
  active: Accessor<boolean>;
  setActive: (active: boolean) => void;
}

const RegionContext = createContext<Transform>();

export function useRegionContext() {
  const value = useContext(RegionContext);

  if (value === undefined) {
    throw new Error("useRegionContext must be used within a Region.");
  }

  return value!;
}

export function Region(props: {
  children: JSXElement;
  trigger?: "click" | "move";
}) {
  const {
    x,
    y,
    scale,
    transform,
    active,
    setActive,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseLeave,
    onMouseWheel,
    onScroll,
  } = createMovement({
    trigger: props.trigger ?? "click",
  });

  const [parent, setParent] = createSignal<HTMLElement>();
  const [size, setSize] = createSignal({ width: 0, height: 0 });
  onMount(() => {
    const size = parent()!.getBoundingClientRect();
    setSize(size);
  });

  return (
    <div
      class="region"
      ref={setParent}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onWheel={onMouseWheel}
      onScroll={onScroll}
    >
      <GridBackground
        scale={scale()}
        width={size().width}
        height={size().height}
      />
      <RegionContext.Provider
        value={{ x, y, scale, transform, active, setActive }}
      >
        <div class="region-content" style={{ transform: transform() }}>
          {props.children}
        </div>
      </RegionContext.Provider>
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

function createMovement(opts: { trigger: "click" | "move" }) {
  // transform
  const [active, setActive] = createSignal(true);
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);
  const [scale, setScale] = createSignal(1);
  const transform = createMemo(
    () => `translate(${x()}px, ${y()}px) scale(${scale()})`
  );

  // pan
  const [startPoint, setStartPoint] = createSignal<{ x: number; y: number }>();

  function onMouseDown(event: MouseEvent) {
    if (!active()) return;
    setStartPoint({ x: event.clientX, y: event.clientY });
  }

  function onMouseUp(_event: MouseEvent) {
    if (!active()) return;
    setStartPoint(undefined);
  }

  function onMouseLeave(_event: MouseEvent) {
    if (!active()) return;
    setStartPoint(undefined);
  }

  function onMouseMove(event: MouseEvent) {
    if (!active()) return;
    if (!startPoint()) {
      setStartPoint({ x: event.clientX, y: event.clientY });
    }

    if (event.buttons === 1 || opts.trigger === "move") {
      const dx = event.clientX - startPoint()!.x;
      const dy = event.clientY - startPoint()!.y;
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
    if (!active()) return;
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
    active,
    setActive,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseLeave,
    onMouseWheel,
    onScroll,
  };
}
