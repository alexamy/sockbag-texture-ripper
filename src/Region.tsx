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

export function Region(props: { children: JSXElement }) {
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
    onKeyDown,
    onKeyUp,
  } = createMovement();

  const [parent, setParent] = createSignal<HTMLElement>();
  const [size, setSize] = createSignal({ width: 0, height: 0 });
  onMount(() => {
    const size = parent()!.getBoundingClientRect();
    setSize(size);
  });

  function onMouseEnter() {
    parent()?.focus({ preventScroll: true });
  }

  return (
    <div
      class="region"
      ref={setParent}
      onMouseEnter={onMouseEnter}
      onMouseUp={onMouseUp}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onWheel={onMouseWheel}
      onScroll={onScroll}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
      tabindex="0"
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
      width: Math.round(props.width * factor),
      height: Math.round(props.height * factor),
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
        <rect width="11" height="11" fill="#eeeeee" />
        <rect x="10" width="11" height="11" fill="#ffffff" />
        <rect y="10" width="11" height="11" fill="#ffffff" />
        <rect x="10" y="10" width="11" height="11" fill="#eeeeee" />
      </pattern>
    </svg>
  );
}

function createMovement() {
  // transform
  const [active, setActive] = createSignal(false);
  const [x, setX] = createSignal(0);
  const [y, setY] = createSignal(0);
  const [scale, setScale] = createSignal(1);
  const transform = createMemo(
    () => `translate(${x()}px, ${y()}px) scale(${scale()})`
  );

  // pan
  const [startPoint, setStartPoint] = createSignal<{ x: number; y: number }>();

  function onMouseDown(event: MouseEvent) {
    setStartPoint({ x: event.clientX, y: event.clientY });
  }

  function onMouseUp(_event: MouseEvent) {
    setStartPoint(undefined);
  }

  function onMouseLeave(_event: MouseEvent) {
    setStartPoint(undefined);
  }

  function onMouseMove(event: MouseEvent) {
    if (!startPoint() || !active()) {
      setStartPoint({ x: event.clientX, y: event.clientY });
    }

    if (!active()) return;
    const dx = event.clientX - startPoint()!.x;
    const dy = event.clientY - startPoint()!.y;
    setX(x() + dx);
    setY(y() + dy);
    setStartPoint({ x: event.clientX, y: event.clientY });
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

  // activation
  function onKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    if (e.key === " ") {
      setActive(true);
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    e.preventDefault();
    if (e.key === " ") {
      setActive(false);
    }
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
    onKeyDown,
    onKeyUp,
  };
}
