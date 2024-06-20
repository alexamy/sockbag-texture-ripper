import { styled } from "@macaron-css/solid";
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
import { createRegionMovement } from "./createRegionMovement";
import { Button } from "./styles";

interface Transform {
  current: Accessor<{ x: number; y: number }>;
  origin: Accessor<{ x: number; y: number }>;
  translate: Accessor<{ x: number; y: number }>;
  scale: Accessor<number>;
  style: Accessor<JSX.CSSProperties>;
  active: Accessor<boolean>;
}

const GridBackgroundContainer = styled("svg", {
  base: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

const RegionContainer = styled("div", {
  base: {
    position: "relative",
    width: "50%",
    height: "100vh",
    overflow: "hidden",
    color: "black",
    userSelect: "none",
    ":focus": {
      outline: "none",
    },
  },
});

const RegionContent = styled("div", {
  base: {
    transformOrigin: "0 0",
  },
});

const RegionToolbar = styled("div", {
  base: {
    position: "relative",
    zIndex: 1,
  },
});

const RegionFooter = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    padding: "10px",
  },
});

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

  const cursor = createMemo(() => {
    if (move.active()) return "grabbing";
    return "default";
  });

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
    <RegionContainer
      ref={setParent}
      style={{ width: `${props.width}%`, cursor: cursor() }}
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
        <RegionToolbar>{props.toolbar}</RegionToolbar>
        <RegionContent ref={move.setRef} style={move.style()}>
          {props.children}
        </RegionContent>
        <RegionFooter>
          <Button
            onClick={move.resetView}
            onMouseDown={(e) => e.preventDefault()}
          >
            Reset
          </Button>
        </RegionFooter>
      </RegionContext.Provider>
    </RegionContainer>
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
    <GridBackgroundContainer
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
    </GridBackgroundContainer>
  );
}

function DebugPoint(props: { point: { x: number; y: number } }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "8px",
        height: "8px",
        border: "1px solid black",
        "border-radius": "50%",
        background: "violet",
        translate: `${props.point.x}px ${props.point.y}px`,
      }}
    />
  );
}
