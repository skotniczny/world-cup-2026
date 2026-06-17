<script lang="ts">
  import { groupNames, type GroupName } from "../data/groups"

  interface Props {
    selected: GroupName[]
    max?: number
  }

  let { selected = $bindable<GroupName[]>([]), max = groupNames.length }: Props = $props()
  const maxReached = $derived(selected.length >= max)

  function onclick() {
    selected = []
  }
</script>

<div class="group-select">
  <button class="btn mb-sm align-self-end" type="button" {onclick} disabled={selected.length === 0}>× Clear all</button>
  <ol class="groups">
    {#each groupNames as g (g)}
      <li class="groups_item">
        <label class="groups_label" for={`group${g}`}>
          <span class="sr-only">Group {g}</span>
          <span aria-hidden="true">{g}</span>
        </label>
        <input
          id={`group${g}`}
          class="sr-only"
          type="checkbox"
          value={g}
          bind:group={selected}
          disabled={maxReached && !selected.includes(g)}
        />
      </li>
    {/each}
  </ol>
</div>

<style>
  .group-select {
    display: flex;
    flex-direction: column;
    justify-content: center;
    container: select-container / inline-size;
  }

  .groups {
    --columns: 6;
    display: inline-grid;
    grid-template-columns: repeat(var(--columns), auto);
    flex-wrap: wrap;
    flex-grow: 1;
    gap: var(--wc-space-sm);
    list-style: none;
    justify-content: space-between;
    font-family: var(--wc-headings-ff);
    padding: 0;
    margin: 0;
  }

  @container select-container (min-width: 664px) {
    .groups {
      --columns: 12;
    }
  }

  .groups_label {
    border: 1px solid var(--wc-color-natural300);
    cursor: pointer;
    display: inline-block;
    width: 3rem;
    text-align: center;
    padding: 0.5rem 1rem;
    border-radius: var(--wc-radius);
    box-shadow: var(--wc-shadow);
  }

  .groups_label:has(+ input:checked) {
    background: var(--wc-color-natural0);
  }

  .groups_label:has(+ input:focus-visible) {
    outline: 1px solid var(--wc-color-accent);
  }
</style>
