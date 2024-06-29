import { v } from "#/lib/vector";
import { useAppStore } from "#/store";
import { Point as PointId, QuadPoints } from "#/store/editor";
import { For, Show, createEffect, createMemo, createSignal } from "solid-js";

type Point = { x: number; y: number };

export function QuadDrawn(props: { quad: QuadPoints }) {}

export function Quad(props: { quad: QuadPoints }) {
  const [_, { updatePoints }] = useAppStore().editor;
  const [highlighted, setHighlighted] = createSignal(false);
  const [dragging, setDragging] = createSignal(false);

  const [points, setPoints] = createSignal<PointId[]>([]);
  createEffect(() => setPoints(props.quad));

  const top = createMemo(() => v.average(points().slice(0, 2)));
  const center = createMemo(() => v.average(points()));

  const [mousePosition, setMousePosition] = createSignal<Point>({ x: 0, y: 0 });
  const polygonPoints = createMemo(() =>
    points()
      .map((point) => `${point.x},${point.y}`)
      .join(" ")
  );

  function onMouseDown(event: MouseEvent) {
    event.stopPropagation();
    setDragging(true);
    setMousePosition({ x: event.clientX, y: event.clientY });
  }

  function onMouseMove(event: MouseEvent) {
    if (!dragging()) return;
    event.stopPropagation();
    const newPosition = { x: event.clientX, y: event.clientY };
    const delta = v.subtract(newPosition, mousePosition());
    setPoints((points) =>
      points.map((p) => ({ id: p.id, ...v.add(p, delta) }))
    );
    setMousePosition(newPosition);
  }

  function onMouseUp() {
    updatePoints(points());
    setDragging(false);
  }

  return (
    <>
      <Line from={center()} to={top()} withTip={true} color="red" />
      <polygon
        points={polygonPoints()}
        stroke="greenyellow"
        stroke-width="1"
        fill="greenyellow"
        fill-opacity={highlighted() ? 0.6 : 0.2}
        style={{ cursor: highlighted() ? "pointer" : "default" }}
        onMouseEnter={() => setHighlighted(true)}
        onMouseLeave={() => setHighlighted(false)}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
      <For each={points()}>{(point) => <DragPoint p={point} />}</For>
    </>
  );
}

export function Line(props: {
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

function DragPoint(props: { p: PointId }) {
  return <circle cx={props.p.x} cy={props.p.y} r={2} fill="black" />;
}
