import { assign, setup } from "xstate";

type Point = [number, number];

export const rectanglesMachine = setup({
  types: {
    context: {} as { current: Point; points: Point[] },
    events: {} as { type: "move"; point: Point } | { type: "click" },
  },
}).createMachine({
  id: "rectangles",
  initial: "initial",
  context: {
    points: [],
    current: [0, 0],
  },
  on: {
    click: {
      actions: [
        assign(({ context }) => ({
          points: [...context.points, context.current],
        })),
      ],
    },
    move: {
      actions: [assign(({ event }) => ({ current: event.point }))],
    },
  },
  states: {
    initial: {},
  },
});
