import { useAppStore } from "#/store";
import { Button } from "#/styles";

export function Clear() {
  const [_, { clear }] = useAppStore().editor;

  return <Button onClick={clear}>Clear</Button>;
}
