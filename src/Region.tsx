import {
  Accessor,
  JSX,
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
import { createRegionMovement } from "./createRegionMovement";

interface Transform {
  translate: Accessor<{ x: number; y: number }>;
  scale: Accessor<number>;
  style: Accessor<JSX.CSSProperties>;
  active: Accessor<boolean>;
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
  const move = createRegionMovement();
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
      <RegionContext.Provider value={move}>
        <div class="region-toolbar">{props.toolbar}</div>
        <div class="region-content" style={move.style()}>
          {props.children}
          <DebugPoint point={move.origin()} />
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

function DebugPoint(props: { point: { x: number; y: number } }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "4px",
        height: "4px",
        "border-radius": "50%",
        background: "violet",
        translate: `${props.point.x}px ${props.point.y}px`,
      }}
    />
  );
}
