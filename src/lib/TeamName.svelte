<script lang="ts">
const { teamName, teamFlag }: { teamName: string, teamFlag:string } = $props()
</script>

<span class="team-name">{teamName}</span> <span class="team-emoji">{@html teamFlag}</span>

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