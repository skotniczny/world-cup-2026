<script lang="ts">
  import MatchKnockout from "./MatchKnockout.svelte"
  import { knockoutMatchesByRound } from "../data/knockoutTree"
  import { findMatchById } from "../stores/matches.svelte"

  const m = (ids: number[]) => ids.map(findMatchById)

  const stages = {
    left: [
      { matches: m(knockoutMatchesByRound.leftRoundOf32), key: "32", header: "Round of 32" },
      { matches: m(knockoutMatchesByRound.leftRoundOf16), key: "16", header: "Round of 16" },
      { matches: m(knockoutMatchesByRound.leftQf), key: "qf", header: "Quarter-final" },
      { matches: m(knockoutMatchesByRound.leftSf), key: "sf", header: "Semi-final" },
    ],
    right: [
      { matches: m(knockoutMatchesByRound.rightSf), key: "sf", header: "Semi-final" },
      { matches: m(knockoutMatchesByRound.rightQf), key: "qf", header: "Quarter-final" },
      { matches: m(knockoutMatchesByRound.rightRoundOf16), key: "16", header: "Round of 16" },
      { matches: m(knockoutMatchesByRound.rightRoundOf32), key: "32", header: "Round of 32" },
    ],
    final: findMatchById(knockoutMatchesByRound.final),
    third: findMatchById(knockoutMatchesByRound.thirdPlace),
  }
</script>

<h1>Knockout</h1>
<div class="knockout-grid">
  <div class="knockout-headers">
    {#each stages.left as stage}
      <div class="knockout-header">{stage.header}</div>
    {/each}
    {#each stages.right as stage}
      <div class="knockout-header">{stage.header}</div>
    {/each}
  </div>
  <div class="knockout-stages">
    {#each stages.left as stage}
      <div class="knockout-stage knockout-stage_left knockout-stage_{stage.key}">
        {#each stage.matches as match}
          <div class="knockout-match">
            <MatchKnockout {match} />
          </div>
        {/each}
      </div>
    {/each}
    <div class="knockout-stage knockout-stage_f">
      <div class="knockout-match knockout-match_final">
        <div class="knockout-header">Final</div>
        <MatchKnockout match={stages.final} />
      </div>
      <div class="knockout-match knockout-match_third-place">
        <div class="knockout-header">Third Place</div>
        <MatchKnockout match={stages.third} />
      </div>
    </div>
    {#each stages.right as stage}
      <div class="knockout-stage knockout-stage_right knockout-stage_{stage.key}">
        {#each stage.matches as match}
          <div class="knockout-match">
            <MatchKnockout {match} />
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>

<style>
  .knockout-grid {
    overflow: auto;
  }

  .knockout-headers,
  .knockout-stages {
    display: flex;
    column-gap: 2rem;
    position: relative;
  }

  .knockout-header,
  .knockout-stage {
    flex-grow: 1;
    min-width: 164px;
  }

  .knockout-stage {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
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
    left: 767px;
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
  .knockout-stage_qf .knockout-match::before {
    height: 100px;
  }

  .knockout-stage_sf .knockout-match {
    position: relative;
    z-index: 1;
  }
</style>
