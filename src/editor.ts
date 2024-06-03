import { assign, setup } from "xstate";

type Point = [number, number];

export const editorMachine = setup({
  types: {
    context: {} as { current: Point; points: Point[] },
    events: {} as { type: "move"; point: Point } | { type: "click" },
  },
}).createMachine({
  id: "editor",
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
