import { styled } from "@macaron-css/solid";
import { createSignal, Show } from "solid-js";
import { useAppStore } from "../store";
import { DrawingBoard } from "./DrawingBoard";

const Container = styled("div", {
  base: {
    userSelect: "none",
    position: "absolute",
    top: 0,
    left: 0,
    border: "1px solid white",
  },
});

export function Editor() {
  const [ref, setRef] = createSignal<HTMLImageElement>();
  const [store, api] = useAppStore().file;

  return (
    <Container>
      <Show when={api.data()}>
        <ImageBackground src={api.data()!.url} setRef={setRef} />
        <DrawingBoard image={api.data()!.image} background={ref()!} />
      </Show>
    </Container>
  );
}

function ImageBackground(props: {
  src: string;
  setRef: (ref: HTMLImageElement) => void;
}) {
  return <img ref={props.setRef} src={props.src} alt="Uploaded image" />;
}
