<script lang="ts">
  import Match from "./Match.svelte"
  import Table from "./Table.svelte"
  import { 
    groupsData,
    matchesData,
    sortMatchesByDatetime,
    sortMatchesByGroup
  } from "../stores.svelte"

  let sort: string = $state("date")

  function sortMatches() {
    if (sort === "date") sortMatchesByDatetime()
    if (sort === "group") sortMatchesByGroup()
  }
</script>

<header>
  <h1>2026 FIFA World Cup</h1>
</header>
<div class="home-grid">
  <div>
    <div class="text-right">
      <select class="select-ctrl mb-sm" bind:value={sort} onchange={sortMatches}>
        <option value="date">Date</option>
        <option value="group">Group</option>
      </select>
    </div>
    <div class="matches-list">
      {#key sort}
        {#each matchesData as item}
          <Match match={item} />
        {/each}
      {/key}
    </div>
  </div>

  <div class="grid-column">
    {#each Object.values(groupsData) as group}
      <Table name={group.name} table={group.table} />
    {/each}
  </div>
</div>

<style>
  .home-grid {
    display: grid;
    grid-template-columns: minmax(560px, auto) 1fr;
    gap: var(--wc-space-lg);
  }
</style>