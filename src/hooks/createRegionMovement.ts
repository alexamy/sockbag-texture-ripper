import { v } from "@/lib/vector";
import { createMemo, createSignal, type JSX } from "solid-js";

export function createRegionMovement() {
  const [ref, setRef] = createSignal<HTMLElement>();
  const [active, setActive] = createSignal(false);
  const [current, setCurrent] = createSignal({ x: 0, y: 0 });

  const [translate, setTranslate] = createSignal({ x: 0, y: 0 });
  const [origin, setOrigin] = createSignal({ x: 0, y: 0 });
  const [scale, setScale] = createSignal(3);

  const style = createMemo(() => {
    const move = `translate(${translate().x}px, ${translate().y}px)`;
    const zoom = `scale(${scale()})`;

    const transform = `${move} ${zoom}`;

    return {
      transform,
    } satisfies JSX.CSSProperties;
  });

  // pan
  function onMouseLeave() {
    setActive(false);
  }

  function onMouseMove(event: MouseEvent) {
    const mousePosition = { x: event.clientX, y: event.clientY };

    if (active()) {
      const delta = v.subtract(mousePosition, current());
      const next = v.add(translate(), delta);
      setTranslate(next);
    }

    setCurrent(mousePosition);
  }

  // zoom
  function onScroll(event: Event) {
    if (!active()) return;
    event.preventDefault();
    event.stopPropagation();
  }

  function onMouseWheel(event: WheelEvent) {
    if (!active()) return;
    event.preventDefault();
    event.stopPropagation();

    const mousePosition = { x: event.clientX, y: event.clientY };

    const prevScale = scale();
    const newScale = getScale(event);
    setScale(newScale);

    const scaleDiff = newScale - prevScale;
    const newTranslate = v.subtract(
      translate(),
      v.scale(v.subtract(mousePosition, translate()), scaleDiff / prevScale)
    );
    setTranslate(newTranslate);
  }

  function getScale(event: WheelEvent) {
    const dy = event.deltaY;
    const amount = Math.min(80, Math.abs(dy));
    const delta = Math.sign(dy) * amount;
    const newScale = scale() * (1 - delta / 800);
    return newScale;
  }

  // activation
  function onKeyDown(e: KeyboardEvent) {
    if (e.key === " ") {
      e.preventDefault();
      setActive(true);
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    if (e.key === " ") {
      e.preventDefault();
      setActive(false);
    }
  }

  // api
  function resetView() {
    setScale(1);
    setOrigin({ x: 0, y: 0 });
    setTranslate({ x: 0, y: 0 });
  }

  // prettier-ignore
  return {
    setRef,
    active,
    current, origin,
    translate, scale, style,
    setActive, resetView,
    onMouseMove, onMouseLeave,
    onMouseWheel, onScroll,
    onKeyDown, onKeyUp,
  };
}
