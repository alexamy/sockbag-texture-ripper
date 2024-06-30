import { createResize } from "@/hooks/createResize";
import { style } from "@macaron-css/core";
import { For, JSXElement, createSignal } from "solid-js";

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
  padding: "0.5rem 1rem",
  gridColumn: "1 / -1",
  borderBottom: "2px solid grey",
  fontWeight: "bold",
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

interface Story {
  name: string;
  render: () => JSXElement;
}

const stories = [
  {
    name: "Point",
    render: () => <div>Point</div>,
  },
  {
    name: "Line",
    render: () => <div>Line</div>,
  },
] satisfies Story[];

export function Root() {
  const resize = createResize(20);
  const [selected, setSelected] = createSignal<Story>();

  return (
    <div class={sRoot}>
      <div class={sToolbar}>Stories</div>
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
          onMouseUp={resize.deactivate}
          onDblClick={resize.reset}
        />

        <div class={sStory} style={{ width: `${resize.right()}%` }}>
          {selected()?.render()}
        </div>
      </div>
    </div>
  );
}
