import { createSignal } from "solid-js";
import { useAppStore } from "../store";
import { Button } from "../styles";

export function Upload() {
  const [_, { setFile }] = useAppStore().file;
  const [input, setInput] = createSignal<HTMLInputElement>();

  function show() {
    input()?.click();
  }

  function upload() {
    const file = input()?.files?.[0];
    if (file) {
      setFile(file);
    }
  }

  return (
    <>
      <Button onClick={show}>Upload</Button>
      <input
        ref={setInput}
        hidden
        type="file"
        accept="image/*"
        onChange={upload}
      />
    </>
  );
}
