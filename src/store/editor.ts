import { v } from "@/lib/vector";
import { trackStore } from "@solid-primitives/deep";
import { createEffect, createMemo, on } from "solid-js";
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
  quads: Quad[];
}

export function createEditorStore() {
  const [store, setStore] = createStore<StoreData>(getDefaultStore());

  // prettier-ignore
  createEffect(on(() => store.buffer, (buffer) => {
    if(buffer.length < 4) return;
    const [p1, p2, p3, p4] = buffer;
    const quad = { id: getId(), points: [p1.id, p2.id, p3.id, p4.id] };
    const quads = [...store.quads, quad];
    const points = [...store.points, ...buffer];
    setStore({ quads, points, buffer: [], });
  }));

  const currentQuad = createMemo(() => store.buffer.concat(store.current));
  const quadPoints = createMemo(
    on(
      () => [store.quads, trackStore(store.points)] as const,
      ([quads, points]) => {
        const quadPoints = quads.map((quad) => quadToPoints(quad, points));
        return quadPoints;
      }
    )
  );

  // methods
  function updateCurrent(coordinates: { x: number; y: number }) {
    const point = { ...store.current, ...coordinates };
    setStore({ current: point });
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

  const api = {
    currentQuad,
    quadPoints,
    updateCurrent,
    addPoint,
    deleteLastPoint,
    clear,
  };

  return [store, api, setStore] as const;
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
  } satisfies StoreData;
}

function getId() {
  return Math.random().toString(36).slice(5);
}
