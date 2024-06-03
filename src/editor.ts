import { assign, setup } from "xstate";

type Point = [number, number];
type Rect = [Point, Point, Point, Point];

type Context = {
  current: Point;
  points: Point[];
  rectangles: Rect[];
};

export const editorMachine = setup({
  types: {
    context: {} as Context,
    events: {} as { type: "move"; point: Point } | { type: "click" },
  },
}).createMachine({
  id: "editor",
  initial: "clicking",
  context: {
    rectangles: [],
    points: [],
    current: [0, 0],
  },
  on: {
    move: [
      {
        guard: ({ context }) => context.points.length === 4,
        target: ".addRect",
      },
      {
        actions: [assign(({ event }) => ({ current: event.point }))],
      },
    ],
  },
  states: {
    clicking: {
      on: {
        click: {
          actions: [
            assign(({ context }) => ({
              points: [...context.points, context.current],
            })),
          ],
        },
      },
    },
    addRect: {
      always: {
        target: "clicking",
        actions: assign(({ context }) => ({
          rectangles: [
            ...context.rectangles,
            [
              context.points[0],
              context.points[1],
              context.points[2],
              context.points[3],
            ],
          ],
          points: [],
        })),
      },
    },
  },
});
