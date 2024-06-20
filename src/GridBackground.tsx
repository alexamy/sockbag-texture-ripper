import { styled } from "@macaron-css/solid";
import { createMemo } from "solid-js";

const Container = styled("svg", {
  base: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export function GridBackground(props: {
  width: number;
  height: number;
  scale: number;
}) {
  const size = createMemo(() => {
    const factor = 1 / props.scale;
    return {
      width: Math.round(props.width * factor),
      height: Math.round(props.height * factor),
    };
  });

  return (
    <Container
      xmlns="http://www.w3.org/2000/svg"
      style={{
        "transform-origin": "0 0",
        transform: `scale(${props.scale})`,
        width: `${size().width}px`,
        height: `${size().height}px`,
      }}
    >
      <rect width="100%" height="100%" fill="url(#checkerboard)" />
      <pattern
        id="checkerboard"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <rect width="11" height="11" fill="#eeeeee" />
        <rect x="10" width="11" height="11" fill="#ffffff" />
        <rect y="10" width="11" height="11" fill="#ffffff" />
        <rect x="10" y="10" width="11" height="11" fill="#eeeeee" />
      </pattern>
    </Container>
  );
}
