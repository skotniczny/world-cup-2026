<script lang="ts">
  import { type TableRow } from "../Group"
  import { type ThirdPlacesTableRow } from "../ThirdPlacedRanking"
  import TeamName from "./TeamName.svelte"
  interface Props {
    name: string
    table: TableRow[] | ThirdPlacesTableRow[]
    long?: boolean
    thirdPlaces?: boolean
  }
  const props: Props = $props()

  const long: boolean = props.long ?? false
  const thirdPlaces: boolean = props.thirdPlaces ?? false
  const mainClass = `standings${thirdPlaces ? ` standings--third-places` : ""}`
</script>

<div class={mainClass} id={props.name.replace(" ", "")}>
  <table>
    <caption>{props.name}</caption>
    <thead>
      <tr>
        <th></th>
        <th>Team</th>
        {#if long}
          <th>Matches Played</th>
          <th>Goals For</th>
          <th>Goals Against</th>
          <th>Goal Difference</th>
          <th>Points</th>
          {#if thirdPlaces}
            <th>Group</th>
          {/if}
        {:else}
          <th><abbr class="text-help" title="Goals For">GF</abbr></th>
          <th><abbr class="text-help" title="Goals Against">GA</abbr></th>
          <th><abbr class="text-help" title="Points">Pts</abbr></th>
          {#if thirdPlaces}
            <th><abbr class="text-help" title="Group">GP</abbr></th>
          {/if}
        {/if}
      </tr>
    </thead>
    <tbody>
      {#each props.table as row, i}
        <tr>
          <td class="table_pos">{i + 1}</td>
          <td class="table_team">
            <TeamName team={row[0]} compact={!long} />
          </td>
          {#if long}
            <td class="table_mp">{row[1]}</td>
          {/if}
          <td class="table_for">{row[2]}</td>
          <td class="table_against">{row[3]}</td>
          {#if long}
            <td class="table_gd">{row[4]}</td>
          {/if}
          <td class="table_points">{row[5]}</td>
          {#if thirdPlaces}
            <td class="table_group">{row[6]}</td>
          {/if}
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

  .standings--third-places tbody tr:nth-child(3) .table_pos::before,
  .standings--third-places tbody tr:nth-child(4) .table_pos::before,
  .standings--third-places tbody tr:nth-child(5) .table_pos::before,
  .standings--third-places tbody tr:nth-child(6) .table_pos::before,
  .standings--third-places tbody tr:nth-child(7) .table_pos::before,
  .standings--third-places tbody tr:nth-child(8) .table_pos::before {
    background-color: var(--wc-color-accent);
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
