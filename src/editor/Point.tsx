import { createDrag } from "@/hooks/createDrag";
import { styled } from "@macaron-css/solid";
import { createSignal } from "solid-js";

const Circle = styled("circle", {
  base: {},
  variants: {
    fallthrough: {
      true: {
        pointerEvents: "none",
      },
    },
  },
});

export function Point(props: {
  x: number;
  y: number;
  draggable?: boolean;
  update?: (coords: { dx: number; dy: number }) => void;
}) {
  const [ref, setRef] = createSignal<SVGCircleElement>();
  const [dragging, onMouseDown] = createDrag(ref, (coords) => {
    if (props.draggable) {
      props.update?.(coords);
    }
  });

  return (
    <>
      <Circle
        ref={setRef}
        onMouseDown={onMouseDown}
        onClick={(e) => e.stopPropagation()}
        cx={props.x}
        cy={props.y}
        r={8}
        fill="transparent"
      />
      <Circle
        onClick={(e) => e.stopPropagation()}
        fallthrough={true}
        cx={props.x}
        cy={props.y}
        r={2}
        fill="black"
      />
    </>
  );
}
