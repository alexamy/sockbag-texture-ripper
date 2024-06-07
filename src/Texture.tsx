import potpack from "potpack";
import { For, createEffect, createMemo, createSignal, on } from "solid-js";
import { Region } from "./Region";
import { useAppStore } from "./store";

interface PackEntry {
  i: number;
  ref: HTMLImageElement;
  w: number;
  h: number;
  x: number;
  y: number;
}

interface PackSize {
  w: number;
  h: number;
}

// TODO extract logic to store
export function Texture() {
  const [store] = useAppStore();
  const [packs, setPacks] = createSignal<PackEntry[]>([]);
  const [packResult, setPackResult] = createSignal<PackSize>({ w: 0, h: 0 });
  const transforms = createMemo(() => {
    return packs().map(({ x, y }) => `translate(${x}px, ${y}px)`);
  });

  createEffect(on(() => store.quadImages, autopack));

  function autopack() {
    const packs = store.quadImages.map((ref, i) => {
      const width = ref.naturalWidth;
      const height = ref.naturalHeight;
      return { i, ref, w: width, h: height, x: 0, y: 0 };
    });

    const result = potpack(packs);
    setPackResult(result);

    packs.sort((a, b) => a.i - b.i);
    setPacks(packs);
  }

  function onDownload() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = packResult().w;
    canvas.height = packResult().h;

    for (const { ref, x, y } of packs()) {
      ctx.drawImage(ref, x, y);
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
      <button onClick={onDownload} disabled={store.quadUrls.length === 0}>
        Download
      </button>
      <Region>
        <div class="texture">
          <For each={store.quadUrls}>
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
