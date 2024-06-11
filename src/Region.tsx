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
import { v } from "./vector";

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
  const [active, setActive] = createSignal(false);
  const [current, setCurrent] = createSignal({ x: 0, y: 0 });

  const [translate, setTranslate] = createSignal({ x: 0, y: 0 });
  const [origin, setOrigin] = createSignal({ x: 0, y: 0 });
  const [scale, setScale] = createSignal(3);

  const style = createMemo(() => {
    const { x, y } = translate();
    return {
      "transform-origin": `${origin().x}px ${origin().y}px`,
      transform: `translate(${x}px, ${y}px) scale(${scale()}) `,
    } satisfies JSX.CSSProperties;
  });

  // pan
  function onMouseLeave() {
    setActive(false);
  }

  function onMouseMove(event: MouseEvent) {
    const mousePosition = { x: event.clientX, y: event.clientY };

    if (active()) {
      const delta = v.subtract(mousePosition, current());
      const next = v.add(translate(), delta);
      setTranslate(next);
      // const offset = v.scale(mousePosition, scale() - 1);
      // setOrigin(mousePosition);
    }

    setCurrent(mousePosition);
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

    const next = getScale(event);
    setScale(next);
  }

  function getScale(event: WheelEvent) {
    const dy = event.deltaY;
    const amount = Math.min(80, Math.abs(dy));
    const delta = Math.sign(dy) * amount;
    const newScale = scale() * (1 - delta / 800);
    return newScale;
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

  // api
  function resetView() {
    // setScale(1);
    // setOrigin({ x: 0, y: 0 });
    // setTranslate({ x: 0, y: 0 });
  }

  // prettier-ignore
  return {
    active,
    translate, origin, scale, style,
    setActive, resetView,
    onMouseMove, onMouseLeave,
    onMouseWheel, onScroll,
    onKeyDown, onKeyUp,
  };
}
