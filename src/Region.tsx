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
import { GridBackground } from "./GridBackground";
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

const Container = styled("div", {
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

const Content = styled("div", {
  base: {
    transformOrigin: "0 0",
    width: "100%",
    height: "100%",
  },
});

const Toolbar = styled("div", {
  base: {
    position: "relative",
    zIndex: 1,
  },
});

const Footer = styled("div", {
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
  testId?: string;
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
    <Container
      ref={setParent}
      data-testid={props.testId}
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
        <Toolbar>{props.toolbar}</Toolbar>
        <Content
          data-testid={props.testId + "-content"}
          ref={move.setRef}
          style={move.style()}
        >
          {props.children}
        </Content>
        <Footer data-testid={props.testId + "-footer"}>
          <Button
            onClick={move.resetView}
            onMouseDown={(e) => e.preventDefault()}
          >
            Reset view
          </Button>
        </Footer>
      </RegionContext.Provider>
    </Container>
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
