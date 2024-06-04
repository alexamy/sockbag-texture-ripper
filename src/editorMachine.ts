import { assign, setup } from "xstate";

export type Point = { x: number; y: number };
export type Quad = [Point, Point, Point, Point];

type Context = {
  current: Point;
  points: Point[];
  quads: Quad[];
};

export const editorMachine = setup({
  types: {
    context: {} as Context,
    events: {} as { type: "move"; point: Point } | { type: "click" },
  },
  guards: {
    canAddQuad: ({ context }) => context.points.length === 4,
  },
  actions: {
    addNewPoint: assign(({ context }) => {
      return {
        points: [...context.points, context.current],
      };
    }),
    addNewQuad: assign(({ context }) => {
      const [p1, p2, p3, p4] = context.points;
      const quad: Quad = [p1, p2, p3, p4];
      return {
        quads: [...context.quads, quad],
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
    quads: [],
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
        guard: "canAddQuad",
        actions: "addNewQuad",
      },
      on: {
        click: {
          actions: "addNewPoint",
        },
      },
    },
  },
});
