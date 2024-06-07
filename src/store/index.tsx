import { JSXElement, createContext, useContext } from "solid-js";
import { Store, createAppStore } from "./app";

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
