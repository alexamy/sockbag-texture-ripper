import { assign, setup } from "xstate";

export type Point = { x: number; y: number };
export type Quad = [Point, Point, Point, Point];

type Context = {
  current: Point;
  points: Point[];
  quadrilaterals: Quad[];
};

export const editorMachine = setup({
  types: {
    context: {} as Context,
    events: {} as { type: "move"; point: Point } | { type: "click" },
  },
  guards: {
    canAddQuadrilateral: ({ context }) => context.points.length === 4,
  },
  actions: {
    addNewPoint: assign(({ context }) => {
      return {
        points: [...context.points, context.current],
      };
    }),
    addNewQuadrilateral: assign(({ context }) => {
      const [p1, p2, p3, p4] = context.points;
      const quad: Quad = [p1, p2, p3, p4];
      return {
        quadrilaterals: [...context.quadrilaterals, quad],
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
    quadrilaterals: [],
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
        guard: "canAddQuadrilateral",
        actions: "addNewQuadrilateral",
      },
      on: {
        click: {
          actions: "addNewPoint",
        },
      },
    },
  },
});
