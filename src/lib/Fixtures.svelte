<script lang="ts">
  import Match from "./Match.svelte"
  import { stages, type MatchItem } from "../data/matches"
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

<div class="fixtures">
  <div class="text-right mb-sm">
    <label for="filter" class="sr-only">Filter stage</label>
    <select id="filter" class="select-ctrl" bind:value={filter}>
      <option selected value="">All stages</option>
      {#each stages as stage (stage)}
        <option value={stage}>{stage}</option>
      {/each}
    </select>
    <label for="sort" class="sr-only">Sort fixtures</label>
    <select id="sort" class="select-ctrl" bind:value={sort}>
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
