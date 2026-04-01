<script lang="ts">
  import { type MatchItem, type Result, sanitizeResult } from "../data/matches"
  import { updateMatchScore } from "../stores/matches.svelte"
  import TeamName from "./TeamName.svelte"
  import Time from "./Time.svelte"

  const { match }: { match: MatchItem } = $props()
  const { datetime, stage, group, city, stadium, completed } = match
  const home = $derived(match.home)
  const away = $derived(match.away)
  const uid = $props.id()
  const footerTitle: string = group ? `Group ${group}` : `${stage}`

  const homeScore: Result = $derived(match.result?.[0] ?? null)
  const awayScore: Result = $derived(match.result?.[1] ?? null)
  const homePenalty: Result = $derived(match.penalties?.[0] ?? null)
  const awayPenalty: Result = $derived(match.penalties?.[1] ?? null)
  const showPenalties = $derived(!group && homeScore !== null && awayScore !== null && homeScore === awayScore)

  function update(patch: { result?: [Result, Result]; penalties?: [Result, Result] }) {
    updateMatchScore({
      id: match.id,
      result: patch.result ?? match.result,
      penalties: patch.penalties ?? match.penalties,
    })
  }

  function setHomeScore(value: Result) {
    update({ result: [sanitizeResult(value), awayScore] })
  }
  function setAwayScore(value: Result) {
    update({ result: [homeScore, sanitizeResult(value)] })
  }
  function setHomePenalty(value: Result) {
    update({ penalties: [sanitizeResult(value), awayPenalty] })
  }
  function setAwayPenalty(value: Result) {
    update({ penalties: [homePenalty, sanitizeResult(value)] })
  }
</script>

<div class="match">
  <div class="match-header">
    <Time {datetime} />
  </div>
  <div class="match-form">
    <label class="match-team text-truncate text-right" for="{uid}--home"><TeamName team={home} /></label>
    <input
      class="match-score form-ctrl"
      id="{uid}--home"
      type="number"
      min="0"
      bind:value={() => homeScore, setHomeScore}
      readonly={completed}
    />
    :
    <input
      class="match-score form-ctrl"
      id="{uid}--away"
      type="number"
      min="0"
      bind:value={() => awayScore, setAwayScore}
      readonly={completed}
    />
    <label class="match-team text-truncate text-left" for="{uid}--away"><TeamName team={away} reverse /></label>
  </div>
  {#if showPenalties}
    <div class="match-form">
      <label class="sr-only" for="{uid}--pen-home"><TeamName team={home} /> – penalties</label>
      <input
        class="match-score match-score--pen form-ctrl"
        id="{uid}--pen-home"
        type="number"
        min="0"
        bind:value={() => homePenalty, setHomePenalty}
        readonly={completed}
      />
      :
      <input
        class="match-score match-score--pen form-ctrl"
        id="{uid}--pen-away"
        type="number"
        min="0"
        bind:value={() => awayPenalty, setAwayPenalty}
        readonly={completed}
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
    font-size: var(--wc-text-sm);
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

  .match-score--pen {
    border-style: dashed;
  }

  .match-team {
    display: block;
    flex-grow: 1;
    max-width: var(--wc-team-max-width);
  }
</style>
