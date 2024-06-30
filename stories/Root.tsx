import { createResize } from "@/hooks/createResize";
import { For, createEffect, createMemo, createSignal } from "solid-js";
import {
  Container,
  Header,
  Left,
  Link,
  List,
  Right,
  Separator,
  StoryContainer,
  Toolbar,
  themeClass,
} from "./Root.styled.ts";
import { Story } from "./stories";

export function Root(props: { stories: Story[] }) {
  const resize = createResize(15);
  const [selected, setSelected] = createSelectStory(() => props.stories);

  return (
    <Container class={themeClass}>
      <Left style={{ width: `${resize.left()}%` }}>
        <Toolbar>
          <Header>Stories</Header>
        </Toolbar>

        <List>
          <For each={props.stories}>
            {(story) => (
              <Link
                onClick={() => setSelected(story.name)}
                data-selected={story === selected()}
                selected={story === selected()}
              >
                {story.name}
              </Link>
            )}
          </For>
        </List>
      </Left>

      <Separator onMouseDown={resize.activate} onDblClick={resize.reset} />

      <Right style={{ width: `${resize.right()}%` }}>
        <Toolbar />
        <StoryContainer>{selected()?.render()}</StoryContainer>
      </Right>
    </Container>
  );
}

function createSelectStory(stories: () => Story[]) {
  const [selected, setSelected] = createSignal("");
  const story = createMemo(() => {
    return stories().find((s) => s.name === selected());
  });

  const name = localStorage.getItem("selected");
  if (name) setSelected(name);

  createEffect(() => {
    localStorage.setItem("selected", selected());
  });

  return [story, setSelected] as const;
}
