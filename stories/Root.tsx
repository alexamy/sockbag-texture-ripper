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
} from "./Root.styled.ts";
import { Toggler } from "./Toggler.tsx";
import { Story } from "./stories";
import { themeClass } from "./theme.ts";

export function Root(props: { stories: Story[] }) {
  const resize = createResize(15);
  const groups = createMemo(() => Object.entries(groupStories(props.stories)));
  const [selected, setSelected] = createSelectStory(() => props.stories);

  return (
    <Container class={themeClass}>
      <Left style={{ width: `${resize.left()}%` }}>
        <Toolbar>
          <Header>Stories</Header>
        </Toolbar>

        <List>
          <For each={groups()}>
            {([name, stories]) => (
              <Toggler header={<div>{name}</div>}>
                <For each={stories}>
                  {(story) => (
                    <Link
                      onClick={() => setSelected(story.name)}
                      data-selected={story.name === selected()!.name}
                      selected={story.name === selected()!.name}
                    >
                      {story.displayName}
                    </Link>
                  )}
                </For>
              </Toggler>
            )}
          </For>
        </List>
      </Left>

      <Separator onMouseDown={resize.activate} onDblClick={resize.reset} />

      <Right style={{ width: `${resize.right()}%` }}>
        <Toolbar />
        <StoryContainer>{selected()?.component()}</StoryContainer>
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

function groupStories(stories: Story[]) {
  const groups: Record<string, Story[]> = {};

  for (const story of stories) {
    const [group, displayName] = story.name.split("/");
    if (!groups[group]) groups[group] = [];
    groups[group].push({ ...story, displayName });
  }

  return groups;
}
