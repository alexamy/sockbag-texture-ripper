import potpack from "potpack";
import { For, createEffect, createMemo, on } from "solid-js";
import { createStore } from "solid-js/store";
import { Region } from "./Region";
import { createImageSource } from "./helper";
import { projectRectangles } from "./projection";
import { Quad, useAppStore } from "./store";

interface PackEntry {
  image: HTMLImageElement;
  i: number;
  w: number;
  h: number;
  x: number;
  y: number;
}

interface PackSize {
  w: number;
  h: number;
}

interface StoreData {
  rects: Blob[];
  urls: string[];
  images: HTMLImageElement[];
  packs: PackEntry[];
  dimensions: PackSize;
}

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

function createTextureStore(
  image: () => HTMLImageElement,
  quads: () => Quad[]
) {
  const [store, setStore] = createStore<StoreData>({
    rects: [],
    urls: [],
    images: [],
    packs: [],
    dimensions: { w: 0, h: 0 },
  });

  // prettier-ignore
  createEffect(
    on(image, () => {
      setStore({ rects: [], urls: [], images: [] })
    })
  );

  // prettier-ignore
  createEffect(
    on([image, quads] as const, async ([image, quads]) => {
      if (image.width === 0 || quads.length === 0) return;
      const rects = await projectRectangles(image, quads);
      setStore({ rects });
    })
  );

  // prettier-ignore
  createEffect(
    on(() => store.rects, async (rects) => {
      const { urls, images } = await makeImages(rects);
      setStore({ urls, images });
    })
  );

  // prettier-ignore
  createEffect(
    on(() => store.images, (images) => {
      const { packs, dimensions } = autopack(images);
      setStore({ packs, dimensions });
    })
  );

  return [store, setStore] as const;
}

async function makeImages(blobs: Blob[]) {
  const urls = blobs.map((blob) => URL.createObjectURL(blob));
  const images = await Promise.all(urls.map(createImageSource));
  return { urls, images };
}

function autopack(images: HTMLImageElement[]) {
  const packs = images.map((image, i) => {
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    return { i, image, w: width, h: height, x: 0, y: 0 };
  });

  const dimensions = potpack(packs);
  packs.sort((a, b) => a.i - b.i);

  return { packs, dimensions };
}
