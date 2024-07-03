import { v } from "@/lib/vector";
import { trackStore } from "@solid-primitives/deep";
import { createMemo, on } from "solid-js";
import { createStore } from "solid-js/store";

export type EditorStore = ReturnType<typeof createEditorStore>;

export interface Point {
  x: number;
  y: number;
}

export interface PointId {
  id: string;
  x: number;
  y: number;
}

export interface Quad {
  id: string;
  points: string[];
}

export type QuadPoints = PointId[];

interface StoreData {
  current: Point;
  buffer: Point[];
  points: PointId[];
  quads: Quad[];
}

export function createEditorStore() {
  const [store, setStore] = createStore<StoreData>(getDefaultStore());

  const currentQuad = createMemo(() => store.buffer.concat(store.current));
  const quadPoints = createMemo(
    on(
      () => [store.quads, trackStore(store.points)] as const,
      ([quads, points]) => quads.map((quad) => quadToPoints(quad, points))
    )
  );

  // methods
  function setCurrent(point: { x: number; y: number }) {
    setStore({ current: point });
  }

  function addPoint() {
    const isEqualSome = store.buffer.some((p) => v.equals(p, store.current));
    if (isEqualSome) return;

    const buffer = [...store.buffer, store.current];

    if (buffer.length === 4) {
      const newPoints: PointId[] = buffer.map((p) => ({ ...p, id: getId() }));
      const quad = { id: getId(), points: newPoints.map((p) => p.id) };
      const points = [...store.points, ...newPoints];
      const quads = [...store.quads, quad];
      setStore({ points, quads, buffer: [] });
    } else {
      setStore({ buffer });
    }
  }

  function deleteLastPoint() {
    const buffer = store.buffer.slice(0, -1);
    setStore({ buffer });
  }

  function reset() {
    setStore(getDefaultStore());
  }

  const api = {
    currentQuad,
    quadPoints,
    setCurrent,
    addPoint,
    deleteLastPoint,
    reset,
  };

  return [store, api, setStore] as const;
}

function quadToPoints(quads: Quad, points: PointId[]) {
  const quadPoints = quads.points.map((id) => {
    const point = points.find((p) => p.id === id);
    if (!point) throw new Error("Point not found.");
    return point;
  });

  return quadPoints;
}

function getDefaultStore() {
  return {
    current: { x: 0, y: 0 },
    points: [],
    buffer: [],
    quads: [],
  } satisfies StoreData;
}

function getId() {
  return Math.random().toString(36).slice(5);
}
