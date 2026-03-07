<script lang="ts">
  import { updateGroupScore } from "../stores/groups.svelte"
  import { updateKnockout } from "../Knockout"
  import { type MatchItem, type Result, lastGroupMatchId } from "../data/matches"
  import TeamName from "./TeamName.svelte"

  const { match }: { match: MatchItem } = $props()
  const { id, datetime, stage, group, city, stadium, completed } = match
  const home = $derived(match.home)
  const away = $derived(match.away)
  const uid = $props.id()
  const footerTitle: string = group ? `Group ${group}` : `${stage}`
  const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }

  let homeScore: Result = $state(match?.result?.[0] ?? null)
  let awayScore: Result = $state(match?.result?.[1] ?? null)
  let homePenalty: Result = $state(match?.penalties?.[0] ?? null)
  let awayPenalty: Result = $state(match?.penalties?.[1] ?? null)

  const hasPenalties = $derived(!group && homeScore !== null && awayScore !== null && homeScore === awayScore)

  if (match.result && match.completed) {
    updateGroupScore(match)
  }

  function update() {
    match.result = [homeScore, awayScore]
    if (hasPenalties) {
      match.penalties = [homePenalty, awayPenalty]
    } else {
      homePenalty = null
      awayPenalty = null
      match.penalties = undefined
    }
    if (id <= lastGroupMatchId) {
      updateGroupScore(match)
    } else {
      updateKnockout(match)
    }
  }
</script>

<div class="match">
  <div class="match-header">
    <time {datetime}>{new Date(datetime).toLocaleString("pl-PL", dateTimeFormatOptions)}</time>
  </div>
  <div class="match-form">
    <label class="match-team text-right" for="{uid}--home"><TeamName team={home} /></label>
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
    <label class="match-team text-left" for="{uid}--away"><TeamName team={away} reverse /></label>
  </div>
  {#if hasPenalties}
    <div class="match-form">
      <label class="sr-only" for="{uid}--pen-home"><TeamName team={home} /> – penalties</label>
      <input
        class="match-score match-score--pen form-ctrl"
        id="{uid}--pen-home"
        type="number"
        min="0"
        bind:value={homePenalty}
        readonly={completed}
        oninput={update}
      />
      :
      <input
        class="match-score match-score--pen form-ctrl"
        id="{uid}--pen-away"
        type="number"
        min="0"
        bind:value={awayPenalty}
        readonly={completed}
        oninput={update}
      />
      <label class="sr-only" for="{uid}--pen-away"><TeamName team={away} reverse /> – penalties</label>
    </div>
  {/if}
  <div class="match-footer">{footerTitle} • {city} • {stadium}</div>
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
    background-color: var(--wc-color-natural200);
  }

  .match-score--pen {
    border-style: dashed;
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
