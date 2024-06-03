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
  actions: {
    addNewPoint: assign(({ context }) => {
      return {
        points: [...context.points, context.current],
      };
    }),
    addNewRectangle: assign(({ context }) => {
      const [p1, p2, p3, p4] = context.points;
      const rectangle: Rect = [p1, p2, p3, p4];
      return {
        rectangles: [...context.rectangles, rectangle],
        points: [],
      };
    }),
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
        actions: "addNewRectangle",
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
          actions: ["addNewPoint"],
        },
      },
    },
  },
});
