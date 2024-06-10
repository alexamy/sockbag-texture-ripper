import {
  Accessor,
  JSXElement,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  on,
  onCleanup,
  onMount,
  useContext,
} from "solid-js";
import "./Region.css";

interface Transform {
  position: Accessor<{ x: number; y: number }>;
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
  toolbar?: JSXElement;
  width: number;
  resetTrigger: unknown;
}) {
  const move = createMovement();
  const [parent, setParent] = createSignal<HTMLElement>();
  const [size, setSize] = createSignal({ width: 0, height: 0 });

  onMount(updateSize);
  createEffect(on(() => props.resetTrigger, move.resetView));

  createEffect(() => {
    const observer = new ResizeObserver(updateSize);
    observer.observe(parent()!);
    onCleanup(() => observer.disconnect());
  });

  function updateSize() {
    const size = parent()!.getBoundingClientRect();
    setSize(size);
  }

  function onMouseEnter() {
    parent()?.focus({ preventScroll: true });
  }

  return (
    <div
      class="region"
      ref={setParent}
      style={{ width: `${props.width}%` }}
      onMouseEnter={onMouseEnter}
      onMouseUp={move.onMouseUp}
      onMouseDown={move.onMouseDown}
      onMouseMove={move.onMouseMove}
      onMouseLeave={move.onMouseLeave}
      onWheel={move.onMouseWheel}
      onScroll={move.onScroll}
      onKeyDown={move.onKeyDown}
      onKeyUp={move.onKeyUp}
      tabindex="0"
    >
      <GridBackground
        scale={move.scale()}
        width={size().width}
        height={size().height}
      />
      <RegionContext.Provider value={{ ...move }}>
        <div class="region-toolbar">{props.toolbar}</div>
        <div
          class="region-content"
          style={{
            "transform-origin": move.transformOrigin(),
            transform: move.transform(),
          }}
        >
          {props.children}
        </div>
        <div class="region-footer">
          <button
            class="region-button"
            onClick={move.resetView}
            onMouseDown={(e) => e.preventDefault()}
          >
            Reset
          </button>
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
  const [position, setPosition] = createSignal({ x: 0, y: 0 });
  const [scale, setScale] = createSignal(1);
  const [origin, setOrigin] = createSignal({ x: 0, y: 0 });

  const transformOrigin = createMemo(() => `${origin().x}px ${origin().y}px`);
  const transform = createMemo(
    () => `translate(${position().x}px, ${position().y}px) scale(${scale()})`
  );

  // TODO x and y must respect origin

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
    setActive(false);
  }

  function onMouseMove(event: MouseEvent) {
    if (!startPoint() || !active()) {
      setStartPoint({ x: event.clientX, y: event.clientY });
    }

    if (!active()) return;
    const dx = event.clientX - startPoint()!.x;
    const dy = event.clientY - startPoint()!.y;
    const { x, y } = position();
    setPosition({ x: x + dx, y: y + dy });
    setStartPoint({ x: event.clientX, y: event.clientY });
  }

  // zoom
  function onScroll(event: Event) {
    if (!active()) return;
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

  // activation
  function onKeyDown(e: KeyboardEvent) {
    e.preventDefault();
    if (e.key === " ") {
      setActive(true);
      const { x, y } = startPoint()!;
      setOrigin({ x, y });
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    e.preventDefault();
    if (e.key === " ") {
      setActive(false);
    }
  }

  // helpers
  function resetView() {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  }

  return {
    position,
    scale,
    transformOrigin,
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
    resetView,
  };
}
