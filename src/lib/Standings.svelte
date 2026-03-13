<script lang="ts">
  import { groupsData } from "../stores/groups.svelte"
  import Table from "./Table.svelte"
</script>

<h1>Standings</h1>
<div class="standings-grid">
  {#each Object.values(groupsData) as group (group.name)}
    <Table name={group.name} table={group.table} />
  {/each}
</div>

<style>
  .standings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--wc-grid-col-min-width), 1fr));
    gap: var(--wc-space-lg);
  }
</style>
