import { createEffect, on } from "solid-js";
import { createStore } from "solid-js/store";
import { v } from "../vector";

export type EditorStore = ReturnType<typeof createEditorStore>;

interface Point {
  id: string;
  x: number;
  y: number;
}

type Quad = [Point, Point, Point, Point];

interface StoreData {
  points: Point[];
  buffer: Point[];
  quads: Quad[];
}

export function createEditorStore(file: { blob: Blob }) {
  const [store, setStore] = createStore<StoreData>(getDefaultStore());

  // prettier-ignore
  createEffect(on(() => file.blob, () => {
    setStore(getDefaultStore());
  }));

  // prettier-ignore
  createEffect(on(() => store.buffer, (buffer) => {
    if(buffer.length < 4) return;
    const [p1, p2, p3, p4] = buffer;
    const quad: Quad = [p1, p2, p3, p4];
    const quads = [...store.quads, quad];
    setStore({ quads, buffer: [], });
  }));

  function addPoint(raw: { x: number; y: number }) {
    const isEqualSome = store.buffer.some((p) => v.equals(p, raw));
    if (isEqualSome) return;

    const point = { ...raw, id: getId() };
    const buffer = [...store.buffer, point];
    setStore({ buffer });
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
    buffer: [],
    quads: [],
  } satisfies StoreData;
}

function getId() {
  return Math.random().toString(36).slice(5);
}
