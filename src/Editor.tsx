import { fromActorRef } from "@xstate/solid";
import { createMemo, For, Show } from "solid-js";
import { ActorRefFrom } from "xstate";
import { editorMachine, type Point, type Rect } from "./editorMachine";

export function Editor(props: {
  imageRect: DOMRect;
  initialEditor: ActorRefFrom<typeof editorMachine>;
}) {
  const state = fromActorRef(props.initialEditor);
  const send = props.initialEditor.send;

  const current = createMemo(() => state().context.current);
  const rectangles = createMemo(() => state().context.rectangles);
  const points = createMemo(() => state().context.points);

  const first = createMemo(() => points()[0]);
  const last = createMemo(() => points()[points().length - 1]);

  const viewBox = createMemo(() => {
    const rect = props.imageRect;
    return [0, 0, rect.width, rect.height].join(" ");
  });

  function onMouseMove(e: MouseEvent) {
    const rect = props.imageRect;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    send({ type: "move", point: { x, y } });
  }

  function onClick() {
    send({ type: "click" });
  }

  return (
    <svg
      class="svg-canvas"
      viewBox={viewBox()}
      onClick={onClick}
      onMouseMove={onMouseMove}
    >
      <For each={rectangles()}>{(rect) => <Rect rect={rect} />}</For>
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

function Point(props: { p: Point }) {
  return <circle cx={props.p.x} cy={props.p.y} r="4" fill="white" />;
}

function Line(props: { p1: Point; p2: Point }) {
  return (
    <line
      x1={props.p1.x}
      y1={props.p1.y}
      x2={props.p2.x}
      y2={props.p2.y}
      stroke="white"
      stroke-width="2"
    />
  );
}

function Rect(props: { rect: Rect }) {
  return (
    <>
      <polygon
        points={props.rect.map((point) => `${point.x},${point.y}`).join(" ")}
        fill="white"
        fill-opacity={0.3}
        stroke="white"
        stroke-width="2"
      />
      <For each={props.rect}>{(point) => <Point p={point} />}</For>
    </>
  );
}
