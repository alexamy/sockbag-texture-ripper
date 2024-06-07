import potpack from "potpack";
import { createEffect, on } from "solid-js";
import { createStore } from "solid-js/store";
import { createImageSource } from "../helper";
import { projectRectangles } from "../projection";
import { Quad } from "../vector";

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
  transform: string[];
}

export type TextureStore = ReturnType<typeof createTextureStore>;

export function createTextureStore(
  image: () => HTMLImageElement,
  quads: () => Quad[]
) {
  const [store, setStore] = createStore<StoreData>(getDefaultStore());

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

  // prettier-ignore
  createEffect(
    on(() => store.packs, (packs) => {
      const transform = packs.map(({ x, y }) => `translate(${x}px, ${y}px)`);
      setStore({ transform });
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

function getDefaultStore() {
  return {
    rects: [],
    urls: [],
    images: [],
    packs: [],
    transform: [],
    dimensions: { w: 0, h: 0 },
  } satisfies StoreData;
}
