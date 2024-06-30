import { useRegionContext } from "@/Region";
import { useAppStore } from "@/store";
import { styled } from "@macaron-css/solid";
import { For, JSX, createMemo, createSignal, onMount } from "solid-js";
import { Point, Quad } from "./Elements";

const Canvas = styled("svg", {
  base: {
    userSelect: "none",
    position: "absolute",
    top: 0,
    left: 0,
    border: "1px solid white",
  },
});

export function DrawingBoard(props: { imageRef: HTMLImageElement }) {
  const [store] = useAppStore().editor;

  return (
    <DrawingCanvas imageRef={props.imageRef}>
      <For each={store.quadPoints}>{(quad) => <Quad points={quad} />}</For>
      <Quad points={store.currentQuad} />

      <For each={store.points}>{(point) => <Point p={point} />}</For>
      <For each={store.buffer}>{(point) => <Point p={point} />}</For>
    </DrawingCanvas>
  );
}

// TODO move current point to DrawingCanvas

function DrawingCanvas(props: {
  imageRef: HTMLImageElement;
  children: JSX.Element;
}) {
  const region = useRegionContext();
  const [_, { updateCurrent, addPoint, deleteLastPoint }] =
    useAppStore().editor;

  // style
  const dimensions = createMemo(() => {
    const rect = props.imageRef.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });

  const style = createMemo(() => ({
    width: `${dimensions().width}px`,
    height: `${dimensions().height}px`,
  }));

  const viewBox = createMemo(() =>
    [0, 0, dimensions().width, dimensions().height].join(" ")
  );

  // handlers
  function onMouseMove(e: MouseEvent) {
    const rect = props.imageRef.getBoundingClientRect();
    const x = (e.clientX - rect.left) / region.scale();
    const y = (e.clientY - rect.top) / region.scale();
    updateCurrent({ x, y });
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
