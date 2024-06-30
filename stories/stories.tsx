import { Point } from "@/editor/Elements";
import { styled } from "@macaron-css/solid";
import { JSXElement } from "solid-js";

export interface Story {
  name: string;
  render: () => JSXElement;
}

const Svg = styled("svg", {
  base: {
    width: "100%",
    height: "100%",
  },
});

export const stories = [
  {
    name: "Point",
    render: () => (
      <Svg>
        <Point x={50} y={50} r={8} fill="darkred" />
      </Svg>
    ),
  },
  {
    name: "Line",
    render: () => <div>Line</div>,
  },
] satisfies Story[];
