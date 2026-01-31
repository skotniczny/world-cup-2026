<script lang="ts">
  import type { Result } from "../Group"
  import { updateGroupScore } from "../stores.svelte"

  import matches, { type MatchItem } from "../data/matches"
  import TeamName from "./TeamName.svelte";

  const { match }: { match: MatchItem } = $props()
  const { id, datetime, home, homeFlag, away, awayFlag, group, city, stadium, completed } = match
  const uid = $props.id()
  const groupName: string = group ? `Grupa ${group} • ` : ""

  let homeScore: Result = $state(match?.result?.[0] ?? null)
  let awayScore: Result = $state(match?.result?.[1] ?? null)

  if (match.result && match.completed) {
    updateScore(home, away, [homeScore, awayScore], group)
  }

  function update() {
    const index:number = matches.findIndex(item => item.id === id)
    matches[index].result = [homeScore, awayScore]
      updateGroupScore(match)
  }
</script>

<div class="match">
  <div class="match-header">
    <time datetime={datetime}>{new Date(datetime).toLocaleString("pl-PL", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</time>
  </div>
  <div class="match-form">
    <label class="match-team text-right" for="{uid}--home"><TeamName teamName={home} teamFlag={homeFlag} /></label>
    <input
      class="match-score form-ctrl"
      id="{uid}--home"
      type="number"
      min="0"
      bind:value={homeScore}
      readonly={completed}
      oninput={update}
    />
    :
    <input
      class="match-score form-ctrl"
      id="{uid}--away"
      type="number"
      min="0"
      bind:value={awayScore}
      readonly={completed}
      oninput={update}
    />
    <label class="match-team text-left" for="{uid}--away"><TeamName teamName={away} teamFlag={awayFlag} reverse /></label>
  </div>
  <div class="match-footer">{groupName}{city} • {stadium}</div>
</div>

<style>
  .match {
    padding: var(--wc-space-sm);
    border-bottom: 1px solid var(--wc-color-natural200);
    display: grid;
    row-gap: 0.5rem;
  }

  .match:last-child {
    border-bottom-color: transparent;
  }

  .match-header,
  .match-footer {
    font-size: 0.875rem;
  }

  .match-form {
    display: flex;
    column-gap: var(--wc-space-sm);
    justify-content: center;
  }

  .match-score {
    max-width: 48px;
    text-align: center;
  }

  .match-score:read-only {
    background-color: #f1f1f1;
  }

  .match-team {
    display: block;
    flex-grow: 1;
    max-width: var(--wc-match-max-width);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
