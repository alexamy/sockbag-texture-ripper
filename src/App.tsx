import { styled } from "@macaron-css/solid";
import cv from "@techstark/opencv-js";
import { createResource, Show, Suspense } from "solid-js";
import { Region } from "./Region";
import { Texture } from "./Texture";
import { Editor } from "./editor/Editor";
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
  const [openCvLoaded] = createResource(() => {
    return new Promise<boolean>((resolve) => {
      function waitParse() {
        if (cv.Mat) {
          resolve(true);
        } else {
          setTimeout(waitParse, 100);
        }
      }

      waitParse();
    });
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppStoreProvider>
        <span style={{ display: "none" }}>{openCvLoaded()}</span>
        <TextureRipper />
      </AppStoreProvider>
    </Suspense>
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

        <RegionBorder onMouseDown={resize.activate} onDblClick={resize.reset}>
          <RegionBorderHandler />
        </RegionBorder>

        <Region
          testId="texture"
          toolbar={<TextureToolbar />}
          width={resize.right()}
          resetTrigger={store.blob}
        >
          <Suspense fallback={<div>Loading...</div>}>
            <Texture />
          </Suspense>
        </Region>
      </Show>

      <Show when={dnd.isDragOver()}>
        <ImageDrop>Drop image here to upload</ImageDrop>
      </Show>
    </Container>
  );
}
