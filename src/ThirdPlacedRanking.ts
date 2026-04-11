import type { TableRow } from "./Group";
import type { GroupsData } from "./stores/groups.svelte";
import { chunkBy } from "./utils/chunkBy";

const ADVANCING_THIRD_PLACES = 8;

export type ThirdPlacesTableRow = [...TableRow, group: string];

export interface ThirdPlaces {
  readonly table: ThirdPlacesTableRow[];
  readonly advancingGroups: string;
  readonly hasUnresolvedTies: boolean;
}

export function createThirdPlaces(data: GroupsData): ThirdPlaces {
  return {
    get table() {
      const thirdPlacedData: ThirdPlacesTableRow[] = Object
        .entries(data)
        .map(([groupKey, { table }]) => [...table[2], groupKey]);

      return thirdPlacedData.sort(sortThirdPlacedRanking);
    },
    get advancingGroups() {
      return this.table
        .slice(0, ADVANCING_THIRD_PLACES)
        .map(row => row[6])
        .sort()
        .join("");
    },
    get hasUnresolvedTies() {
      const sorted = this.table;
      const allMatchesPlayed = sorted.every(([, matchesPlayed]) => matchesPlayed === 3);
      if (!allMatchesPlayed) return false;
      return chunkBy([...sorted.keys()], (i) => {
        const [, , goalsFor, , goalDiff, points] = sorted[i];
        return `${points}_${goalDiff}_${goalsFor}`;
      }).some((subGroup) => subGroup.length > 1 && subGroup[0] < ADVANCING_THIRD_PLACES);
    },
  };
}

// FIFA World Cup 26 Regulations,
// Art. 13 — Equal points and qualification for knockout stages
// https://digitalhub.fifa.com/m/636f5c9c6f29771f/original/FWC2026_regulations_EN.pdf
const sortThirdPlacedRanking = (a: ThirdPlacesTableRow, b: ThirdPlacesTableRow) => {
  const [, , goalsForA, , goalDiffA, pointsA] = a;
  const [, , goalsForB, , goalDiffB, pointsB] = b;

  // a) Greatest number of points obtained in all group matches
  if (pointsB !== pointsA) return pointsB - pointsA;

  // b) Goal difference resulting from all group matches
  if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;

  // c) Greatest number of goals scored in all group matches
  if (goalsForB !== goalsForA) return goalsForB - goalsForA;

  // d) Highest team conduct score — out of scope (no card data in the simulator)
  // e) FIFA/Coca-Cola Men's World Ranking (most recent edition) — out of scope
  // f) FIFA/Coca-Cola Men's World Ranking (preceding editions) — out of scope
  return 0;
};
