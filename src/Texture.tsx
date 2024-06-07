import potpack from "potpack";
import { For, createEffect, createMemo, createSignal, on } from "solid-js";
import { createStore } from "solid-js/store";
import { Region } from "./Region";
import { createImageSource } from "./helper";
import { projectRectangles } from "./projection";
import { Quad, useAppStore } from "./store";

interface PackEntry {
  i: number;
  image: HTMLImageElement;
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
  const [texture] = createTextureStore(
    () => store.image,
    () => store.quads
  );
  const [packs, setPacks] = createSignal<PackEntry[]>([]);
  const [packResult, setPackResult] = createSignal<PackSize>({ w: 0, h: 0 });
  const transforms = createMemo(() => {
    return packs().map(({ x, y }) => `translate(${x}px, ${y}px)`);
  });

  createEffect(on(() => texture.images, autopack));

  function autopack() {
    const packs = texture.images.map((image, i) => {
      const width = image.naturalWidth;
      const height = image.naturalHeight;
      return { i, image, w: width, h: height, x: 0, y: 0 };
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

    for (const { image, x, y } of packs()) {
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

function createTextureStore(
  image: () => HTMLImageElement,
  quads: () => Quad[]
) {
  const [store, setStore] = createStore<{
    rects: Blob[];
    urls: string[];
    images: HTMLImageElement[];
  }>({
    rects: [],
    urls: [],
    images: [],
  });

  // reset
  createEffect(on(image, () => setStore({ rects: [], urls: [], images: [] })));

  // project rectangles
  createEffect(
    on([image, quads] as const, async ([image, quads]) => {
      if (image.width === 0 || quads.length === 0) return;

      const rects = await projectRectangles(image, quads);
      setStore({ rects });
    })
  );

  // create urls and images for projected rectangles
  createEffect(
    on(
      () => store.rects,
      async (projected) => {
        const urls = projected.map((blob) => URL.createObjectURL(blob));
        const images = await Promise.all(urls.map(createImageSource));
        setStore({ urls, images });
      }
    )
  );

  return [store, setStore] as const;
}
