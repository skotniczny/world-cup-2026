<script lang="ts">
  import Match from "./Match.svelte";
  import Table from "./Table.svelte";
  import { type MatchItem } from "../data/matches";
  import { matchesData } from "../stores.svelte";
  import { groupsData } from "../stores.svelte";
  import type { GroupName } from "../stores.svelte";
  import type { TableRow } from "../Group";

  let { groupName }: { groupName: GroupName } = $props();
  let groupMatches: MatchItem[] = $derived(matchesData.filter(m => m.group === groupName))
  let groupTable: { name: string; table: TableRow[] } = $derived(groupsData[groupName])
</script>

<h1>Group {groupName}</h1>
<div class="group-grid">
  <div class="matches-list">
  {#each groupMatches as item (item.id)}
    <Match match={item} />
  {/each}
  </div>
  <div class="standings-container">
  {#if groupTable}
    <Table name={groupTable.name} table={groupTable.table} long={true} />
  {/if}
  </div>
</div>

<style>
  .group-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    margin-bottom: 2rem;
    max-width: 960px;
    margin-left: auto;
    margin-right: auto;
  }

  .standings-container {
    min-width: 0;
  }
</style>