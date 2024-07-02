import { JSXElement } from "solid-js";
import editorStories from "./editor/stories";
import libStories from "./lib/stories";

export interface Story {
  name: string;
  component: () => JSXElement;
  displayName?: string;
  description?: string;
  options?: {
    background?: "dark" | "light";
  };
}

export const stories = [...editorStories, ...libStories] satisfies Story[];
