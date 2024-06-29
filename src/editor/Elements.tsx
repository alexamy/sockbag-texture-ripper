import { v } from "#/lib/vector";
import { Point as PointId, QuadPoints } from "#/store/editor";
import { Show, createEffect, createMemo, createSignal } from "solid-js";

type Point = { x: number; y: number };

export function Quad(props: { quad: QuadPoints }) {
  const [highlighted, setHighlighted] = createSignal(false);

  const [points, setPoints] = createSignal<PointId[]>([]);
  createEffect(() => setPoints(props.quad));

  const top = createMemo(() => v.average(points().slice(0, 2)));
  const center = createMemo(() => v.average(points()));

  const polygonPoints = createMemo(() => {
    return points()
      .map((point) => `${point.x},${point.y}`)
      .join(" ");
  });

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
      />
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
