import { useAppStore } from "@/store";
import { PackDimensions, PackEntry } from "@/store/computed";
import { Button } from "@/styles";
import { styled } from "@macaron-css/solid";
import { Show } from "solid-js";

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

const Warning = styled("div", {
  base: {
    fontStyle: "italic",
  },
});

export function TextureToolbar() {
  const [data, isLoading] = useAppStore().computed;

  return (
    <Toolbar>
      <GapInput />
      <Button
        disabled={data()?.urls.length === 0}
        onClick={() => {
          if (!data()) return;
          downloadTexture(data()!.packs, data()!.dimensions);
        }}
      >
        Download
      </Button>
      <Show when={isLoading()}>
        <Warning>Projecting...</Warning>
      </Show>
    </Toolbar>
  );
}

function GapInput() {
  const [store, { setGap }] = useAppStore().texture;

  function onGapChange(e: Event) {
    const gap = parseInt((e.target as HTMLInputElement).value);
    setGap(gap);
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

function downloadTexture(packs: PackEntry[], dimensions: PackDimensions) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  canvas.width = dimensions.w;
  canvas.height = dimensions.h;

  for (const { image, x, y } of packs) {
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
