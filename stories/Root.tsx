import { style } from "@macaron-css/core";

const sRoot = style({
  display: "grid",
  gridTemplateColumns: "200px 1fr",
  gridTemplateRows: "20 1fr",
  width: "100%",
  height: "100vh",
});

const sToolbar = style({
  padding: "0.5rem 1rem",
  gridColumn: "1 / -1",
  borderBottom: "2px solid grey",
  fontWeight: "bold",
});

const sList = style({
  padding: "1rem",
  minWidth: 200,
  borderRight: "2px solid grey",
});

const sLink = style({
  cursor: "pointer",
});

const sStory = style({
  padding: "1rem",
  width: "100%",
});

export function Root() {
  return (
    <div class={sRoot}>
      <div class={sToolbar}>Stories</div>
      <ul class={sList}>
        <li class={sLink}>Item 1</li>
        <li class={sLink}>Item 2</li>
        <li class={sLink}>Item 3</li>
      </ul>
      <div class={sStory}>
        <div
          style={{
            "background-color": "green",
            width: "200px",
            height: "200px",
          }}
        />
      </div>
    </div>
  );
}
