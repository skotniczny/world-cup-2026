<script lang="ts">
  import { type MatchItem, type Result } from "../data/matches"
  import TeamName from "./TeamName.svelte"
  import { updateKnockout } from "../Knockout"

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

  let homeScore: Result = $state(match?.result?.[0] ?? null)
  let awayScore: Result = $state(match?.result?.[1] ?? null)
  let homePenalty: Result = $state(match?.penalties?.[0] ?? null)
  let awayPenalty: Result = $state(match?.penalties?.[1] ?? null)

  const hasPenalties = $derived(homeScore !== null && awayScore !== null && homeScore === awayScore)

  if (match.result && match.completed) {
    updateKnockout(match)
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
    updateKnockout(match)
  }
</script>

<div class="matchko">
  <div class="matchko-header">
    <time {datetime}>{new Date(datetime).toLocaleString("pl-PL", dateTimeFormatOptions)}</time>
  </div>
  <div class="matchko-body">
    <div class="matchko-form">
      <label class="matchko-team text-left" for="{uid}--home">
        <TeamName team={home} compact />
      </label>
      {#if hasPenalties}
        <input
          class="matchko-score matchko-score--pen form-ctrl"
          id="{uid}--pen-home"
          type="number"
          min="0"
          bind:value={homePenalty}
          readonly={completed}
          oninput={update}
        />
      {/if}
      <input
        class="matchko-score form-ctrl"
        id="{uid}--home"
        type="number"
        min="0"
        bind:value={homeScore}
        readonly={completed}
        oninput={update}
      />
    </div>
    <div class="matchko-form">
      <label class="matchko-team text-left" for="{uid}--away">
        <TeamName team={away} compact />
      </label>
      {#if hasPenalties}
        <input
          class="matchko-score matchko-score--pen form-ctrl"
          id="{uid}--pen-away"
          type="number"
          min="0"
          bind:value={awayPenalty}
          readonly={completed}
          oninput={update}
        />
      {/if}
      <input
        class="matchko-score form-ctrl"
        id="{uid}--away"
        type="number"
        min="0"
        bind:value={awayScore}
        readonly={completed}
        oninput={update}
      />
    </div>
  </div>
  <div class="matchko-footer">M{match.id} • {city}</div>
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
    white-space: nowrap;
    font-size: 0.875rem;
    text-overflow: ellipsis;
    overflow: hidden;
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

  .matchko-score:read-only {
    background-color: var(--wc-color-natural200);
  }

  .matchko-score--pen {
    border-style: dashed;
    max-width: 36px;
  }

  .matchko-team {
    display: block;
    flex-grow: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
