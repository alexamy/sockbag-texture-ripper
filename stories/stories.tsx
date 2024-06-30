import { Point } from "@/editor/Elements";
import { JSXElement } from "solid-js";
import { Toggler } from "./Toggler";

export interface Story {
  name: string;
  render: () => JSXElement;
}

export const stories = [
  {
    name: "Editor/Point",
    render: () => (
      <svg>
        <Point x={50} y={50} r={8} fill="darkred" />
      </svg>
    ),
  },
  {
    name: "Editor/Line",
    render: () => <div>Line</div>,
  },
  {
    name: "Helper/Toggler",
    render: () => (
      <Toggler header={<div>Toggle</div>}>
        <div>Content</div>
      </Toggler>
    ),
  },
] satisfies Story[];
