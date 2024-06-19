import { Show, createSignal } from "solid-js";
import { Portal } from "solid-js/web";
import "./Help.css";

export function Help() {
  const [shown, setShown] = createSignal(false);

  return (
    <>
      <span
        class="help"
        title="Click to show help"
        onClick={() => setShown(true)}
      >
        ❓
      </span>
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
      <div class="modal-backdrop" onClick={() => props.close()} />
      <div class="modal-content">
        <div class="modal-body">
          <p>Drag and drop an image onto the app to upload.</p>
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
          <button class="modal-button" onClick={() => props.close()}>
            Close
          </button>
        </div>
      </div>
    </>
  );
}
