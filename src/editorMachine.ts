import { assign, setup } from "xstate";

export type Point = { x: number; y: number };
export type Quad = [Point, Point, Point, Point];

type Context = {
  points: Point[];
  quads: Quad[];
};

export const editorMachine = setup({
  types: {
    context: {} as Context,
    events: {} as { type: "addPoint"; point: Point },
  },
  guards: {
    canAddQuad: ({ context }) => context.points.length === 4,
  },
  actions: {
    addNewPoint: assign(({ context }, params: { point: Point }) => {
      return {
        points: [...context.points, params.point],
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
    points: [],
    quads: [],
  },
  states: {
    clicking: {
      always: {
        guard: "canAddQuad",
        actions: "addNewQuad",
      },
      on: {
        addPoint: {
          actions: {
            type: "addNewPoint",
            params: ({ event }) => ({ point: event.point }),
          },
        },
      },
    },
  },
});
