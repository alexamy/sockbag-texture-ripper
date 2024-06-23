import { v } from "#/lib/vector";
import { createEffect, on } from "solid-js";
import { createStore } from "solid-js/store";

export type EditorStore = ReturnType<typeof createEditorStore>;

type PointId = string;

export interface Point {
  id: PointId;
  x: number;
  y: number;
}

export type Quad = PointId[];
export type QuadPoints = [Point, Point, Point, Point];

interface StoreData {
  current: Point;
  buffer: Point[];
  points: Point[];
  quads: Quad[]; // point ids to make quad from
  quadPoints: QuadPoints[];
}

// TODO implement point drag
// currently new points are created each time,
// so event listener won't work
// needed to implement stable points

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
    const link = [p1.id, p2.id, p3.id, p4.id];
    const quads = [...store.quads, link];
    const points = [...store.points, ...buffer];
    setStore({ quads, points, buffer: [], });
  }));

  // prettier-ignore
  createEffect(on(() => [store.quads, store.points] as const, ([links, points]) => {
    const quadPoints = links.map((link) => quadToPoints(link, points));
    setStore({ quadPoints });
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

  function clear() {
    setStore(getDefaultStore());
  }

  const methods = {
    updateCurrent,
    updatePoint,
    addPoint,
    deleteLastPoint,
    clear,
  };

  return [store, methods, setStore] as const;
}

function quadToPoints(quads: Quad, points: Point[]): QuadPoints {
  const [p1, p2, p3, p4] = quads.map((id) => {
    const point = points.find((p) => p.id === id);
    if (!point) throw new Error("Point not found.");
    return point;
  });

  const quad: QuadPoints = [p1, p2, p3, p4];
  return quad;
}

function getDefaultStore() {
  return {
    current: { x: 0, y: 0, id: getId() },
    points: [],
    buffer: [],
    quads: [],
    quadPoints: [],
  } satisfies StoreData;
}

function getId() {
  return Math.random().toString(36).slice(5);
}
