import { v } from "#/lib/vector";
import { styled } from "@macaron-css/solid";
import { createMemo, createSignal, For, onMount, Show } from "solid-js";
import { useRegionContext } from "./Region";
import { useAppStore } from "./store";
import { type Point as PointId, type QuadPoints } from "./store/editor";

type Point = { x: number; y: number };

const Container = styled("div", {
  base: {
    userSelect: "none",
    position: "absolute",
    top: 0,
    left: 0,
    border: "1px solid white",
  },
});

const Canvas = styled("svg", {
  base: {
    userSelect: "none",
    position: "absolute",
    top: 0,
    left: 0,
    border: "1px solid white",
  },
});

export function Editor() {
  const [store] = useAppStore().file;

  // image reference is pointing at the same img element,
  // but we must retrigger each time the image is loaded
  const [imageRef, setImageRef] = createSignal<HTMLImageElement | undefined>(
    undefined,
    { equals: false }
  );

  return (
    <Container>
      <ImageBackground src={store.url} onLoadRef={setImageRef} />
      <Show when={imageRef()}>
        <DrawingBoard imageRef={imageRef()!} />
      </Show>
    </Container>
  );
}

function ImageBackground(props: {
  src: string;
  onLoadRef: (ref: HTMLImageElement) => void;
}) {
  function onLoad(e: Event) {
    const image = e.target as HTMLImageElement;
    props.onLoadRef(image);
  }

  return <img src={props.src} alt="Uploaded image" onLoad={onLoad} />;
}

function DrawingBoard(props: { imageRef: HTMLImageElement }) {
  const region = useRegionContext();
  const [store, { updateCurrent, addPoint, deleteLastPoint }] =
    useAppStore().editor;

  const current = () => store.current;
  const quads = () => store.quadPoints;
  const points = () => store.buffer;

  const first = createMemo(() => points()[0]);
  const last = createMemo(() => points()[points().length - 1]);

  const top = createMemo(() => v.average(points().slice(0, 2)));
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
      <For each={points()}>
        {(point, i) => (
          <>
            <Line from={point} to={points()[i() + 1] ?? point} />
          </>
        )}
      </For>

      {/* Helpers for currently drawn quad */}
      <Show when={points().length >= 1}>
        <Line from={last()} to={current()} />
      </Show>
      <Show when={points().length >= 2}>
        <Line from={first()} to={current()} />
      </Show>

      {/* Normal line */}
      <Show when={points().length === 2}>
        <Line from={current()} to={top()} withTip={true} color="darkred" />
      </Show>
      <Show when={points().length === 3}>
        <Line from={bottom()} to={top()} withTip={true} color="darkred" />
      </Show>
    </Canvas>
  );
}

function Quad(props: { quad: QuadPoints }) {
  const [highlighted, setHighlighted] = createSignal(false);
  const [dragging, setDragging] = createSignal(false);

  const top = createMemo(() => v.average(props.quad.slice(0, 2)));
  const center = createMemo(() => v.average(props.quad));

  const points = createMemo(() =>
    props.quad.map((point) => `${point.x},${point.y}`).join(" ")
  );

  function onMouseMove(e: MouseEvent) {
    e.stopPropagation();
  }

  return (
    <>
      <polygon
        points={points()}
        stroke="greenyellow"
        stroke-width="1"
        fill="greenyellow"
        fill-opacity={highlighted() ? 0.6 : 0.2}
        style={{ cursor: highlighted() ? "pointer" : "default" }}
        onMouseEnter={() => setHighlighted(true)}
        onMouseLeave={() => setHighlighted(false)}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={() => setDragging(true)}
        onMouseUp={() => setDragging(false)}
        onMouseMove={onMouseMove}
      />
      <Line from={center()} to={top()} withTip={true} color="darkred" />
      <For each={props.quad}>{(point) => <DragPoint p={point} />}</For>
    </>
  );
}

function DragPoint(props: { p: PointId }) {
  return <circle cx={props.p.x} cy={props.p.y} r={2} fill="black" />;
}

function Line(props: {
  from: Point;
  to: Point;
  withTip?: boolean;
  color?: string;
}) {
  const vec = () => v.normalize(v.fromTo(props.from, props.to));
  const dist = () => v.scale(vec(), 10);
  const left = () => v.scale(v.normal(vec()), 5);
  const right = () => v.negate(left());

  const pairs = () => [
    v.add(props.to, v.scale(right(), 0.15)),
    v.add(props.to, v.scale(left(), 0.15)),
    v.add(v.subtract(props.to, v.scale(dist(), 1.5)), left()),
    v.add(v.subtract(props.to, v.scale(dist(), 1.5)), right()),
  ];

  const tip = () =>
    pairs()
      .map((p) => `${p.x},${p.y}`)
      .join(" ");

  const color = () => props.color ?? "greenyellow";

  return (
    <>
      <line
        x1={props.from.x}
        y1={props.from.y}
        x2={props.to.x}
        y2={props.to.y}
        stroke={color()}
        stroke-width="1.5"
      />
      <Show when={props.withTip}>
        <polygon points={tip()} fill={color()} />
      </Show>
    </>
  );
}
