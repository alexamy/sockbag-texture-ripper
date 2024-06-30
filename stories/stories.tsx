import { Point } from "@/editor/Elements";
import { JSXElement } from "solid-js";

export interface Story {
  name: string;
  render: () => JSXElement;
}

export const stories = [
  {
    name: "Point",
    render: () => (
      <svg>
        <Point x={50} y={50} r={8} fill="darkred" />
      </svg>
    ),
  },
  {
    name: "Line",
    render: () => <div>Line</div>,
  },
] satisfies Story[];
