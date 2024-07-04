import { Suspense, lazy } from "solid-js";
import { LoaderFallback } from "./LoaderFallback";

export function Loader() {
  const App = lazy(() => import("./App"));

  return (
    <Suspense fallback={<LoaderFallback text="Loading app" />}>
      <App />
    </Suspense>
  );
}
