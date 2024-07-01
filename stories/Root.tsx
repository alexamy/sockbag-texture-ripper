import { createResize } from "@/hooks/createResize";
import { For, createEffect, createMemo, createSignal } from "solid-js";
import {
  Button,
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

  const [background, setBackground] = createSignal<"dark" | "light">("dark");
  function toggleBackground() {
    setBackground(background() === "dark" ? "light" : "dark");
  }

  return (
    <Container class={themeClass}>
      <Left style={{ width: `${resize.left()}%` }}>
        <Toolbar>
          <Header>Stories</Header>
        </Toolbar>

        <List>
          <For each={groups()}>
            {([name, stories]) => (
              <Group
                name={name}
                stories={stories}
                selectStory={setSelected}
                currentStory={selected()}
              />
            )}
          </For>
        </List>
      </Left>

      <Separator onMouseDown={resize.activate} onDblClick={resize.reset} />

      <Right style={{ width: `${resize.right()}%` }}>
        <Toolbar>
          <Button onClick={toggleBackground}>Toggle BG</Button>
        </Toolbar>
        <StoryContainer mode={background()}>
          {selected()?.component()}
        </StoryContainer>
      </Right>
    </Container>
  );
}

function Group(props: {
  name: string;
  stories: Story[];
  selectStory: (name: string) => void;
  currentStory?: Story;
}) {
  return (
    <Toggler header={<div>{props.name}</div>}>
      <For each={props.stories}>
        {(story) => (
          <Link
            onClick={() => props.selectStory(story.name)}
            data-selected={story.name === props.currentStory?.name}
            selected={story.name === props.currentStory?.name}
          >
            {story.name}
          </Link>
        )}
      </For>
    </Toggler>
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
    const { category } = story;
    if (!groups[category]) groups[category] = [];
    groups[category].push(story);
  }

  return groups;
}
