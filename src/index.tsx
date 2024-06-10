/* @refresh reload */
import { render } from "solid-js/web";

import { Loader } from "./Loader";
import "./index.css";

const root = document.getElementById("root");

render(() => <Loader />, root!);
