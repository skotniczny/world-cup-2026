<script lang="ts">
  import Table from "../lib/Table.svelte"
  import Fixtures from "../lib/Fixtures.svelte"
  import { groupsData, thirdPlaces } from "../stores/groups.svelte"
</script>

<h1>2026 FIFA World Cup</h1>
<div class="home-grid">
  <Fixtures />
  <div class="grid-column">
    {#each Object.values(groupsData) as group (group.name)}
      <Table name={group.name} table={group.table} hasUnresolvedTies={group.hasUnresolvedTies} />
    {/each}
    <Table
      name="Third-placed Ranking"
      table={thirdPlaces.table}
      hasUnresolvedTies={thirdPlaces.hasUnresolvedTies}
      thirdPlaces
    />
  </div>
</div>

<style>
  .home-grid {
    display: grid;
    grid-template-columns: var(--wc-home-columns);
    gap: var(--wc-space-lg);
  }
</style>
