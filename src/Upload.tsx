import { createSignal } from "solid-js";
import { Button } from "./styles";

export function Upload() {
  const [input, setInput] = createSignal<HTMLInputElement>();

  function show() {
    input()?.click();
  }

  function upload() {
    const file = input()?.files?.[0];
    if (file) {
      console.log(file);
    }
  }

  return (
    <>
      <Button onClick={show}>Upload</Button>
      <input
        ref={setInput}
        type="file"
        accept="image/*"
        hidden
        onChange={upload}
      />
    </>
  );
}
