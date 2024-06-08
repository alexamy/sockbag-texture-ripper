import { JSXElement, createContext, useContext } from "solid-js";
import { MainStore, createMainStore } from "./main";

const StoreContext = createContext<MainStore>(
  undefined as unknown as MainStore
);

export function useAppStore() {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return store;
}

export function AppStoreProvider(props: { children: JSXElement }) {
  const store = createMainStore();

  return (
    <StoreContext.Provider value={store}>
      {props.children}
    </StoreContext.Provider>
  );
}
