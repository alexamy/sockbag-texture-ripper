import { For, createMemo } from "solid-js";
import { Region } from "./Region";
import { useAppStore } from "./store";
import { createTextureStore } from "./store/texture";

export function Texture() {
  const [store] = useAppStore();
  const [texture] = createTextureStore(
    () => store.image,
    () => store.quads
  );

  const transforms = createMemo(() => {
    return texture.packs.map(({ x, y }) => `translate(${x}px, ${y}px)`);
  });

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

  return (
    <div>
      <button onClick={onDownload} disabled={texture.urls.length === 0}>
        Download
      </button>
      <Region>
        <div class="texture">
          <For each={texture.urls}>
            {(url, i) => (
              <img
                src={url}
                class="texture-rect"
                style={{ transform: transforms()[i()] }}
                onMouseDown={(e) => e.preventDefault()}
              />
            )}
          </For>
        </div>
      </Region>
    </div>
  );
}
