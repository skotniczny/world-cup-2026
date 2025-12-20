<script lang="ts">
  import { groupsData } from "../stores.svelte"
  import Table from "./Table.svelte"
</script>

<h1>Standings</h1>
<div class="standings-grid">
  {#each Object.values(groupsData) as group}
    <Table name={group.name} table={group.table} />
  {/each}
</div>

<style>
  .standings-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: var(--wc-space-lg);
  }
</style>