import { styled } from "@macaron-css/solid";
import { Show } from "solid-js";
import { Editor } from "./Editor";
import { Region } from "./Region";
import { Texture } from "./Texture";
import { createDnd } from "./hooks/createDnd";
import { createResize } from "./hooks/createResize";
import { AppStoreProvider, useAppStore } from "./store";
import { EditorToolbar } from "./toolbar/EditorToolbar";
import { TextureToolbar } from "./toolbar/TextureToolbar";

// default export because of lazy loading in <Loader>
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
          testId="editor"
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
          testId="texture"
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
