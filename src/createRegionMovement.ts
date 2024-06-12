import { createMemo, createSignal, type JSX } from "solid-js";
import { v } from "./vector";

export function createRegionMovement() {
  const [ref, setRef] = createSignal<HTMLElement>();
  const [active, setActive] = createSignal(false);
  const [current, setCurrent] = createSignal({ x: 0, y: 0 });

  const [translate, setTranslate] = createSignal({ x: 0, y: 0 });
  const [origin, setOrigin] = createSignal({ x: 0, y: 0 });
  const [scale, setScale] = createSignal(2);

  const style = createMemo(() => {
    const move = `translate(${translate().x}px, ${translate().y}px)`;
    const shift = `translate(${origin().x}px, ${origin().y}px)`;
    const zoom = `scale(${scale()})`;

    // TODO add shift
    const transform = `${move} ${zoom}`;

    // TODO uncomment
    const transformOrigin = ""; //`${origin().x}px ${origin().y}px`;

    return {
      transform,
      "transform-origin": transformOrigin,
    } satisfies JSX.CSSProperties;
  });

  // pan
  function onMouseLeave() {
    setActive(false);
  }

  function onMouseMove(event: MouseEvent) {
    const mousePosition = { x: event.clientX, y: event.clientY };
    const rect = ref()!.getBoundingClientRect();
    const position = v.subtract(mousePosition, {
      x: Math.floor(rect.left),
      y: Math.floor(rect.top),
    });
    const scaled = v.map(v.scale(position, 1 / scale()), Math.round);

    if (active()) {
      const delta = v.subtract(mousePosition, current());
      const next = v.add(translate(), delta);
      setTranslate(next);
    }

    setOrigin(scaled);
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

    const next = getScale(event);
    setScale(next);
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
    e.preventDefault();
    if (e.key === " ") {
      setActive(true);
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    e.preventDefault();
    if (e.key === " ") {
      setActive(false);
    }
  }

  // api
  // TODO uncomment
  function resetView() {
    // setScale(1);
    // setOrigin({ x: 0, y: 0 });
    // setTranslate({ x: 0, y: 0 });
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
