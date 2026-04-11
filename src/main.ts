import { mount } from "svelte";
import { polyfillCountryFlagEmojis } from "country-flag-emoji-polyfill";
import "./app.css";
import App from "./App.svelte";
import { initGroupStandings, loadResultsFromStorage } from "./stores/matches.svelte";

polyfillCountryFlagEmojis();
initGroupStandings();
loadResultsFromStorage();

const target = document.getElementById("app");
if (!target) throw new Error("Mount target not found");

const app = mount(App, {
  target,
});

export default app;
