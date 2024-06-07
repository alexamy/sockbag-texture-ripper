import {
  JSXElement,
  createContext,
  createEffect,
  on,
  useContext
} from "solid-js";
import { createStore } from "solid-js/store";
import { projectRectangles } from "./projection";
import { v } from './vector';

export type Point = { x: number; y: number };
export type Quad = [Point, Point, Point, Point];

type Store = ReturnType<typeof createAppStore>;
interface StoreData {
  file: Blob;
  url: string;
  image: HTMLImageElement;
  projected: Blob[];
  points: Point[];
  quads: Quad[];
}

// store
function createAppStore() {
  const [store, setStore] = createStore<StoreData>(getDefaultStore());

  // load image
  createEffect(on(
    () => store.file,
    (file) => {
      const url = URL.createObjectURL(file);
      createImageSource(url).then((image) => {
        setStore({ url, image });
      }
    );
  }));

  // project rectangles
  createEffect(on(
    () => [store.image, store.quads] as const,
    ([image, quads]) => {
      if(image.width === 0 || quads.length === 0) return;
      projectRectangles(image, quads).then((projected) => {
        setStore({ projected });
      }
    );
  }));

  // reset editor when file changes
  createEffect(on(
    () => store.file,
    () => setStore({ quads: [], points: [] })
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

  const methods = { addPoint, deleteLastPoint, setFile };

  return [store, methods, setStore] as const;
}

function createImageSource(url: string) {
  const image = new Image();
  image.src = url;
  return new Promise<HTMLImageElement>((resolve) => {
    image.onload = () => resolve(image);
  });
}

function getDefaultStore() {
  return {
    url: "",
    file: new Blob(),
    image: new Image(),
    points: [],
    quads: [],
    projected: [],
  };
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
