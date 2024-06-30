import { Point } from "@/editor/Elements";
import { styled } from "@macaron-css/solid";
import { JSXElement } from "solid-js";

export interface Story {
  name: string;
  render: () => JSXElement;
}

const Svg = styled("svg", {
  base: {
    border: "1px solid grey",
  },
});

export const stories = [
  {
    name: "Point",
    render: () => (
      <Svg width={200} height={200}>
        <Point x={50} y={50} r={8} fill="darkred" />
      </Svg>
    ),
  },
  {
    name: "Line",
    render: () => <div>Line</div>,
  },
] satisfies Story[];
