import { For } from "solid-js";
import { Region } from "./Region";
import { useAppStore } from "./store";

export function Texture() {
  const { texture: textureStore } = useAppStore();
  const [texture, setStore] = textureStore;

  // TODO move in separate component when texture will be part of store
  function onDownload() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = texture.dimensions.w;
    canvas.height = texture.dimensions.h;

    for (const { image, x, y } of texture.packs) {
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

  // TODO extract gap to separate component
  function onGapChange(e: Event) {
    const gap = parseInt((e.target as HTMLInputElement).value);
    setStore({ gap });
  }

  return (
    <div>
      <button onClick={onDownload} disabled={texture.urls.length === 0}>
        Download
      </button>
      <label for="gap">Gap:</label>
      <input
        id="gap"
        type="number"
        min="0"
        max="999"
        value={texture.gap}
        onChange={onGapChange}
      />
      <Region>
        <div class="texture">
          <For each={texture.urls}>
            {(url, i) => (
              <img
                src={url}
                class="texture-rect"
                style={{ transform: texture.transform[i()] }}
                onMouseDown={(e) => e.preventDefault()}
              />
            )}
          </For>
        </div>
      </Region>
    </div>
  );
}
