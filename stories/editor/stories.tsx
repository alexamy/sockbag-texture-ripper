import { Point } from "@/editor/Point";
import { Quad } from "@/editor/Quad";
import { styled } from "@macaron-css/solid";
import { createSignal } from "solid-js";
import type { Story } from "../stories";

const stories = [
  {
    name: "Editor/Point",
    component: PointStory,
    description: "A point of the quad.",
    options: {
      background: "light",
    },
  },
  {
    name: "Editor/Quad",
    component: QuadStory,
    description: "The completed quad.",
  },
  {
    name: "Editor/Multiple Quads",
    component: MultipleQuadsStory,
    description: "Multiple quads.",
  },
] satisfies Story[];

export default stories;

const Svg = styled("svg", {
  base: {
    width: "100%",
    height: "100%",
    display: "block",
  },
});

function PointStory() {
  return (
    <Svg>
      <Point x={50} y={50} />
    </Svg>
  );
}

function QuadStory() {
  const points = [
    { id: "", x: 10, y: 10 },
    { id: "", x: 150, y: 20 },
    { id: "", x: 200, y: 130 },
    { id: "", x: 20, y: 150 },
  ];

  return (
    <Svg>
      <Quad points={points} />
    </Svg>
  );
}

function MultipleQuadsStory() {
  const [points1, setPoints1] = createSignal([
    { id: "", x: 10, y: 10 },
    { id: "", x: 150, y: 20 },
    { id: "", x: 200, y: 130 },
    { id: "", x: 20, y: 150 },
  ]);

  const [points2, setPoints2] = createSignal([
    { id: "", x: 50, y: 50 },
    { id: "", x: 150, y: 60 },
    { id: "", x: 200, y: 170 },
    { id: "", x: 20, y: 190 },
  ]);

  return (
    <Svg>
      <Quad points={points1()} />
      <Quad points={points2()} />
    </Svg>
  );
}
