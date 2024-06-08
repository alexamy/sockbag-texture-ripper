import { createEffect, on } from "solid-js";
import { createStore } from "solid-js/store";
import { Point, Quad, v } from "../vector";

export type EditorStore = ReturnType<typeof createEditorStore>;

interface StoreData {
  points: Point[];
  quads: Quad[];
}

export function createEditorStore(file: { blob: Blob }) {
  const [store, setStore] = createStore<StoreData>(getDefaultStore());

  // prettier-ignore
  createEffect(on(() => file.blob, () => {
    setStore(getDefaultStore());
  }));

  // prettier-ignore
  createEffect(on(() => store.points, (points) => {
    if(points.length < 4) return;
    const [p1, p2, p3, p4] = points;
    const quad: Quad = [p1, p2, p3, p4];
    const quads = [...store.quads, quad];
    setStore({ quads, points: [] });
  }));

  function addPoint(point: Point) {
    const isEqualSome = store.points.some((p) => v.equals(p, point));
    if (isEqualSome) return;
    const points = [...store.points, point];
    setStore({ points });
  }

  function deleteLastPoint() {
    const points = store.points.slice(0, -1);
    setStore({ points });
  }

  const methods = { addPoint, deleteLastPoint };

  return [store, methods, setStore] as const;
}

function getDefaultStore() {
  return {
    points: [],
    quads: [],
  } satisfies StoreData;
}
