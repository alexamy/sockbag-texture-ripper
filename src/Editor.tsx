import { createMemo, createSignal, For, Show } from "solid-js";
import { Actor } from "xstate";
import { editorMachine, type Point, type Quad } from "./editorMachine";
import { createActorState } from "./hooks";
import { v } from "./vector";

export function Editor(props: {
  imageRef: HTMLImageElement;
  initialEditor: Actor<typeof editorMachine>;
  transform: { x: number; y: number; scale: number };
}) {
  const [current, setCurrent] = createSignal({ x: 0, y: 0 });

  const send = props.initialEditor.send;
  const state = createActorState(props.initialEditor);
  const quads = createMemo(() => state.context.quads);
  const points = createMemo(() => state.context.points);

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
    const x = (e.clientX - rect.left) / props.transform.scale;
    const y = (e.clientY - rect.top) / props.transform.scale;

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

    setCurrent({ x, y });
  }

  function onClick(e: MouseEvent) {
    e.preventDefault();
    if (e.button === 0) {
      send({ type: "addPoint", point: current() });
    } else if (e.button === 2) {
      send({ type: "discard" });
    }
  }

  return (
    <svg
      class="svg-canvas"
      viewBox={viewBox()}
      style={style()}
      onClick={onClick}
      onContextMenu={onClick}
      onMouseMove={onMouseMove}
    >
      <For each={quads()}>{(quad) => <Quad quad={quad} />}</For>
      <Point p={current()} r={4} fill="red" />
      <For each={points()}>
        {(point, i) => (
          <>
            {/* <Point p={point} /> */}
            <Line from={point} to={points()[i() + 1] ?? point} />
          </>
        )}
      </For>

      <Show when={points().length >= 1}>
        <Line from={last()} to={current()} />
      </Show>
      <Show when={points().length >= 2}>
        <Line from={first()} to={current()} />
      </Show>

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
      <For each={props.quad}>{(point) => <Point p={point} />}</For>
    </>
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

function Point(props: { p: Point; r?: number; fill?: string }) {
  return (
    <circle
      cx={props.p.x}
      cy={props.p.y}
      r={props.r ?? 2}
      fill={props.fill ?? "black"}
    />
  );
}
