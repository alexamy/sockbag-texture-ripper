import { Suspense, createSignal, lazy, onCleanup } from "solid-js";

export function Loader() {
  const App = lazy(() => import("./App"));

  return (
    <Suspense fallback={<Fallback />}>
      <App />
    </Suspense>
  );
}

function Fallback() {
  const [count, setCount] = createSignal(0);
  const label = () => `Loading.${".".repeat(count())}`;

  const intervalId = setInterval(() => setCount((c) => c + 1), 700);
  onCleanup(() => clearInterval(intervalId));

  return <div style={{ padding: "30px", "font-size": "30px" }}>{label()}</div>;
}
