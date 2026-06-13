<script lang="ts">
  import Match from "./Match.svelte"
  import { stages, type MatchItem } from "../data/matches"
  import { matchesData } from "../stores/matches.svelte"
  import { createStorage } from "../utils/storage"
  import { dateTimeFormatter } from "../utils/intl"

  type SortMode = "date" | "stage"
  const sortMode = createStorage<SortMode>("wc26-fixtures-sort", "date")

  let sort: SortMode = $state(sortMode.load())
  let filter = $state("")

  $effect(() => {
    sortMode.save(sort)
  })

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
    const sorted = sort === "stage" ? [...list].sort(sortMatchesByStage) : [...list].sort(sortMatchesByDatetime)
    const groupBy = Object.groupBy(sorted, ({ datetime, group, stage }) => {
      if (sort === "stage") return group ? `Group ${group}` : `${stage}`
      return dateTimeFormatter(datetime).slice(0, -6)
    })
    return Object.entries(groupBy).map(([label, matches]) => ({ label, matches }))
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
  <div class="matches">
    {#each filteredMatches as group (group.label)}
      <div class="matches-header">{group.label}</div>
      <div class="matches-list">
        {#each group.matches as item (item.id)}
          <Match match={item} />
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .matches-header {
    text-align: left;
    font-family: var(--wc-headings-ff);
    margin: var(--wc-space-sm) 0;
  }
</style>
