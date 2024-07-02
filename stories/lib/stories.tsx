import { Toggler } from "../Toggler";
import type { Story } from "../stories";

const stories = [
  {
    name: "Lib/Toggler",
    component: TogglerStory,
  },
] satisfies Story[];

export default stories;

function TogglerStory() {
  return (
    <Toggler header={<div>Toggle</div>}>
      <div>Content</div>
    </Toggler>
  );
}
