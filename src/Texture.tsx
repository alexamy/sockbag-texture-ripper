import potpack from 'potpack';
import { For, createEffect, createMemo, createSignal, on } from 'solid-js';
import { Point } from './editorMachine';

export function Texture(props: { blobs: Blob[] }) {
  const urls = createMemo(() => {
    return props.blobs.map((blob) => URL.createObjectURL(blob));
  });

  const refs: HTMLImageElement[] = [];

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

    potpack(sizes);
    sizes.sort((a, b) => a.i - b.i);

    setPositions(sizes);
  }

  function onDownload() {

  }

  return (
    <div>
      <button onClick={onAutoPack}>Autopack</button>
      <button onClick={onDownload}>Download</button>
      <div class="texture">
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
