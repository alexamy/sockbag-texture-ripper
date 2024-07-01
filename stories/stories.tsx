import { Point } from "@/editor/Elements";
import { JSXElement } from "solid-js";
import { Toggler } from "./Toggler";

export interface Story {
  category: string;
  name: string;
  component: () => JSXElement;
}

export const stories = [
  {
    category: "Editor",
    name: "Point",
    component: PointStory,
  },
  {
    category: "Editor",
    name: "Line",
    component: () => <div>Line</div>,
  },
  {
    category: "Helper",
    name: "Toggler",
    component: TogglerStory,
  },
] satisfies Story[];

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
