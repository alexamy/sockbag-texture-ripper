import { styled } from "@macaron-css/solid";
import { JSXElement, createSignal } from "solid-js";

const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
  },
});

const Header = styled("div", {
  base: {
    cursor: "pointer",
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

export function Toggler(props: {
  header: JSXElement;
  children: JSXElement;
  initialOpen?: boolean;
}) {
  const [open, setOpen] = createSignal(props.initialOpen ?? true);

  return (
    <Container>
      <Header onClick={() => setOpen((open) => !open)}>{props.header}</Header>
      <Child open={open()}>{props.children}</Child>
    </Container>
  );
}
