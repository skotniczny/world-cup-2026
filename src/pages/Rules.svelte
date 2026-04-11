<script lang="ts">
  import { Link } from "svelte5-router"
</script>

<h1>Rules</h1>

<div class="main-content">
  <p>
    Group stage rankings in this tracker follow the official FIFA World Cup 26 tiebreaking procedure. When teams finish
    level on points, the order is determined by the criteria below — applied exactly as written in the regulations.
    Before all group matches are completed, these criteria are applied provisionally to reflect the current standings.
  </p>
  <p class="legend">Criteria <mark>highlighted</mark> are implemented by this tracker.</p>
  <blockquote cite="https://digitalhub.fifa.com/m/636f5c9c6f29771f/original/FWC2026_regulations_EN.pdf">
    <h2>Article 13: Equal points and qualification for knockout stages</h2>
    <p>
      If two or more teams in the same group are equal on points after the completion of the group stage, the following
      criteria, in the order below, shall be applied to determine the ranking:
    </p>

    <h3>Step 1:</h3>
    <ol>
      <li><mark>greatest number of points obtained in the group matches between the teams concerned;</mark></li>
      <li><mark>superior goal difference resulting from the group matches between the teams concerned;</mark></li>
      <li><mark>greatest number of goals scored in all group matches between the teams concerned.</mark></li>
    </ol>
    <h3>Step 2:</h3>
    <p>
      If, after having applied criteria a) to c) above, teams still have an equal ranking, and in order to determine
      their final rankings, criteria a) to c) above are applied to the matches between the remaining teams only. If no
      decision can be made through this procedure, criteria d) to f) below shall apply as follows to the two or more
      teams still equal on points:
    </p>
    <ol start="4">
      <li><mark>superior goal difference in all group matches;</mark></li>
      <li><mark>greatest number of goals scored in all group matches;</mark></li>
      <li>
        highest team conduct score (players and team officials) relating to the number of yellow and red cards obtained:
        <ul>
          <li>yellow card: minus 1 point</li>
          <li>indirect red card (as a result of two yellow cards): minus 3 points</li>
          <li>direct red card: minus 4 points</li>
          <li>yellow card and direct red card: minus 5 points</li>
        </ul>
      </li>
    </ol>

    <p>
      Only one of the above deductions shall be applied to a player or team official in a single match. The team with
      the highest number of points shall be ranked highest.
    </p>

    <p>
      With respect to the second step, all affected teams will be ranked by applying the criteria d) to f) in order. If
      one team qualifies for a higher or lower ranking pursuant to one criterion, but it is not possible to rank all
      teams on the basis of the same criterion, the remaining two or three teams will be ranked pursuant to the next
      criterion, and so on. In any case, the second step of the ranking does not restart for the two or three teams
      remaining after application of a criterion.
    </p>

    <h3>Step 3:</h3>

    <p>If no decision can be made through the procedures of step 1 and 2, the following shall apply:</p>
    <ol start="7">
      <li>
        the two or more teams still equal on points shall be ranked according to the most recent published edition of
        the FIFA/Coca‑Cola Men’s World Ranking;
      </li>
      <li>
        the two or more teams still equal on points shall be ranked according to the published edition of the
        FIFA/Coca‑Cola Men’s World Ranking immediately preceding the most recent published edition continually until a
        decision can be made.
      </li>
    </ol>
    <cite
      ><a href="https://digitalhub.fifa.com/m/636f5c9c6f29771f/original/FWC2026_regulations_EN.pdf" target="_blank"
        >FIFA World Cup 26 Regulations, Art. 13</a
      ></cite
    >
  </blockquote>

  <p>
    With 48 teams split across 12 groups, the top two from each group advance directly to the round of 32. The remaining
    eight knockout places go to the best third‑placed teams across all groups, ranked as follows:
  </p>

  <blockquote cite="https://digitalhub.fifa.com/m/636f5c9c6f29771f/original/FWC2026_regulations_EN.pdf">
    <h3>The eight best‑ranked teams among those finishing third (third‑placed teams from 1 to 8)</h3>
    <p>The eight best teams among those ranked third will be determined as follows:</p>
    <ol>
      <li><mark>greatest number of points obtained in all group matches;</mark></li>
      <li><mark>goal difference resulting from all group matches;</mark></li>
      <li><mark>greatest number of goals scored in all group matches;</mark></li>
      <li>
        highest team conduct score (players and team officials) relating to the number of yellow and red cards obtained
        in all group matches and calculated as per article 13 paragraph 1, step 2;
      </li>
      <li>
        the two or more teams still equal on points shall be ranked according to the most recent published edition of
        the FIFA/Coca‑Cola Men’s World Ranking;
      </li>
      <li>
        the two or more teams still equal on points shall be ranked according to the published edition of the
        FIFA/Coca‑Cola Men’s World Ranking immediately preceding the most recent published edition continually until a
        decision can be made.
      </li>
    </ol>

    <cite
      ><a href="https://digitalhub.fifa.com/m/636f5c9c6f29771f/original/FWC2026_regulations_EN.pdf" target="_blank"
        >FIFA World Cup 26 Regulations, Art. 13</a
      ></cite
    >
  </blockquote>

  <p>
    Once the eight qualifying groups are known, FIFA's Annex C defines which third‑placed team is paired with which
    group winner in the round of 32 — one of 495 pre‑computed combinations. Try the
    <Link to="resolver">resolver</Link> to pick any eight groups and see the resulting matchups.
  </p>
</div>

<style>
  .main-content {
    background-color: var(--wc-color-natural0);
    border-radius: var(--wc-radius);
    box-shadow: var(--wc-shadow);
    padding: var(--wc-space-lg);
    max-width: 960px;
    margin-left: auto;
    margin-right: auto;
  }

  blockquote {
    border: 1px solid var(--wc-color-natural100);
    border-left: 2px solid var(--wc-color-accent);
    padding: 0 var(--wc-space-lg) var(--wc-space-lg) var(--wc-space-lg);
    margin: var(--wc-space-sm) var(--wc-space-lg);
    position: relative;
    text-align: left;
  }

  blockquote::before {
    content: "\201c";
    display: block;
    font-size: 6rem;
    line-height: 1;
    text-indent: calc(var(--wc-space-lg) * -0.5);
    height: 2rem;
    color: var(--wc-color-natural200);
    font-family: Georgia, "Times New Roman", serif;
  }

  ol {
    list-style-type: lower-alpha;
  }

  li {
    margin-bottom: 0.25rem;
  }

  ol ul {
    list-style-type: disc;
  }

  p {
    margin-top: 0;
  }

  .legend {
    margin-bottom: var(--wc-space-lg);
  }

  mark {
    background-color: var(--wc-color-warning100);
    border-radius: var(--wc-radius);
    color: inherit;
    padding: 0.125rem 0.25rem;
  }
</style>
