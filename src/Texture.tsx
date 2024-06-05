import potpack from 'potpack';
import { For, createEffect, createMemo, createSignal, on } from 'solid-js';
import { Point } from './editorMachine';

export function Texture(props: { blobs: Blob[] }) {
  const urls = createMemo(() => {
    return props.blobs.map((blob) => URL.createObjectURL(blob));
  });

  const [parent, setParent] = createSignal<HTMLDivElement>();
  const refs: HTMLImageElement[] = [];

  const [packResult, setPackResult] = createSignal<{ w: number, h: number }>();
  const [positions, setPositions] = createSignal<Point[]>([]);
  const transforms = createMemo(() => {
    return positions().map(({ x, y }) => `translate(${x}px, ${y}px)`);
  });

  // add new rects to (0, 0)
  createEffect(
    on(
      () => props.blobs.length,
      () => {
        const initialPositions = props.blobs
          .map(() => ({ x: 0, y: 0 }))
          .slice(positions().length);
        setPositions([...positions(), ...initialPositions]);
      }
    )
  );

  function onAutoPack() {
    const sizes = refs.map((ref, i) => {
      const { width, height } = ref.getBoundingClientRect();
      return { i, w: width, h: height, x: 0, y: 0 };
    });

    setPackResult(potpack(sizes));
    sizes.sort((a, b) => a.i - b.i);

    setPositions(sizes);
  }

  // TODO case when packResult is empty (autopack is not clicked)
  function onDownload() {
    const root = parent()!.getBoundingClientRect();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    canvas.width = packResult()?.w ?? root.width;
    canvas.height = packResult()?.h ?? root.height;

    for(const ref of refs) {
      const { x, y } = ref.getBoundingClientRect();
      ctx.drawImage(ref, x - root.x, y - root.y);
    }

    canvas.toBlob((blob) => {
      if(!blob) throw new Error("Failed to download texture.");
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
      <button onClick={onAutoPack}>Autopack</button>
      <button onClick={onDownload}>Download</button>
      <div ref={setParent} class="texture">
        <For each={urls()}>
          {(url, i) => (
            <img
              ref={refs[i()]}
              class="texture-rect"
              style={{ transform: transforms()[i()] }}
              src={url}
            />
          )}
        </For>
      </div>
    </div>
  );
}
