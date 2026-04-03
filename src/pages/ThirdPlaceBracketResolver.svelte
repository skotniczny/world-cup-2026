<script lang="ts">
  import { groupNames, type GroupName } from "../data/groups"
  import { getThirdPlaceMatchup } from "../data/thirdPlaceMatchups"
  import { findMatchById } from "../stores/matches.svelte"
  import { type MatchItem } from "../data/matches"
  import { roundOf32Slots } from "../RoundOf32Setup"
  import { type GroupSlot, type ThirdPlaceSlot } from "../RoundOf32Setup"
  import Time from "../lib/Time.svelte"

  const slots = [...roundOf32Slots].filter(([, { away }]) => away.position === 3) as [
    number,
    { home: GroupSlot; away: ThirdPlaceSlot },
  ][]

  let selected: GroupName[] = $state([])
  const advancingGroups = $derived([...selected].sort().join(""))
  const maxReached = $derived(selected.length >= 8)

  const matchups = $derived.by(() => {
    if (!maxReached) return null
    const matchup = getThirdPlaceMatchup(advancingGroups)
    return slots.map(([key, item]) => {
      const match: MatchItem = findMatchById(key)
      const homeGroup = item.home.group
      const awayGroup = matchup[item.away.thirdPlaceIndex]
      return {
        key,
        datetime: match.datetime,
        home: {
          display: `${item.home.position}${homeGroup}`,
          label: `Group ${homeGroup} winner`,
        },
        away: {
          display: `${item.away.position}${awayGroup}`,
          label: `Third-placed team from group ${awayGroup}`,
        },
        footer: `${match.stage} • ${match.city} • ${match.stadium}`,
      }
    })
  })
</script>

<section>
  <h1>Combinations for eight best third‑placed teams</h1>
  <p>
    FIFA has pre-defined all 495 possible combinations in the official tournament regulations (<a
      href="https://digitalhub.fifa.com/m/636f5c9c6f29771f/original/FWC2026_regulations_EN.pdf">Annex C</a
    >).
  </p>
  <p>Use the tool to select the 8 qualifying groups and instantly see the generated matchups.</p>

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
</section>
<section aria-live="polite">
  {#if matchups}
    <h2>Matchups for advancing third-placed teams</h2>
    <ol class="matchup">
      {#each matchups as match (match.key)}
        <li class="matchup-item">
          <div class="matchup-header"><Time datetime={match.datetime} /></div>
          <div>
            <span class="sr-only">{match.home.label}</span>
            <span class="team-placeholder" aria-hidden="true">{match.home.display}</span>
            <abbr title="versus">vs.</abbr>
            <span class="sr-only">{match.away.label}</span>
            <span class="team-placeholder" aria-hidden="true">{match.away.display}</span>
          </div>
          <div class="matchup-footer">{match.footer}</div>
        </li>
      {/each}
    </ol>
  {/if}
</section>

<style>
  .groups {
    display: flex;
    flex-wrap: wrap;
    column-gap: var(--wc-space-lg);
    row-gap: var(--wc-space-sm);
    list-style: none;
    justify-content: center;
    font-family: var(--wc-headings-ff);
    padding: 0;
    margin: 0 auto 1rem;
    max-width: 448px;
  }

  .team-placeholder {
    font-family: var(--wc-headings-ff);
  }

  .groups_label,
  .matchup-item {
    padding: 0.5rem 1rem;
    border-radius: var(--wc-radius);
    box-shadow: var(--wc-shadow);
  }

  .groups_label {
    border: 1px solid var(--wc-color-natural300);
    cursor: pointer;
    display: inline-block;
    width: 3rem;
    text-align: center;
  }

  .groups_label:has(+ input:checked) {
    background: var(--wc-color-natural0);
  }

  .groups_label:has(+ input:focus-visible) {
    outline: 1px solid var(--wc-color-accent);
  }

  .matchup {
    display: inline-flex;
    row-gap: var(--wc-space-sm);
    flex-direction: column;
    padding: 0;
    list-style: none;
    margin: 0 0 var(--wc-space-sm);
  }

  .matchup-item {
    border: 1px solid var(--wc-color-natural200);
    background: var(--wc-color-natural0);
    flex: 0 0 0%;
  }

  .matchup-header,
  .matchup-footer {
    font-size: var(--wc-text-sm);
  }
</style>
