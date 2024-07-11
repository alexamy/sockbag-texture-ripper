import { useRegionContext } from "@/Region";
import { useAppStore } from "@/store";
import { styled } from "@macaron-css/solid";
import { For, JSX, createMemo, createSignal, onMount } from "solid-js";
import { Point } from "./Point";
import { Quad } from "./Quad";

const Canvas = styled("svg", {
  base: {
    userSelect: "none",
    position: "absolute",
    top: 0,
    left: 0,
    border: "1px solid white",
  },
});

export function DrawingBoard(props: {
  image: HTMLImageElement;
  background: HTMLImageElement;
}) {
  const [store, api, setStore] = useAppStore().editor;
  const region = useRegionContext();

  const dimensions = createMemo(() => {
    return {
      width: props.image.naturalWidth,
      height: props.image.naturalHeight,
    };
  });

  function updatePoint(i: number, delta: { dx: number; dy: number }) {
    setStore("points", i, (point) => ({
      x: point.x + delta.dx / region.scale(),
      y: point.y + delta.dy / region.scale(),
    }));
  }

  return (
    <DrawingCanvas dimensions={dimensions()} image={props.background}>
      <For each={api.quadPoints()}>{(quad) => <Quad points={quad} />}</For>
      <Quad points={api.currentQuad()} />

      <For each={store.points}>
        {(point, i) => (
          <Point
            {...point}
            draggable
            update={(delta) => updatePoint(i(), delta)}
          />
        )}
      </For>

      <For each={store.buffer}>{(point) => <Point {...point} />}</For>
    </DrawingCanvas>
  );
}

// TODO move current point to DrawingCanvas

function DrawingCanvas(props: {
  children: JSX.Element;
  dimensions: { width: number; height: number };
  image: HTMLImageElement;
}) {
  const region = useRegionContext();
  const [_2, { setCurrent, addPoint, deleteLastPoint }] = useAppStore().editor;

  // style
  const style = createMemo(() => ({
    width: `${props.dimensions.width}px`,
    height: `${props.dimensions.height}px`,
  }));

  const viewBox = createMemo(() =>
    [0, 0, props.dimensions.width, props.dimensions.height].join(" ")
  );

  // handlers
  function onMouseMove(e: MouseEvent) {
    const rect = props.image?.getBoundingClientRect() ?? { left: 0, top: 0 };
    const x = (e.clientX - rect.left) / region.scale();
    const y = (e.clientY - rect.top) / region.scale();
    setCurrent({ x, y });
  }

  function onClick(e: MouseEvent) {
    e.preventDefault();
    if (e.button === 0) {
      addPoint();
    } else if (e.button === 2) {
      deleteLastPoint();
    }
  }

  const [svgRef, setSvgRef] = createSignal<SVGSVGElement>();
  onMount(() => svgRef()!.focus());

  return (
    <Canvas
      ref={setSvgRef}
      viewBox={viewBox()}
      style={style()}
      onClick={onClick}
      onContextMenu={onClick}
      onMouseMove={onMouseMove}
    >
      {props.children}
    </Canvas>
  );
}
