import { style } from "@macaron-css/core";

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
});

const sToolbar = style({
  padding: "0.5rem 1rem",
  gridColumn: "1 / -1",
  borderBottom: "2px solid grey",
  fontWeight: "bold",
});

const sList = style({
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
  return (
    <div class={sRoot}>
      <div class={sToolbar}>Stories</div>
      <div class={sMain}>
        <ul class={sList}>
          <li class={sLink}>Item 1</li>
          <li class={sLink}>Item 2</li>
          <li class={sLink}>Item 3</li>
        </ul>
        <div class={sSeparator} />
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
    </div>
  );
}
