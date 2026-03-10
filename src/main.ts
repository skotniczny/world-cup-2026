import { mount } from "svelte";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import "./app.css";
import App from "./App.svelte";
import { initGroupStandings } from "./stores/matches.svelte";

polyfillCountryFlagEmojis();
initGroupStandings();

const app = mount(App, {
  target: document.getElementById("app")!,
});

export default app;
