import { v } from "@/lib/vector";
import { QuadPoints } from "@/store/editor";
import { Show, createMemo } from "solid-js";

export function Quad(props: { points: QuadPoints }) {
  const top = createMemo(() => v.average(props.points.slice(0, 2)));
  const center = createMemo(() => v.average(props.points));
  const polygonPoints = createMemo(() => {
    return props.points.map((point) => `${point.x},${point.y}`).join(" ");
  });

  return (
    <>
      <polygon
        points={polygonPoints()}
        stroke="greenyellow"
        stroke-width="1"
        fill="greenyellow"
        fill-opacity={0.2}
      />
      <Show when={props.points.length > 2}>
        <ArrowLine from={center()} to={top()} color="red" />
      </Show>
    </>
  );
}

function ArrowLine(props: {
  from: { x: number; y: number };
  to: { x: number; y: number };
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
      <polygon points={tip()} fill={color()} />
    </>
  );
}
