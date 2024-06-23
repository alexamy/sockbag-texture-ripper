import { styled } from "@macaron-css/solid";
import { For } from "solid-js";
import { useAppStore } from "./store";

const Container = styled("div", {
  base: {
    position: "relative",
  },
});

const TextureRect = styled("img", {
  base: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

export function Texture() {
  const [store] = useAppStore().texture;

  return (
    <Container>
      <For each={store.urls}>
        {(url, i) => (
          <TextureRect
            src={url}
            style={{ transform: store.transform[i()] }}
            onMouseDown={(e) => e.preventDefault()}
          />
        )}
      </For>
    </Container>
  );
}
