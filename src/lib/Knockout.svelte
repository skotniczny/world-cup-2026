<script lang="ts">
  import { type MatchItem } from "../data/matches"
  import MatchKnockout from "./MatchKnockout.svelte"
  import { findMatchById } from "../stores.svelte"

  const knockout = {
    stage32Left: [73, 75, 74, 77, 83, 84, 81, 82],
    stage16Left: [89, 90, 93, 94],
    qfLeft: [97, 98],
    sfLeft: [101],
    final: [104],
    third: [103],
    sfRight: [102],
    qfRight: [99, 100],
    stage16Right: [91, 92, 95, 96],
    stage32Right: [76, 78, 79, 80, 86, 88, 85, 87]
  }

  const knockoutMatches = $derived(
    Object.fromEntries(
      Object.entries(knockout)
        .map(([key, matchIds]) => [ key, matchIds.map(findMatchById) ])
    ) as Record<keyof typeof knockout, MatchItem[]>
  )
  const sfLeft: MatchItem = $derived(knockoutMatches.sfLeft[0])
  const sfRight: MatchItem = $derived(knockoutMatches.sfRight[0])
  const thirdPlace: MatchItem = $derived(knockoutMatches.third[0])
  const final: MatchItem = $derived(knockoutMatches.final[0])
</script>

<h1>Knockout</h1>
<div class="knockout-grid">
  <div class="knockout-headers">
    <div class="knockout-header knockout-stage_left">Round of 32</div>
    <div class="knockout-header knockout-header_left">Round of 16</div>
    <div class="knockout-header knockout-header_left">Quarter-final</div>
    <div class="knockout-header knockout-header_left">Semi-final</div>
    <div class="knockout-header knockout-stage_right">Semi-final</div>
    <div class="knockout-header knockout-header_right">Quarter-final</div>
    <div class="knockout-header knockout-header_right">Round of 16</div>
    <div class="knockout-header knockout-header_right">Round of 32</div>
  </div>
  <div class="knockout-stages">
    <div class="knockout-stage knockout-stage_left knockout-stage_32">
      {#each knockoutMatches.stage32Left as match}
        <div class="knockout-match">
          <MatchKnockout match={match} />
        </div>
      {/each}
    </div>
    <div class="knockout-stage knockout-stage_left knockout-stage_16">
      {#each knockoutMatches.stage16Left as match}
        <div class="knockout-match">
          <MatchKnockout match={match} />
        </div>
      {/each}
    </div>
    <div class="knockout-stage knockout-stage_left knockout-stage_qf">
      {#each knockoutMatches.qfLeft as match}
      <div class="knockout-match">
        <MatchKnockout match={match} />
      </div>
      {/each}
    </div>
    <div class="knockout-stage knockout-stage_left knockout-stage_sf">
      <div class="knockout-match knockout-match">
        <MatchKnockout match={sfLeft} />

      </div>
    </div>
    <div class="knockout-stage knockout-stage_f">
      <div class="knockout-match knockout-match_final">
        <div class="knockout-header">Final</div>
        <MatchKnockout match={final} />
      </div>
      <div class="knockout-match knockout-match_third-place">
        <div class="knockout-header">Third Place</div>
        <MatchKnockout match={thirdPlace} />
      </div>
    </div>
    <div class="knockout-stage knockout-stage_right knockout-stage_sf">
      <div class="knockout-match">
        <MatchKnockout match={sfRight} />

      </div>
    </div>
    <div class="knockout-stage knockout-stage_right knockout-stage_qf">
      {#each knockoutMatches.qfRight as match}
      <div class="knockout-match">
        <MatchKnockout match={match} />
      </div>
      {/each}
    </div>
    <div class="knockout-stage knockout-stage_right knockout-stage_16">
      {#each knockoutMatches.stage16Right as match}
        <div class="knockout-match">
          <MatchKnockout match={match} />
        </div>
      {/each}
    </div>
    <div class="knockout-stage knockout-stage_right knockout-stage_32">
      {#each knockoutMatches.stage32Right as match}
        <div class="knockout-match">
          <MatchKnockout match={match} />
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .knockout-headers,
  .knockout-stages {
    display: flex;
    column-gap: var(--wc-space-lg);
    position: relative;
  }

  .knockout-header,
  .knockout-stage {
    flex-grow: 1;
  }

  .knockout-stage {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
    min-width: 0;
  }

  .knockout-match {
    position: relative;
    margin: var(--wc-space-sm) 0;
  }

  .knockout-stage_32 .knockout-match::after,
  .knockout-stage_32 .knockout-match::before {
    display: none;
  }

  .knockout-stage_f {
    position: absolute;
    top: 120px;
    left: 50%;
    bottom: 120px;
    width: 300px;
    transform: translateX(-50%);
  }

  .knockout-match::after,
  .knockout-match::before {
    content: "";
    display: block;
    border: 1px solid var(--wc-color-natural300);
    width: 1rem;
    height: 100px;
    position: absolute;
  }

  .knockout-match::before {
    bottom: 50%;
  }

  .knockout-match::after {
    top: 50%;
  }

  .knockout-match_third-place::before,
  .knockout-match_final::after {
    left: 50%;
    height: 142px;
    width: 0;
    border-left-color: transparent;
  }

  .knockout-match_final::before,
  .knockout-match_third-place::after {
    display: none;
  }

  .knockout-match_final::after {
    top: 100%;
  }

  .knockout-match_third-place::before {
    bottom: 100%;
  }

  .knockout-stage_left .knockout-match::after {
    border-radius: var(--wc-radius-double) 0 0 0;
    border-right-color: transparent;
    border-bottom-color: transparent;
    left: -1rem;
  }

  .knockout-stage_left .knockout-match::before {
    border-radius: 0 0 0 var(--wc-radius-double);
    border-right-color: transparent;
    border-top-color: transparent;
    left: -1rem;
  }

  .knockout-stage_right .knockout-match::after {
    border-radius: 0 var(--wc-radius-double) 0 0;
    border-left-color: transparent;
    border-bottom-color: transparent;
    right: -1rem;
  }

  .knockout-stage_right .knockout-match::before {
    border-radius: 0 0 var(--wc-radius-double) 0;
    border-top-color: transparent;
    border-left-color: transparent;
    right: -1rem;
  }

  .knockout-stage_16 .knockout-match::after,
  .knockout-stage_16 .knockout-match::before {
    height: 40px;
  }

  .knockout-stage_qf .knockout-match::after,
  .knockout-stage_qf .knockout-match::before  {
    height: 100px;
  }

  .knockout-stage_sf .knockout-match {
    position: relative;
    z-index: 1;
  }
</style>
