import { createImageSource } from "@/lib/helper";
import { projectRectangles } from "@/lib/projection";
import potpack from "potpack";
import { createEffect, on } from "solid-js";
import { createStore } from "solid-js/store";
import { QuadPoints } from "./editor";

export type TextureStore = ReturnType<typeof createTextureStore>;

interface StoreData {
  rects: Blob[];
  urls: string[];
  images: HTMLImageElement[];
  packs: PackEntry[];
  dimensions: PackDimensions;
  transform: string[];
  gap: number;
}

interface PackEntry {
  image: HTMLImageElement;
  i: number;
  w: number;
  h: number;
  x: number;
  y: number;
}

interface PackDimensions {
  w: number;
  h: number;
  fill: number;
}

export function createTextureStore(
  file: { image: HTMLImageElement },
  editor: { quadPoints: QuadPoints[] }
) {
  const [store, setStore] = createStore<StoreData>(getDefaultStore());
  let projectTimeout: NodeJS.Timeout;

  // prettier-ignore
  createEffect(
    on(() => file.image, () => {
      setStore({ ...getDefaultStore(), gap: store.gap });
    })
  );

  // prettier-ignore
  createEffect(
    on(() => [file.image, editor.quadPoints] as const, async ([image, quads]) => {
      if (image.width === 0 || quads.length === 0) return;

      // possibly there is a bug with slow opencv loading (or my own bug in the app logic)
      // which causes the "cv2.Mat is not a constructor" error
      // when projecting texture from image stored in local storage on app load
      // so we need to try to project the texture repeatedly until opencv is working
      async function project() {
        try {
          const rects = await projectRectangles(image, quads);
          setStore({ rects });
        } catch {
          projectTimeout = setTimeout(project, 300);
        }
      }

      if(projectTimeout) clearTimeout(projectTimeout);
      project();
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
    on(() => [store.images, store.gap] as const, ([images, gap]) => {
      const { packs, dimensions } = autopack(images, gap);
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

function autopack(images: HTMLImageElement[], gap = 0) {
  const packs = images.map((image, i) => ({
    i,
    image,
    w: image.naturalWidth + gap,
    h: image.naturalHeight + gap,
    x: 0,
    y: 0,
  }));

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
    dimensions: { w: 0, h: 0, fill: 0 },
    gap: 0,
  } satisfies StoreData;
}
