import { styled } from "@macaron-css/solid";
import { For } from "solid-js";
import { useAppStore } from "./store";
import { TextureStore } from "./store/texture";
import { Button } from "./styles";

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

const Toolbar = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "whitesmoke",
    width: "100%",
    padding: "5px",
    whiteSpace: "nowrap",
  },
});

const GapInputElement = styled("input", {
  base: {
    padding: "4px",
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

export function TextureToolbar() {
  const [store] = useAppStore().texture;

  return (
    <Toolbar>
      <GapInput />
      <Button
        onClick={() => downloadTexture(store)}
        disabled={store.urls.length === 0}
      >
        Download
      </Button>
    </Toolbar>
  );
}

function GapInput() {
  const [store, setStore] = useAppStore().texture;

  function onGapChange(e: Event) {
    const gap = parseInt((e.target as HTMLInputElement).value);
    setStore({ gap });
  }

  return (
    <div>
      <label for="gap">Gap: </label>
      <GapInputElement
        id="gap"
        type="number"
        min="0"
        max="999"
        value={store.gap}
        onChange={onGapChange}
      />
    </div>
  );
}

function downloadTexture(store: TextureStore[0]) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = store.dimensions.w;
  canvas.height = store.dimensions.h;

  for (const { image, x, y } of store.packs) {
    ctx.drawImage(image, x, y);
  }

  canvas.toBlob((blob) => {
    if (!blob) throw new Error("Failed to download texture.");
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "texture.png";
    a.click();
    URL.revokeObjectURL(url);
  });
}
