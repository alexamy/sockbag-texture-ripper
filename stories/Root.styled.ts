import { styled } from "@macaron-css/solid";

export const Container = styled("div", {
  base: {
    display: "flex",
    width: "100%",
    height: "100vh",
  },
});

export const Toolbar = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0.5rem 1rem",
    borderBottom: "2px solid grey",
    fontWeight: "bold",
    height: 50,
  },
});

export const List = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingTop: "1rem",
  },
});

export const Link = styled("li", {
  base: {
    padding: "0 1rem",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "grey",
    },
  },
});

export const StoryContainer = styled("div", {
  base: {
    padding: "2rem",
    width: "100%",
  },
});

export const Left = styled("div", {
  base: {
    minWidth: 200,
  },
});

export const Right = styled("div", {
  base: {},
});

export const Header = styled("h1", {
  base: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
});

export const Button = styled("button", {
  base: {
    padding: 4,
    userSelect: "none",
  },
});

export const Separator = styled("div", {
  base: {
    width: 2,
    backgroundColor: "grey",
    cursor: "ew-resize",
  },
});
