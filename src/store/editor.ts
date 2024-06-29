import { v } from "#/lib/vector";
import { createEffect, on } from "solid-js";
import { createStore } from "solid-js/store";

export type EditorStore = ReturnType<typeof createEditorStore>;

type PointId = string;
type QuadId = string;

export interface Point {
  id: PointId;
  x: number;
  y: number;
}

export interface Quad {
  id: QuadId;
  points: PointId[];
}

export type QuadPoints = Point[];

interface StoreData {
  current: Point;
  buffer: Point[];
  points: Point[];
  quads: Quad[]; // point ids to make quad from

  // calculated
  currentQuad: QuadPoints;
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
    const quad = { id: getId(), points: [p1.id, p2.id, p3.id, p4.id] };
    const quads = [...store.quads, quad];
    const points = [...store.points, ...buffer];
    setStore({ quads, points, buffer: [], });
  }));

  // calculated
  // prettier-ignore
  createEffect(on(() => [store.buffer, store.current] as const, ([buffer, current]) => {
    const currentQuad = buffer.concat(current);
    setStore({ currentQuad });
  }));

  // prettier-ignore
  createEffect(on(() => [store.quads, store.points] as const, ([links, points]) => {
    const quadPoints = links.map((link) => quadToPoints(link, points));
    setStore({ quadPoints });
  }));

  // methods
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

  function updatePoints(newPoints: Point[]) {
    const points = store.points.map((point) => {
      const newPoint = newPoints.find((p) => p.id === point.id);
      return newPoint || point;
    });
    setStore({ points });
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
    updatePoints,
    addPoint,
    deleteLastPoint,
    clear,
  };

  return [store, methods, setStore] as const;
}

function quadToPoints(quads: Quad, points: Point[]): QuadPoints {
  const [p1, p2, p3, p4] = quads.points.map((id) => {
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
    currentQuad: [],
    quadPoints: [],
  } satisfies StoreData;
}

function getId() {
  return Math.random().toString(36).slice(5);
}
