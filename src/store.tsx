import {
  JSXElement,
  createContext,
  createEffect,
  on,
  useContext
} from "solid-js";
import { createStore } from "solid-js/store";
import { createImageSource } from './helper';
import { v } from './vector';

export type Point = { x: number; y: number };
export type Quad = [Point, Point, Point, Point];

type Store = ReturnType<typeof createAppStore>;
interface StoreData {
  file: Blob;
  url: string;
  image: HTMLImageElement;
  points: Point[];
  quads: Quad[];
}

// TODO turn prettier on?

// store
function createAppStore() {
  const [store, setStore] = createStore<StoreData>(getDefaultStore());

  // reset state when file changes
  createEffect(on(
    () => store.file,
    () => setStore(store => ({ ...getDefaultStore(), file: store.file }),
  )));

  // load image
  createEffect(on(
    () => store.file,
    async (file) => {
      const url = URL.createObjectURL(file);
      const image = await createImageSource(url);
      setStore({ url, image });
    },
  ));

  // add quad when has 4 points
  createEffect(on(
    () => store.points,
    (points) => {
      if(points.length < 4) return;
      const [p1, p2, p3, p4] = points;
      const quad: Quad = [p1, p2, p3, p4];
      const quads = [...store.quads, quad];
      setStore({ quads, points: [] });
    }
  ));

  function addPoint(point: Point) {
    const isEqualSome = store.points.some((p) => v.equals(p, point));
    const points = isEqualSome ? store.points : [...store.points, point];
    setStore({ points });
  }

  function deleteLastPoint() {
    const points = store.points.slice(0, -1);
    setStore({ points });
  }

  function setFile(file: Blob) {
    setStore({ file });
  }

  const methods = { setFile, addPoint, deleteLastPoint };

  return [store, methods, setStore] as const;
}

function getDefaultStore() {
  return {
    url: "",
    file: new Blob(),
    image: new Image(),
    points: [],
    quads: [],
  } satisfies StoreData;
}

// context
const StoreContext = createContext<Store>(undefined as unknown as Store);

export function useAppStore() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return store;
}

export function AppStoreProvider(props: { children: JSXElement }) {
  const store = createAppStore();

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
}
