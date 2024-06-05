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

  const top = createMemo(() => v.average(points().slice(0, 2)));
  const center = createMemo(() => v.average([...points(), current()]));

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
        <LineTip from={center()} to={top()} maxLength={50} />
        <Line p1={first()} p2={current()} />
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
        stroke-width="2"
      />
      <LineTip from={center()} to={top()} maxLength={50} />
      <For each={props.quad}>{(point) => <Point p={point} />}</For>
    </>
  );
}

function LineTip(props: { from: Point; to: Point; maxLength?: number }) {
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

  const from = () =>
    props.maxLength
      ? v.add(props.to, v.scale(vec(), -props.maxLength))
      : props.from;

  return (
    <>
      <polygon points={tip()} fill="red" />
      <Line p1={from()} p2={props.to} stroke="red" />
    </>
  );
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
