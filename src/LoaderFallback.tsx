import { createSignal, onCleanup } from "solid-js";

export function LoaderFallback(props: { text?: string }) {
  const [count, setCount] = createSignal(0);
  const intervalId = setInterval(() => setCount((c) => (c + 1) % 4), 300);
  onCleanup(() => clearInterval(intervalId));

  const text = () => (props.text ?? "Loading") + ".".repeat(count());

  return <div style={{ padding: "30px", "font-size": "30px" }}>{text()}</div>;
}
