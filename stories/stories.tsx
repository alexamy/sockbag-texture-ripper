import { Point } from "@/editor/Elements";
import { JSXElement } from "solid-js";
import { Toggler } from "./Toggler";

export interface Story {
  name: string;
  render: () => JSXElement;
}

function PointStory() {
  return (
    <svg>
      <Point x={50} y={50} r={8} fill="darkred" />
    </svg>
  );
}

function TogglerStory() {
  return (
    <Toggler header={<div>Toggle</div>}>
      <div>Content</div>
    </Toggler>
  );
}

export const stories = [
  {
    name: "Editor/Point",
    render: PointStory,
  },
  {
    name: "Editor/Line",
    render: () => <div>Line</div>,
  },
  {
    name: "Helper/Toggler",
    render: TogglerStory,
  },
] satisfies Story[];
