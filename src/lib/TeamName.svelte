<script lang="ts">
  import type { TeamInfo } from "../data/teams"

  interface Props {
    team: TeamInfo
    compact?: boolean
    reverse?: boolean
  }
  const { team, compact = false, reverse = false }: Props = $props()
</script>

{#if reverse}
  <span class="team-emoji">{team.flag}</span>
{/if}

<span class="team-name">{compact ? team.abbreviation : team.name}</span>

{#if !reverse}
  <span class="team-emoji">{team.flag}</span>
{/if}

<style>
  .team-name,
  .team-emoji {
    vertical-align: middle;
  }

  .team-name {
    font-family: var(--wc-headings-ff);
  }

  .team-emoji {
    font-family: "Twemoji Country Flags", system-ui;
    font-size: 1.5rem;
    line-height: 1;
  }
</style>
