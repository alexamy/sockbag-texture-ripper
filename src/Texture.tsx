import { For } from "solid-js";
import { Region } from "./Region";
import "./Texture.css";
import { useAppStore } from "./store";
import { TextureStore } from "./store/texture";

export function Texture() {
  const [store] = useAppStore().texture;

  return (
    <div>
      <button
        onClick={() => downloadTexture(store)}
        disabled={store.urls.length === 0}
      >
        Download
      </button>
      <GapInput />
      <Region>
        <div class="texture">
          <For each={store.urls}>
            {(url, i) => (
              <img
                src={url}
                class="texture-rect"
                style={{ transform: store.transform[i()] }}
                onMouseDown={(e) => e.preventDefault()}
              />
            )}
          </For>
        </div>
      </Region>
    </div>
  );
}

function GapInput() {
  const [store, setStore] = useAppStore().texture;

  function onGapChange(e: Event) {
    const gap = parseInt((e.target as HTMLInputElement).value);
    setStore({ gap });
  }

  return (
    <>
      <label for="gap">Gap:</label>
      <input
        id="gap"
        type="number"
        min="0"
        max="999"
        value={store.gap}
        onChange={onGapChange}
      />
    </>
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
