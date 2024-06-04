import { createMemo, createSignal, For, Show } from "solid-js";
import { Actor } from "xstate";
import { editorMachine, type Point, type Quad } from "./editorMachine";
import { createActorState } from "./hooks";
import * as v from "./vector";

export function Editor(props: {
  imageRect: DOMRect;
  initialEditor: Actor<typeof editorMachine>;
}) {
  const [current, setCurrent] = createSignal({ x: 0, y: 0 });

  const send = props.initialEditor.send;
  const state = createActorState(props.initialEditor);
  const quads = createMemo(() => state.context.quads);
  const points = createMemo(() => state.context.points);

  const first = createMemo(() => points()[0]);
  const last = createMemo(() => points()[points().length - 1]);

  const style = createMemo(() => {
    const rect = props.imageRect;
    return {
      left: `${rect.x}px`,
      top: `${rect.y}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    };
  });

  const viewBox = createMemo(() => {
    const rect = props.imageRect;
    return [0, 0, rect.width, rect.height].join(" ");
  });

  function onMouseMove(e: MouseEvent) {
    const rect = props.imageRect;
    const x = e.clientX - rect.left + window.scrollX;
    const y = e.clientY - rect.top + window.scrollY;
    setCurrent({ x, y });
  }

  function onClick() {
    send({ type: "click", point: current() });
  }

  return (
    <svg
      class="svg-canvas"
      viewBox={viewBox()}
      style={style()}
      onClick={onClick}
      onMouseMove={onMouseMove}
    >
      <For each={quads()}>{(quad) => <Quad quad={quad} />}</For>
      <Point p={current()} />
      <For each={points()}>
        {(point, i) => (
          <>
            <Point p={point} />
            <Line p1={point} p2={points()[i() + 1] ?? point} />
          </>
        )}
      </For>
      <Show when={points().length >= 1}>
        <Line p1={last()} p2={current()} />
      </Show>
      <Show when={points().length >= 2}>
        <Line p1={first()} p2={current()} />
      </Show>
    </svg>
  );
}

function Quad(props: { quad: Quad }) {
  const top = createMemo(() => {
    const quad = props.quad;
    const x = (quad[0].x + quad[1].x) / 2;
    const y = (quad[0].y + quad[1].y) / 2;
    return { x, y };
  });

  const center = createMemo(() => {
    const quad = props.quad;
    const x = (quad[0].x + quad[1].x + quad[2].x + quad[3].x) / 4;
    const y = (quad[0].y + quad[1].y + quad[2].y + quad[3].y) / 4;
    return { x, y };
  });

  return (
    <>
      <polygon
        points={props.quad.map((point) => `${point.x},${point.y}`).join(" ")}
        fill="white"
        fill-opacity={0.3}
        stroke="white"
        stroke-width="2"
      />
      <Line p1={top()} p2={center()} stroke="red" />
      <Tip p={top()} n={center()} />
      <For each={props.quad}>{(point) => <Point p={point} />}</For>
    </>
  );
}

function Tip(props: { p: Point; n: Point }) {
  const vec = () => v.fromTo(props.n, props.p);
  const dist = () => v.scale(v.normalize(vec()), 10);

  const left = () => v.rotate(dist(), Math.PI / 2);
  const right = () => v.rotate(dist(), -Math.PI / 2);

  const pairs = () => [
    props.p,
    v.add(v.subtract(props.p, dist()), left()),
    v.add(v.subtract(props.p, dist()), right()),
  ];

  const points = () =>
    pairs()
      .map((p) => `${p.x},${p.y}`)
      .join(" ");

  return <polygon points={points()} fill="red" />;
}

function Line(props: { p1: Point; p2: Point; stroke?: string }) {
  return (
    <line
      x1={props.p1.x}
      y1={props.p1.y}
      x2={props.p2.x}
      y2={props.p2.y}
      stroke={props.stroke ?? "white"}
      stroke-width="2"
    />
  );
}

function Point(props: { p: Point }) {
  return <circle cx={props.p.x} cy={props.p.y} r="4" fill="white" />;
}
