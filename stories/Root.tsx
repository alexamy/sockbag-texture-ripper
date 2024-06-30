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

const sToolbar = style({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "0.5rem 1rem",
  borderBottom: "2px solid grey",
  fontWeight: "bold",
  height: 50,
});

const sList = style({
  display: "flex",
  flexDirection: "column",
  gap: 8,
  paddingTop: "1rem",
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

const sLeft = style({
  minWidth: 200,
});

const sRight = style({});

const Header = styled("h1", {
  base: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
});

const Button = styled("button", {
  base: {
    padding: 4,
    userSelect: "none",
  },
});

const Separator = styled("div", {
  base: {
    width: 2,
    backgroundColor: "grey",
    cursor: "ew-resize",
  },
});

export function Root() {
  const resize = createResize(15);
  const [selected, setSelected] = createSignal<Story>();

  return (
    <div class={sRoot}>
      <div class={sMain}>
        <div class={sLeft} style={{ width: `${resize.left()}%` }}>
          <div class={sToolbar}>
            <Header>Stories</Header>
          </div>
          <ul class={sList}>
            <For each={stories}>
              {(story) => (
                <li class={sLink} onClick={() => setSelected(story)}>
                  {story.name}
                </li>
              )}
            </For>
          </ul>
        </div>

        <Separator onMouseDown={resize.activate} onDblClick={resize.reset} />

        <div class={sRight} style={{ width: `${resize.right()}%` }}>
          <div class={sToolbar} />
          <div class={sStory}>{selected()?.render()}</div>
        </div>
      </div>
    </div>
  );
}
