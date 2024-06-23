import { v } from "#/vector";
import { createEffect, on } from "solid-js";
import { createStore } from "solid-js/store";

export type EditorStore = ReturnType<typeof createEditorStore>;

type Id = string;

export interface Point {
  id: Id;
  x: number;
  y: number;
}

export type QuadLink = Id[];
export type Quad = [Point, Point, Point, Point];

interface StoreData {
  current: Point;
  points: Point[];
  buffer: Point[];
  quadLinks: QuadLink[]; // point ids to make quad from
  quads: Quad[];
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
    const quadLinks = [...store.quadLinks, link];
    const points = [...store.points, ...buffer];
    setStore({ quadLinks, points, buffer: [], });
  }));

  // prettier-ignore
  createEffect(on(() => [store.quadLinks, store.points] as const, ([links, points]) => {
    const quads = links.map((link) => linksToQuad(link, points));
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

function linksToQuad(links: QuadLink, points: Point[]): Quad {
  const [p1, p2, p3, p4] = links.map((id) => {
    const point = points.find((p) => p.id === id);
    if (!point) throw new Error("Point not found.");
    return point;
  });

  const quad: Quad = [p1, p2, p3, p4];
  return quad;
}

function getDefaultStore() {
  return {
    current: { x: 0, y: 0, id: getId() },
    points: [],
    buffer: [],
    quadLinks: [],
    quads: [],
  } satisfies StoreData;
}

function getId() {
  return Math.random().toString(36).slice(5);
}
