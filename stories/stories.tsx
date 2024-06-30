import { JSXElement } from "solid-js";

export interface Story {
  name: string;
  render: () => JSXElement;
}

export const stories = [
  {
    name: "Point",
    render: () => <div>Point</div>,
  },
  {
    name: "Line",
    render: () => <div>Line</div>,
  },
] satisfies Story[];
