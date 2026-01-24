<script lang="ts">
const { teamName, teamFlag, reverse = false }: { teamName: string, teamFlag:string, reverse?: boolean } = $props()
</script>

{#if reverse}
<span class="team-emoji">{@html teamFlag}</span> 
{/if}

<span class="team-name">{teamName}</span>

{#if !reverse}
<span class="team-emoji">{@html teamFlag}</span>
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
    font-size: 1.5rem;
    line-height: 1;
  }
</style>