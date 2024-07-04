import { styled } from "@macaron-css/solid";
import { For, createMemo } from "solid-js";
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
  const [data] = useAppStore().computed;
  const transforms = createMemo(
    () => data()?.packs.map(({ x, y }) => `translate(${x}px, ${y}px)`) ?? []
  );

  return (
    <Container>
      <For each={data()?.urls}>
        {(url, i) => (
          <TextureRect
            src={url}
            style={{ transform: transforms()[i()] }}
            onMouseDown={(e) => e.preventDefault()}
          />
        )}
      </For>
    </Container>
  );
}
