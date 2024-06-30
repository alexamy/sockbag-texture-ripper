import { createResize } from "@/hooks/createResize";
import { style } from "@macaron-css/core";
import { styled } from "@macaron-css/solid";
import { For, createSignal } from "solid-js";
import { Story, stories } from "./stories";

const sRoot = style({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  height: "100vh",
});

const sMain = style({
  display: "flex",
  width: "100%",
  height: "100vh",
});

const sSeparator = style({
  width: 2,
  backgroundColor: "grey",
  cursor: "ew-resize",
});

const sToolbar = style({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "0.5rem 1rem",
  borderBottom: "2px solid grey",
  fontWeight: "bold",
});

const Header = styled("h1", {
  base: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
});

const Button = styled("button", {
  base: {
    padding: 4,
  },
});

const sList = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  paddingTop: "1rem",
  minWidth: 200,
});

const sLink = style({
  padding: "0 1rem",
  cursor: "pointer",
  ":hover": {
    backgroundColor: "grey",
  },
});

const sStory = style({
  padding: "2rem",
  width: "100%",
});

export function Root() {
  const resize = createResize(20);
  const [selected, setSelected] = createSignal<Story>();

  return (
    <div class={sRoot}>
      <div class={sToolbar}>
        <Header>Stories</Header>
        <Button>Switch background</Button>
      </div>
      <div class={sMain}>
        <ul class={sList} style={{ width: `${resize.left()}%` }}>
          <For each={stories}>
            {(story) => (
              <li class={sLink} onClick={() => setSelected(story)}>
                {story.name}
              </li>
            )}
          </For>
        </ul>

        <div
          class={sSeparator}
          onMouseDown={resize.activate}
          onDblClick={resize.reset}
        />

        <div class={sStory} style={{ width: `${resize.right()}%` }}>
          {selected()?.render()}
        </div>
      </div>
    </div>
  );
}
