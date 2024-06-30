import { createResize } from "@/hooks/createResize";
import { styled } from "@macaron-css/solid";
import { For, createSignal } from "solid-js";
import { Story, stories } from "./stories";

const Container = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    height: "100vh",
  },
});

const Main = styled("div", {
  base: {
    display: "flex",
    width: "100%",
    height: "100vh",
  },
});

const Toolbar = styled("div", {
  base: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "0.5rem 1rem",
    borderBottom: "2px solid grey",
    fontWeight: "bold",
    height: 50,
  },
});

const List = styled("ul", {
  base: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    paddingTop: "1rem",
  },
});

const Link = styled("li", {
  base: {
    padding: "0 1rem",
    cursor: "pointer",
    ":hover": {
      backgroundColor: "grey",
    },
  },
});

const StoryContainer = styled("div", {
  base: {
    padding: "2rem",
    width: "100%",
  },
});

const Left = styled("div", {
  base: {
    minWidth: 200,
  },
});

const Right = styled("div", {
  base: {},
});

const Header = styled("h1", {
  base: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
});

const Button = styled("button", {
  base: {
    padding: 4,
    userSelect: "none",
  },
});

const Separator = styled("div", {
  base: {
    width: 2,
    backgroundColor: "grey",
    cursor: "ew-resize",
  },
});

export function Root() {
  const resize = createResize(15);
  const [selected, setSelected] = createSignal<Story>();

  return (
    <Container>
      <Main>
        <Left style={{ width: `${resize.left()}%` }}>
          <Toolbar>
            <Header>Stories</Header>
          </Toolbar>

          <List>
            <For each={stories}>
              {(story) => (
                <Link onClick={() => setSelected(story)}>{story.name}</Link>
              )}
            </For>
          </List>
        </Left>

        <Separator onMouseDown={resize.activate} onDblClick={resize.reset} />

        <Right style={{ width: `${resize.right()}%` }}>
          <Toolbar />
          <StoryContainer>{selected()?.render()}</StoryContainer>
        </Right>
      </Main>
    </Container>
  );
}
