import { styled } from "@macaron-css/solid";
import { vars } from "./theme.ts";

export const Container = styled("div", {
  base: {
    backgroundColor: vars.background,
    color: vars.text,
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
    fontWeight: "bold",
    height: 50,
  },
});

export const List = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

export const Link = styled("li", {
  base: {
    padding: "0.2rem 1rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
    selectors: {
      "&[data-selected=false]:hover": {
        backgroundColor: vars.darkBlue,
      },
    },
  },
  variants: {
    selected: {
      true: {
        backgroundColor: vars.blue,
      },
    },
  },
});

export const StoryContainer = styled("div", {
  base: {
    padding: "0 1rem",
    width: "100%",
    flexGrow: 1,
  },
});

export const Left = styled("div", {
  base: {
    minWidth: 200,
  },
});

export const Right = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    minWidth: 200,
  },
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
    width: 1,
    backgroundColor: vars.gray,
    cursor: "col-resize",
  },
});
