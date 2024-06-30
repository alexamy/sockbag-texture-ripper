import { styled } from "@macaron-css/solid";
import { JSXElement, createSignal } from "solid-js";
import { vars } from "./theme";

const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

const Header = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
    padding: "0.2rem",
  },
});

const Child = styled("div", {
  base: {
    display: "none",
  },
  variants: {
    open: {
      true: {
        display: "block",
      },
    },
  },
});

const Icon = styled("div", {
  base: {
    marginRight: 10,
    width: 0,
    height: 0,
    borderLeft: "5px solid",
    borderTop: "5px solid transparent",
    borderBottom: "5px solid transparent",
    borderLeftColor: vars.text,
    transition: "transform 0.2s",
  },
  variants: {
    state: {
      closed: {
        transform: "rotate(0deg)",
      },
      opened: {
        transform: "rotate(90deg)",
      },
    },
  },
});

export function Toggler(props: {
  header: JSXElement;
  children: JSXElement;
  initialOpen?: boolean;
}) {
  const [open, setOpen] = createSignal(props.initialOpen ?? true);
  const state = () => (open() ? "opened" : "closed");

  return (
    <Container>
      <Header onClick={() => setOpen((open) => !open)}>
        <Icon state={state()} />
        {props.header}
      </Header>
      <Child open={open()}>{props.children}</Child>
    </Container>
  );
}
