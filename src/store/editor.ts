import { v } from "@/lib/vector";
import { trackStore } from "@solid-primitives/deep";
import { createMemo, on } from "solid-js";
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
    const current = { ...store.current, ...coordinates };
    setStore({ current });
  }

  function addPoint() {
    const isEqualSome = store.buffer.some((p) => v.equals(p, store.current));
    if (isEqualSome) return;

    const buffer = [...store.buffer, store.current];
    const current = { ...store.current, id: getId() };
    setStore({ buffer, current });

    if (buffer.length === 4) {
      const quad = { id: getId(), points: store.buffer.map((p) => p.id) };
      const quads = [...store.quads, quad];
      const points = [...store.points, ...store.buffer];
      setStore({ quads, points, buffer: [] });
    }
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

function quadToPoints(quads: Quad, points: Point[]) {
  const quadPoints = quads.points.map((id) => {
    const point = points.find((p) => p.id === id);
    if (!point) throw new Error("Point not found.");
    return point;
  });

  return quadPoints;
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
