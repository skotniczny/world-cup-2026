import { mount } from "svelte";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import "./app.css";
import App from "./App.svelte";
import { initCompletedMatches } from "./stores/matches.svelte";

polyfillCountryFlagEmojis();
initCompletedMatches();

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
