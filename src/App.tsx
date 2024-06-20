import { styled } from "@macaron-css/solid";
import { Show } from "solid-js";
import "./App.css";
import { Editor, EditorToolbar } from "./Editor";
import { Region } from "./Region";
import { Texture, TextureToolbar } from "./Texture";
import { createDnd, createResize } from "./hooks";
import { AppStoreProvider, useAppStore } from "./store";

export default App;

const Container = styled("div", {
  base: {
    display: "flex",
    width: "100%",
    height: "100vh",
  },
});

const RegionBorder = styled("div", {
  base: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
    background: "whitesmoke",
    cursor: "col-resize",
    border: "1px solid lightgrey",
    borderWidth: "0 1px",
  },
});

const RegionBorderHandler = styled("div", {
  base: {
    width: "4px",
    height: "10%",
    minHeight: "30px",
    background: "darkgray",
    outline: "1px solid darkgray",
  },
});

const ImageDrop = styled("div", {
  base: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    zIndex: 99,
    opacity: 0.95,
    backgroundColor: "gray",
    color: "black",
    fontSize: "3rem",
    pointerEvents: "none",
  },
});

function App() {
  return (
    <AppStoreProvider>
      <TextureRipper />
    </AppStoreProvider>
  );
}

function TextureRipper() {
  const [store, { setFile }] = useAppStore().file;
  debugLoadFile().then(setFile);

  const dnd = createDnd(setFile);
  const resize = createResize();

  return (
    <Container
      onDrop={dnd.onDrop}
      onDragEnter={dnd.onDragEnter}
      onDragOver={dnd.onDragOver}
      onDragLeave={dnd.onDragLeave}
      onMouseMove={resize.onMouseMove}
    >
      <Show when={store.blob}>
        <Region
          toolbar={<EditorToolbar />}
          width={resize.left()}
          resetTrigger={store.blob}
        >
          <Editor />
        </Region>

        <RegionBorder
          onMouseDown={resize.activate}
          onMouseUp={resize.deactivate}
          onDblClick={resize.reset}
        >
          <RegionBorderHandler />
        </RegionBorder>

        <Region
          toolbar={<TextureToolbar />}
          width={resize.right()}
          resetTrigger={store.blob}
        >
          <Texture />
        </Region>
      </Show>

      <Show when={dnd.isDragOver()}>
        <ImageDrop>Drop image here to upload</ImageDrop>
      </Show>
    </Container>
  );
}

async function debugLoadFile() {
  // textrip, river, houses, rainbow, grid
  const image = await fetch("http://alexamy.me/pub/grid.png");
  const blob = await image.blob();
  const file = new File([blob], "source");
  return file;
}
