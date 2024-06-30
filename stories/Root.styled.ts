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
    padding: "0.5rem 0",
    fontWeight: "bold",
    height: 50,
  },
});

export const List = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "1rem",
  },
});

export const Link = styled("li", {
  base: {
    padding: "0.3rem 1.5rem",
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
    padding: "1rem",
    width: "100%",
    flexGrow: 1,
    overflow: "hidden",
  },
  variants: {
    mode: {
      dark: {
        backgroundColor: vars.background,
        color: vars.text,
      },
      light: {
        backgroundColor: vars.light,
        color: "black",
      },
    },
  },
  defaultVariants: {
    mode: "dark",
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
    fontSize: "1.2rem",
    fontWeight: "bold",
    paddingLeft: "1rem",
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
    backgroundColor: "transparent",
    cursor: "col-resize",
  },
});
