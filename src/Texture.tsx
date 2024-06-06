import potpack from "potpack";
import { For, createEffect, createMemo, createSignal } from "solid-js";
import { Region } from "./Region";
import { Point } from "./editorMachine";

export function Texture(props: { blobs: Blob[] }) {
  const refs: HTMLImageElement[] = [];
  const [parent, setParent] = createSignal<HTMLDivElement>();

  const [packResult, setPackResult] = createSignal<{ w: number; h: number }>();
  const [positions, setPositions] = createSignal<Point[]>([]);
  const imgTransforms = createMemo(() => {
    return positions().map(({ x, y }) => `translate(${x}px, ${y}px)`);
  });

  const urls = createMemo(() => {
    return props.blobs.map((blob) => URL.createObjectURL(blob));
  });

  const markLoad = createLoadWatcher(autopack);

  function autopack() {
    const sizes = refs.map((ref, i) => {
      const width = ref.naturalWidth;
      const height = ref.naturalHeight;

      return { i, w: width, h: height, x: 0, y: 0 };
    });

    const result = potpack(sizes);
    setPackResult(result);

    sizes.sort((a, b) => a.i - b.i);
    setPositions(sizes);
  }

  function onDownload() {
    const root = parent()!.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = packResult()?.w ?? root.width;
    canvas.height = packResult()?.h ?? root.height;

    for (const ref of refs) {
      // TODO handle case with transform properly
      const { x, y } = ref.getBoundingClientRect();
      ctx.drawImage(ref, x, y);
    }

    canvas.toBlob((blob) => {
      if (!blob) throw new Error("Failed to download texture.");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "texture.png";
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div>
      <button onClick={onDownload}>Download</button>
      <Region>
        <div ref={setParent} class="texture">
          <For each={urls()}>
            {(url, i) => (
              <img
                ref={refs[i()]}
                src={url}
                class="texture-rect"
                style={{ transform: imgTransforms()[i()] }}
                onMouseDown={(e) => e.preventDefault()}
                onLoadStart={() => markLoad(i(), false)}
                onLoad={() => markLoad(i(), true)}
              />
            )}
          </For>
        </div>
      </Region>
    </div>
  );
}

// We need to wait for all images to load before we can measure and pack them.
function createLoadWatcher(f: () => void) {
  const [loaded, setLoaded] = createSignal<boolean[]>([]);
  const allLoaded = createMemo(
    () => loaded().every((l) => l) && loaded().length
  );

  function markLoad(i: number, value: boolean) {
    const newLoaded = [...loaded()];
    newLoaded[i] = value;
    setLoaded(newLoaded);
  }

  createEffect(() => {
    if (allLoaded()) f();
  });

  return markLoad;
}
