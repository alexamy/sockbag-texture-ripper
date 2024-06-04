import { assign, setup } from "xstate";

export type Point = { x: number; y: number };
export type Rect = [Point, Point, Point, Point];

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
  guards: {
    canAddRectangle: ({ context }) => context.points.length === 4,
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
    current: { x: 0, y: 0 },
    points: [],
    rectangles: [],
  },
  on: {
    move: [
      {
        actions: [assign(({ event }) => ({ current: event.point }))],
      },
    ],
  },
  states: {
    clicking: {
      always: {
        guard: "canAddRectangle",
        actions: "addNewRectangle",
      },
      on: {
        click: {
          actions: "addNewPoint",
        },
      },
    },
  },
});