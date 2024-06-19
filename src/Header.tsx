import { createSignal } from "solid-js";

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
    <span
      class="app-title"
      title={`${title().text} Texture Ripper`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {title().icon}
    </span>
  );
}
