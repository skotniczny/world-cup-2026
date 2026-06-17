<script lang="ts">
  import Table from "../lib/Table.svelte"
  import Fixtures from "../lib/Fixtures.svelte"
  import { groupsData, thirdPlaces } from "../stores/groups.svelte"
  import { type GroupName } from "../data/groups"
  import GroupSelect from "../lib/GroupSelect.svelte"
  import { createStorage } from "../utils/storage"

  const selectedGroups = createStorage<GroupName[]>("wc26-selected-groups", [])

  let selected: GroupName[] = $state(selectedGroups.load())
  const selectedGroupLabels = $derived(selected.map((g) => `Group ${g}`))
  const groups = $derived(
    Object.values(groupsData).filter((g) => !selected.length || selectedGroupLabels.includes(g.name)),
  )

  $effect(() => selectedGroups.save(selected))
</script>

<h1>2026 FIFA World Cup</h1>
<div class="home-grid">
  <Fixtures />
  <div class="tables">
    <GroupSelect bind:selected />
    <div class="grid-column">
      {#each groups as group (group.name)}
        <Table name={group.name} table={group.table} hasUnresolvedTies={group.hasUnresolvedTies} />
      {/each}
    </div>
    <div class="grid-column">
      <Table
        name="Third-placed Ranking"
        table={thirdPlaces.table}
        hasUnresolvedTies={thirdPlaces.hasUnresolvedTies}
        thirdPlaces
      />
    </div>
  </div>
</div>

<style>
  .home-grid {
    display: grid;
    grid-template-columns: var(--wc-home-columns);
    gap: var(--wc-space-lg);
  }

  .tables {
    display: flex;
    flex-direction: column;
    row-gap: var(--wc-space-sm);
  }
</style>
