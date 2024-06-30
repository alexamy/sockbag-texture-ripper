/* @refresh reload */
import { render } from "solid-js/web";

import { Root } from "./Root";
import "./index.css";

const root = document.getElementById("root");

render(() => <Root />, root!);
