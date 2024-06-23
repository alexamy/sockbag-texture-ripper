import { Button } from "#/styles";
import { styled } from "@macaron-css/solid";
import { Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";

const Backdrop = styled("div", {
  base: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "black",
    opacity: 0.5,
    zIndex: 9998,
  },
});

const Content = styled("div", {
  base: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 9999,
    background: "white",
    color: "black",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    lineHeight: 1.7,
    textAlign: "justify",
  },
});

export function Help() {
  const [shown, setShown] = createSignal(false);

  return (
    <>
      <Button title="Click to show help" onClick={() => setShown(true)}>
        Help
      </Button>
      <Show when={shown()}>
        <Portal mount={document.body}>
          <Modal close={() => setShown(false)} />
        </Portal>
      </Show>
    </>
  );
}

function Modal(props: { close: () => void }) {
  return (
    <>
      <Backdrop onClick={() => props.close()} />
      <Content>
        <div>
          <p>
            Drag and drop an image onto the app, or use <b>Upload</b> button to
            select a file to upload.
          </p>
          <br />
          <p>
            Click <b>Clear</b> button to reset editor state.
          </p>
          <br />
          <p>
            The <b>left region</b> is the uploaded image:
            <br />
            Draw quads on the image to crop the texture. Press left click to add
            points, right click to remove the last point. Hold space and move
            the mouse to pan the image. Hold space and scroll the mouse wheel to
            zoom in and out.
          </p>
          <br />
          <p>
            The <b>right region</b> is the result texture:
            <br />
            The texture slices will be projected onto the rectangles. Rectangles
            have a width of a top side of the quad (marked by red arrow) and
            height of smaller adjacent side. Press the "Download" button to
            download the texture. Hold space and move the mouse to pan the
            image. Hold space and scroll the mouse wheel to zoom in and out.
          </p>
          <br />
          <Button onClick={() => props.close()}>Close</Button>
        </div>
      </Content>
    </>
  );
}
