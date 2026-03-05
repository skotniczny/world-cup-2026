<script lang="ts">
  import { Router, Link, Route } from "svelte5-router"
  import { groupNames } from "./data/groups"
  import Group from "./lib/Group.svelte"
  import Home from "./lib/Home.svelte"
  import Standings from "./lib/Standings.svelte";
  import Knockout from "./lib/Knockout.svelte";

  const basepath = "/world-cup-2026"
</script>
<Router {basepath}>
<nav class="nav">
  <ul>
    <li><Link to="">Home</Link></li>
    {#each groupNames as g}
      <li><Link to="group/{g}">Group {g}</Link></li>
    {/each}
    <li><Link to="standings">Standings</Link></li>
    <li><Link to="knockout">Knockout</Link></li>
  </ul>
</nav>
<main id="main">
  <Route path="" component={Home} />
  <Route path="standings" component={Standings} />
  <Route path="group/:groupName" component={Group} />
  <Route path="knockout" component={Knockout} />
</main>
</Router>

<style>
.nav {
  position: sticky;
  top: 0;
  background: var(--wc-color-natural0);
  border-radius: 0 0 var(--wc-radius) var(--wc-radius);
  box-shadow: var(--wc-shadow);
  z-index: 1;
  text-align: center;
}

.nav ul {
  margin: 0;
  list-style: none;
  padding: 0;
  display: inline-flex;
  gap: var(--wc-space-sm);
  overflow: auto;
  max-width: 100%;
}

.nav ul li :global(a) {
  display: inline-block;
  padding: 0.5rem;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
  transition: border-bottom-color 0.15s ease;
}

.nav ul li :global(a:hover),
.nav ul li :global(a:focus) {
  border-bottom-color: var(--wc-color-accent);
  outline: none;
}

.nav ul li :global(a[aria-current="page"]) {
  border-bottom-color: var(--wc-color-secondary);
}
</style>

