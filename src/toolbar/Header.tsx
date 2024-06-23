import { styled } from "@macaron-css/solid";
import { createSignal } from "solid-js";

const Title = styled("span", {
  base: {
    fontSize: "1.2rem",
    userSelect: "none",
    width: "fit-content",
  },
});

export function Header() {
  const titles = [
    { icon: "🧦👜", text: "Sockbag" },
    { icon: "👜👜", text: "Bagbag" },
    { icon: "🧦🧦", text: "Socksock" },
    { icon: "👜🧦", text: "Bagsock" },
  ];

  const [title, setTitle] = createSignal(titles[0]);

  function onMouseEnter() {
    const idx = Math.floor(Math.random() * titles.length);
    const title = titles[idx];
    setTitle(title);
  }

  function onMouseLeave() {
    setTitle(titles[0]);
  }

  return (
    <Title
      title={`${title().text} Texture Ripper`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {title().icon}
    </Title>
  );
}
