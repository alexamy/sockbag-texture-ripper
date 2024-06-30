import { Point } from "@/editor/Elements";
import { JSXElement } from "solid-js";
import { Toggler } from "./Toggler";

export interface Story {
  name: string;
  displayName?: string;
  component: () => JSXElement;
}

export const stories = [
  {
    name: "Editor/Point",
    component: PointStory,
  },
  {
    name: "Editor/Line",
    component: () => <div>Line</div>,
  },
  {
    name: "Helper/Toggler",
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
