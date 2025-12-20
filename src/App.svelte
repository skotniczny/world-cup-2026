<script lang="ts">
  import Group from "./lib/Group.svelte"
  import { Router, Link, Route } from "svelte5-router"
  import Home from "./lib/Home.svelte"

  let url:string = $state("")
  let basepath:string = $state("/world-cup-2026")
</script>
<Router {url} {basepath}>
<nav class="nav">
  <ul>
    <li><Link to="{basepath}/">Home</Link></li>
    <li><Link to="{basepath}/group/A">Grupa A</Link></li>
    <li><Link to="{basepath}/group/B">Grupa B</Link></li>
    <li><Link to="{basepath}/group/C">Grupa C</Link></li>
    <li><Link to="{basepath}/group/D">Grupa D</Link></li>
    <li><Link to="{basepath}/group/E">Grupa E</Link></li>
    <li><Link to="{basepath}/group/F">Grupa F</Link></li>
    <li><Link to="{basepath}/group/G">Grupa G</Link></li>
    <li><Link to="{basepath}/group/H">Grupa H</Link></li>
    <li><Link to="{basepath}/group/I">Grupa I</Link></li>
    <li><Link to="{basepath}/group/J">Grupa J</Link></li>
    <li><Link to="{basepath}/group/K">Grupa K</Link></li>
    <li><Link to="{basepath}/group/L">Grupa L</Link></li>
  </ul>
</nav>
<main id="main">
  <Route path="/" component={Home} />
  <Route path="/group/:groupName" component={Group} />
</main>
</Router>

