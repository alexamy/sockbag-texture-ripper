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
  const [store, api] = useAppStore().file;

  // image reference is pointing at the same img element,
  // but we must retrigger each time the image is loaded
  const [imageRef, setImageRef] = createSignal<HTMLImageElement | undefined>(
    undefined,
    { equals: false }
  );

  return (
    <Container>
      <ImageBackground src={api.url()} onLoadRef={setImageRef} />
      <Show when={imageRef()}>
        <DrawingBoard imageRef={imageRef()!} />
      </Show>
    </Container>
  );
}

function ImageBackground(props: {
  src: string;
  onLoadRef: (ref: HTMLImageElement) => void;
}) {
  function onLoad(e: Event) {
    const image = e.target as HTMLImageElement;
    props.onLoadRef(image);
  }

  return <img src={props.src} alt="Uploaded image" onLoad={onLoad} />;
}
