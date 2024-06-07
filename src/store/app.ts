import { createEffect, on } from "solid-js";
import { createStore } from "solid-js/store";
import { createImageSource } from "../helper";
import { Point, Quad, v } from "../vector";

export type AppStore = ReturnType<typeof createAppStore>;

interface StoreData {
  file: Blob;
  url: string;
  image: HTMLImageElement;
  points: Point[];
  quads: Quad[];
}

// store
export function createAppStore() {
  const [store, setStore] = createStore<StoreData>(getDefaultStore());

  // TODO extract methods

  // reset state when file changes
  // prettier-ignore
  createEffect(on(
    () => store.file,
    () => setStore(store => ({ ...getDefaultStore(), file: store.file }),
  )));

  // load image
  // prettier-ignore
  createEffect(on(
    () => store.file,
    async (file) => {
      const url = URL.createObjectURL(file);
      const image = await createImageSource(url);
      setStore({ url, image });
    },
  ));

  // add quad when has 4 points
  // prettier-ignore
  createEffect(on(
    () => store.points,
    (points) => {
      if(points.length < 4) return;
      const [p1, p2, p3, p4] = points;
      const quad: Quad = [p1, p2, p3, p4];
      const quads = [...store.quads, quad];
      setStore({ quads, points: [] });
    }
  ));

  function addPoint(point: Point) {
    const isEqualSome = store.points.some((p) => v.equals(p, point));
    const points = isEqualSome ? store.points : [...store.points, point];
    setStore({ points });
  }

  function deleteLastPoint() {
    const points = store.points.slice(0, -1);
    setStore({ points });
  }

  function setFile(file: Blob) {
    setStore({ file });
  }

  const methods = { setFile, addPoint, deleteLastPoint };

  return [store, methods, setStore] as const;
}

function getDefaultStore() {
  return {
    url: "",
    file: new Blob(),
    image: new Image(),
    points: [],
    quads: [],
  } satisfies StoreData;
}
