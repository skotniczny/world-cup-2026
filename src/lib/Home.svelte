<script lang="ts">
  import Match from "./Match.svelte"
  import Table from "./Table.svelte"
  import { groupsData } from "../stores.svelte"
  import matches from "../data/matches"

  let sort: string = $state("date")

  function sortMatches() {
    if (sort === "date") {
      matches.sort(
        (a, b) =>
          new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
      );
    }
    if (sort === "group") {
      matches.sort((a, b) => {
        const valA = a.group && a.group.length > 0 ? a.group : undefined
        const valB = b.group && b.group.length > 0 ? b.group : undefined
        if (valA === undefined && valB === undefined) return 0
        if (valA === undefined) return 1
        if (valB === undefined) return -1
        return valA.localeCompare(valB)
      });
    }
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
        {#each matches as item}
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