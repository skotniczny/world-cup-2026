<script lang="ts">
  import { type TableRow }  from "../Group"
  interface Props { name: string, table: TableRow[], long?: boolean }
  const props: Props = $props();

  const long = props.long ?? false
</script>


<div class="standings" id="{props.name.replace(' ', '')}">
  <table>
    <caption>{props.name}</caption>
    <thead>
      <tr>
        <th></th>
        <th>Team</th>
        {#if long}
        <th>Points</th>
        <th>Goals For</th>
        <th>Goals Against</th>
        {:else}
        <th title="Points" class="text-help">P</th>
        <th title="Goals For" class="text-help">GF</th>
        <th title="Goals Against" class="text-help">GA</th>
        {/if}
      </tr>
    </thead>
    <tbody>
      {#each props.table as row, i}
        <tr>
          <td class="table_pos">{i + 1}</td>
          <td class="table_team">{row[0]}</td>
          <td class="table_points">{row[1]}</td>
          <td class="table_for">{row[2]}</td>
          <td class="table_against">{row[3]}</td>
        </tr>
      {/each}
    </tbody>
  </table>
  {#if long}
  <ul class="standings_footer">
    <li class="footer_item footer_item-advance">Advance to knockout stage</li>
    <li class="footer_item footer_item-ranking">Possible knockout stage based on ranking</li>
  </ul>
  {/if}
</div>

<style>
  .standings {
    box-shadow: var(--wc-shadow);
    border-radius: var(--wc-radius);
    padding-top: 0.5rem;
    scroll-margin-top: 50px;
    background: var(--wc-color-natural0);
    overflow: auto;
  }

  .standings:target {
    background-color: var(--wc-color-natural300);
    transition: background-color 0.3s ease;
  }

  .standings table {
    border-collapse: collapse;
    width: 100%;
  }
  .standings th,
  .standings td {
    padding: 0.35rem 1rem;
    text-wrap: nowrap;
  }

  .standings th {
    font-weight: 400;
  }

  .standings td {
    border-top: 1px solid var(--wc-color-natural200);
  }

  .standings tbody tr {
    position: relative;
  }

  .standings tbody tr:nth-child(1) .table_pos::before,
  .standings tbody tr:nth-child(2) .table_pos::before {
    background-color: var(--wc-color-accent);
  }

  .standings tbody tr:nth-child(3) .table_pos::before {
    background-color: var(--wc-color-secondary);
  }

  .standings_footer {
    font-size: 0.875rem;
    list-style: none;
    text-align: left;
    padding-left: 1rem;
  }

  .standings_footer .footer_item {
    display: inline-flex;
    column-gap: 4px;
    align-items: center;
    margin-right: 0.5rem;
  }

  .standings_footer .footer_item::before {
    content: "";
    display: inline-block;
    height: 0.875rem;
    width: 0.875rem;
    border-radius: 50%;
  }

  .standings_footer .footer_item-advance::before {
    background-color: var(--wc-color-accent);
  }

  .standings_footer .footer_item-ranking::before {
    background-color: var(--wc-color-secondary);
  }

  .table_pos {
    position: relative;
  }

  .table_pos::before {
    content: "";
    display: block;
    position: absolute;
    border-radius: 4px 4px 0 0;
    height: 6px;
    bottom: 0;
    left: 1px;
    right: 1px;
    width: 1.5rem;
    margin-left: auto;
    margin-right: auto;
  }
</style>