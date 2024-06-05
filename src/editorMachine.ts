import { assign, setup } from "xstate";
import { v } from "./vector";

export type Point = { x: number; y: number };
export type Quad = [Point, Point, Point, Point];

type Context = {
  points: Point[];
  quads: Quad[];
};

export const editorMachine = setup({
  types: {
    context: {} as Context,
    events: {} as { type: "discard" } | { type: "addPoint"; point: Point },
  },
  guards: {
    canAddQuad: ({ context }) => context.points.length === 4,
    canAddPoint: ({ context }, params: { point: Point }) =>
      context.points.every((p) => !v.equals(p, params.point)),
  },
  actions: {
    addNewPoint: assign(({ context }, params: { point: Point }) => {
      const isEqualSome = context.points.some((p) => v.equals(p, params.point));
      return {
        points: isEqualSome
          ? context.points
          : [...context.points, params.point],
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
    deleteLastPoint: assign(({ context }) => {
      return {
        points: context.points.slice(0, -1),
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
          guard: {
            type: "canAddPoint",
            params: ({ event }) => ({ point: event.point }),
          },
          actions: {
            type: "addNewPoint",
            params: ({ event }) => ({ point: event.point }),
          },
        },
        discard: {
          actions: "deleteLastPoint",
        },
      },
    },
  },
});
