<script lang="ts">
  import Group from "./lib/Group.svelte"
  import { Router, Link, Route } from "svelte5-router"
  import Home from "./lib/Home.svelte"

  export let url = ""
</script>

<Router {url}>
<nav class="nav">
  <ul>
    <li><Link to="/">Home</Link></li>
    <li><Link to="/group/A">Grupa A</Link></li>
    <li><Link to="/group/B">Grupa B</Link></li>
    <li><Link to="/group/C">Grupa C</Link></li>
    <li><Link to="/group/D">Grupa D</Link></li>
    <li><Link to="/group/E">Grupa E</Link></li>
    <li><Link to="/group/F">Grupa F</Link></li>
    <li><Link to="/group/G">Grupa G</Link></li>
    <li><Link to="/group/H">Grupa H</Link></li>
    <li><Link to="/group/I">Grupa I</Link></li>
    <li><Link to="/group/J">Grupa J</Link></li>
    <li><Link to="/group/K">Grupa K</Link></li>
    <li><Link to="/group/L">Grupa L</Link></li>
  </ul>
</nav>
<main id="main">
  <Route path="/" component={Home} />
  <Route path="/group/:groupName" component={Group} />
</main>
</Router>

