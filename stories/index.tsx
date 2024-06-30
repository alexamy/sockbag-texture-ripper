/* @refresh reload */
import { render } from "solid-js/web";

import { Root } from "./Root";
import "./index.css";
import { stories } from "./stories";

const root = document.getElementById("root");

render(() => <Root stories={stories} />, root!);
