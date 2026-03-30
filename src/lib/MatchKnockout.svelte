<script lang="ts">
  import { type MatchItem, type Result, sanitizeResult } from "../data/matches"
  import { updateMatchScore } from "../stores/matches.svelte"
  import TeamName from "./TeamName.svelte"

  const { match }: { match: MatchItem } = $props()

  const { datetime, city, completed } = match
  const home = $derived(match.home)
  const away = $derived(match.away)
  const uid = $props.id()
  const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }

  const homeScore: Result = $derived(match.result?.[0] ?? null)
  const awayScore: Result = $derived(match.result?.[1] ?? null)
  const homePenalty: Result = $derived(match.penalties?.[0] ?? null)
  const awayPenalty: Result = $derived(match.penalties?.[1] ?? null)
  const showPenalties = $derived(homeScore !== null && awayScore !== null && homeScore === awayScore)

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

<div class="matchko">
  <div class="matchko-header text-truncate">
    <time {datetime}>{new Date(datetime).toLocaleString("pl-PL", dateTimeFormatOptions)}</time>
  </div>
  <div class="matchko-body">
    <div class="matchko-form">
      <label class="matchko-team text-truncate text-left" for="{uid}--home">
        <TeamName team={home} compact />
      </label>
      {#if showPenalties}
        <input
          class="matchko-score matchko-score--pen form-ctrl"
          id="{uid}--pen-home"
          type="number"
          min="0"
          bind:value={() => homePenalty, setHomePenalty}
          readonly={completed}
        />
      {/if}
      <input
        class="matchko-score form-ctrl"
        id="{uid}--home"
        type="number"
        min="0"
        bind:value={() => homeScore, setHomeScore}
        readonly={completed}
      />
    </div>
    <div class="matchko-form">
      <label class="matchko-team text-truncate text-left" for="{uid}--away">
        <TeamName team={away} compact />
      </label>
      {#if showPenalties}
        <input
          class="matchko-score matchko-score--pen form-ctrl"
          id="{uid}--pen-away"
          type="number"
          min="0"
          bind:value={() => awayPenalty, setAwayPenalty}
          readonly={completed}
        />
      {/if}
      <input
        class="matchko-score form-ctrl"
        id="{uid}--away"
        type="number"
        min="0"
        bind:value={() => awayScore, setAwayScore}
        readonly={completed}
      />
    </div>
  </div>
  <div class="matchko-footer text-truncate">M{match.id} • {city}</div>
</div>

<style>
  .matchko::after {
    content: "";
    display: block;
    position: absolute;
    border: 1px solid var(--wc-color-natural300);
    width: 18px;
  }

  :global(.knockout-match_final) .matchko:after,
  :global(.knockout-match_third-place) .matchko:after {
    display: none;
  }

  :global(.knockout-stage_left) .matchko::after {
    right: -17px;
    border-left-color: transparent;
  }

  :global(.knockout-stage_right) .matchko::after {
    left: -17px;
    border-right-color: transparent;
  }

  :global(.knockout-match:nth-child(odd)) .matchko:after {
    top: 50%;
  }

  :global(.knockout-match:nth-child(even)) .matchko:after {
    bottom: 50%;
  }

  :global(.knockout-stage_left .knockout-match:nth-child(odd)) .matchko:after {
    border-radius: 0 var(--wc-radius-double) 0 0;
    border-bottom-color: transparent;
  }

  :global(.knockout-stage_left .knockout-match:nth-child(even)) .matchko::after {
    border-radius: 0 0 var(--wc-radius-double) 0;
    border-top-color: transparent;
  }

  :global(.knockout-stage_right .knockout-match:nth-child(odd)) .matchko::after {
    border-radius: var(--wc-radius-double) 0 0 0;
    border-bottom-color: transparent;
  }

  :global(.knockout-stage_right .knockout-match:nth-child(even)) .matchko::after {
    border-radius: 0 0 0 var(--wc-radius-double);
    border-top-color: transparent;
  }

  :global(.knockout-stage_32) .matchko::after {
    height: 30px;
  }

  :global(.knockout-stage_16) .matchko::after {
    height: 60px;
  }

  :global(.knockout-stage_qf) .matchko::after {
    height: 210px;
  }

  .matchko-header,
  .matchko-footer {
    font-size: var(--wc-text-sm);
  }

  .matchko-body {
    padding: var(--wc-space-sm);
    border: 1px solid var(--wc-color-natural200);
    background: var(--wc-color-natural0);
    border-radius: var(--wc-radius);
    display: grid;
    row-gap: 0.5rem;
  }

  .matchko-form {
    display: flex;
    column-gap: var(--wc-space-sm);
    min-width: 0;
  }

  .matchko-score {
    max-width: 48px;
    text-align: center;
  }

  .matchko-score--pen {
    border-style: dashed;
    max-width: 36px;
  }

  .matchko-team {
    display: block;
    flex-grow: 1;
  }
</style>
