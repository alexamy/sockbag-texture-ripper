import { useRegionContext } from "#/Region";
import { v } from "#/lib/vector";
import { useAppStore } from "#/store";
import { styled } from "@macaron-css/solid";
import { For, Show, createMemo, createSignal, onMount } from "solid-js";
import { Line, Quad } from "./Elements";

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
  const region = useRegionContext();
  const [store, { updateCurrent, addPoint, deleteLastPoint }] =
    useAppStore().editor;

  const current = () => store.current;
  const quads = () => store.quadPoints;
  const buffer = () => store.buffer;

  const first = createMemo(() => buffer()[0]);
  const last = createMemo(() => buffer()[buffer().length - 1]);

  const top = createMemo(() => v.average(buffer().slice(0, 2)));
  const bottom = createMemo(() => v.average([last() ?? v.Zero(), current()]));

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
    let x = (e.clientX - rect.left) / region.scale();
    let y = (e.clientY - rect.top) / region.scale();

    // only straight lines with shift
    if (e.shiftKey && last()) {
      const current = v.make(x, y);
      const vec = v.abs(v.fromTo(current, last()));
      if (vec.x > vec.y) {
        y = last().y;
      } else {
        x = last().x;
      }
    }

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
      {/* Already drawn quads */}
      <For each={quads()}>{(quad) => <Quad quad={quad} />}</For>

      {/* Currently drawn quad */}
      <For each={buffer()}>
        {(point, i) => (
          <>
            <Line from={point} to={buffer()[i() + 1] ?? point} />
          </>
        )}
      </For>

      {/* Helpers for currently drawn quad */}
      <Show when={buffer().length >= 1}>
        <Line from={last()} to={current()} />
      </Show>
      <Show when={buffer().length >= 2}>
        <Line from={first()} to={current()} />
      </Show>

      {/* Normal line */}
      <Show when={buffer().length === 2}>
        <Line from={current()} to={top()} withTip={true} color="darkred" />
      </Show>
      <Show when={buffer().length === 3}>
        <Line from={bottom()} to={top()} withTip={true} color="darkred" />
      </Show>
    </Canvas>
  );
}
