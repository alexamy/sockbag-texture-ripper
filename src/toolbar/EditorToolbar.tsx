import { useRegionContext } from "@/Region";
import { useAppStore } from "@/store";
import { styled } from "@macaron-css/solid";
import { Clear } from "./Clear";
import { Header } from "./Header";
import { Help } from "./Help";
import { Upload } from "./Upload";

const Toolbar = styled("div", {
  base: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "whitesmoke",
    padding: "5px 10px",
    width: "100%",
    whiteSpace: "nowrap",
  },
});

const Buttons = styled("div", {
  base: {
    display: "flex",
    gap: "5px",
  },
});

export function EditorToolbar() {
  const [store, api] = useAppStore().file;
  const width = () => api.image()?.naturalWidth;
  const height = () => api.image()?.naturalHeight;

  // TODO remove
  const move = useRegionContext();

  return (
    <Toolbar>
      <div>
        Size: {width()} x {height()} Current: {move.current().x},{" "}
        {move.current().y} Origin: {move.origin().x}, {move.origin().y}
      </div>
      <Buttons>
        <Clear />
        <Upload />
        <Help />
        <Header />
      </Buttons>
    </Toolbar>
  );
}
