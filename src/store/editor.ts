import { createEffect, on } from "solid-js";
import { createStore } from "solid-js/store";
import { v } from "../vector";

export type EditorStore = ReturnType<typeof createEditorStore>;

export interface Point {
  id: string;
  x: number;
  y: number;
}

export type Quad = [Point, Point, Point, Point];

interface StoreData {
  current: Point;
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
    const points = [...store.points, ...buffer];
    setStore({ quads, points, buffer: [], });
  }));

  function updateCurrent(coordinates: { x: number; y: number }) {
    const point = { ...store.current, ...coordinates };
    setStore({ current: point });
  }

  function updatePoint(id: string) {
    const { x, y } = store.current;
    const points = store.points.map((p) => (p.id === id ? { ...p, x, y } : p));
    setStore({ points });
  }

  function addPoint() {
    const isEqualSome = store.buffer.some((p) => v.equals(p, store.current));
    if (isEqualSome) return;

    const buffer = [...store.buffer, store.current];
    const current = { ...store.current, id: getId() };
    setStore({ buffer, current });
  }

  function deleteLastPoint() {
    const buffer = store.buffer.slice(0, -1);
    setStore({ buffer });
  }

  const methods = { updateCurrent, updatePoint, addPoint, deleteLastPoint };

  return [store, methods, setStore] as const;
}

function getDefaultStore() {
  return {
    current: { x: 0, y: 0, id: "first" },
    points: [],
    buffer: [],
    quads: [],
  } satisfies StoreData;
}

function getId() {
  return Math.random().toString(36).slice(5);
}
