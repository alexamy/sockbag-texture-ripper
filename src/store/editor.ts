import { createEffect, on } from "solid-js";
import { createStore } from "solid-js/store";
import { v } from "../vector";

export type EditorStore = ReturnType<typeof createEditorStore>;

type Id = string;

export interface Point {
  id: Id;
  x: number;
  y: number;
}

export type Figure = Id[];
export type Quad = [Point, Point, Point, Point];

interface StoreData {
  current: Point;
  points: Point[];
  buffer: Point[];
  figures: Figure[];
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
    const figure = [p1.id, p2.id, p3.id, p4.id];
    const figures = [...store.figures, figure];
    const points = [...store.points, ...buffer];
    setStore({ figures, points, buffer: [], });
  }));

  // prettier-ignore
  createEffect(on(() => [store.figures, store.points] as const, ([figures, points]) => {
    const quads = figures.map((figure) => figureToQuad(figure, points));
    setStore({ quads });
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

function figureToQuad(figure: Figure, points: Point[]): Quad {
  const [p1, p2, p3, p4] = figure.map((id) => {
    const point = points.find((p) => p.id === id);
    if (!point) throw new Error("Point not found.");
    return point;
  });

  const quad: Quad = [p1, p2, p3, p4];
  return quad;
}

function getDefaultStore() {
  return {
    current: { x: 0, y: 0, id: "first" },
    points: [],
    buffer: [],
    figures: [],
    quads: [],
  } satisfies StoreData;
}

function getId() {
  return Math.random().toString(36).slice(5);
}
