import { createMemo, createSignal, For, onMount, Show } from "solid-js";
import { Region, useRegionContext } from "./Region";
import { useAppStore } from "./store";
import { type Point as PointId, type Quad } from "./store/editor";
import { v } from "./vector";

type Point = { x: number; y: number };

export function Editor() {
  const [store] = useAppStore().file;
  const [imageRef, setImageRef] = createSignal<HTMLImageElement>();

  return (
    <Region>
      <div class="editor-canvas">
        <ImageBackground src={store.url} onLoadRef={setImageRef} />
        <Show when={imageRef()}>
          <DrawingBoard imageRef={imageRef()!} />
        </Show>
      </div>
    </Region>
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
  const quads = () => store.quads;
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
    <svg
      ref={setSvgRef}
      class="svg-canvas"
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
        <Line from={current()} to={top()} withTip={true} color="red" />
      </Show>
      <Show when={points().length === 3}>
        <Line from={bottom()} to={top()} withTip={true} color="red" />
      </Show>
    </svg>
  );
}

function Quad(props: { quad: Quad }) {
  const top = createMemo(() => v.average(props.quad.slice(0, 2)));
  const center = createMemo(() => v.average(props.quad));

  return (
    <>
      <polygon
        points={props.quad.map((point) => `${point.x},${point.y}`).join(" ")}
        fill="white"
        fill-opacity={0.3}
        stroke="white"
        stroke-width="1"
      />
      <Line from={center()} to={top()} withTip={true} color="red" />
      <For each={props.quad}>{(point) => <DragPoint p={point} />}</For>
    </>
  );
}

function DragPoint(props: { p: PointId }) {
  const [_, { updatePoint }] = useAppStore().editor;
  const [r, setR] = createSignal(2);

  function onMouseMove(e: MouseEvent) {
    if (e.buttons === 1) {
      updatePoint(props.p.id);
    }
  }

  return (
    <circle
      cx={props.p.x}
      cy={props.p.y}
      r={r()}
      fill={"black"}
      onMouseMove={onMouseMove}
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setR(4)}
      onMouseLeave={() => setR(2)}
    />
  );
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
    props.to,
    v.add(v.subtract(props.to, v.scale(dist(), 1.5)), left()),
    v.add(v.subtract(props.to, v.scale(dist(), 1.5)), right()),
  ];

  const tip = () =>
    pairs()
      .map((p) => `${p.x},${p.y}`)
      .join(" ");

  const color = () => props.color ?? "white";

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
