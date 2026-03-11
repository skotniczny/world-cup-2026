<script lang="ts">
  import Match from "./Match.svelte"
  import { stages, type MatchItem } from "../data/matches"
  import Table from "./Table.svelte"
  import { groupsData, thirdPlaces } from "../stores/groups.svelte"
  import { matchesData } from "../stores/matches.svelte"

  let sort = $state("date")
  let filter = $state("")

  function sortMatchesByDatetime(a: MatchItem, b: MatchItem): number {
    return new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  }

  function sortMatchesByStage(a: MatchItem, b: MatchItem): number {
    if (!a.group && !b.group) return 0
    if (!a.group) return 1
    if (!b.group) return -1
    return a.group.localeCompare(b.group)
  }

  const filteredMatches = $derived.by(() => {
    const list = filter === "" ? matchesData : matchesData.filter((m) => m.stage === filter)
    if (sort === "stage") return [...list].sort(sortMatchesByStage)
    return [...list].sort(sortMatchesByDatetime)
  })
</script>

<header>
  <h1>2026 FIFA World Cup</h1>
</header>
<div class="home-grid">
  <div>
    <div class="text-right">
      <label for="filter" class="sr-only">Filter stage</label>
      <select id="filter" class="select-ctrl mb-sm" bind:value={filter}>
        <option selected value="">All stages</option>
        {#each stages as stage}
          <option value={stage}>{stage}</option>
        {/each}
      </select>
      <label for="sort" class="sr-only">Sort fixtures</label>
      <select id="sort" class="select-ctrl mb-sm" bind:value={sort}>
        <option value="date">Date</option>
        <option value="stage">Stage</option>
      </select>
    </div>
    <div class="matches-list">
      {#each filteredMatches as item (item.id)}
        <Match match={item} />
      {/each}
    </div>
  </div>

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
