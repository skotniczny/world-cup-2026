<script lang="ts">
  import Table from "./Table.svelte"
  import Fixtures from "./Fixtures.svelte"
  import { groupsData, thirdPlaces } from "../stores/groups.svelte"
</script>

<header>
  <h1>2026 FIFA World Cup</h1>
</header>
<div class="home-grid">
  <Fixtures />
  <div class="grid-column">
    {#each Object.values(groupsData) as group}
      <Table name={group.name} table={group.table} />
    {/each}
    <Table name="Third-placed Ranking" table={thirdPlaces.table} thirdPlaces />
  </div>
</div>

<style>
  .home-grid {
    display: grid;
    grid-template-columns: minmax(560px, auto) 1fr;
    gap: var(--wc-space-lg);
  }
</style>
