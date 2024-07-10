import { useAppStore } from "@/store";
import { Button } from "@/styles";
import { createSignal } from "solid-js";

export function Upload() {
  const { setFile } = useAppStore();
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
