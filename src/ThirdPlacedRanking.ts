import type { TeamInfo } from "./data/teams";
import type { GroupsData } from "./stores/groups.svelte";

const ADVANCING_THIRD_PLACES = 8;

export type ThirdPlacesTableRow = [TeamInfo, number, number, number, number, number, string];

export interface ThirdPlaces {
  readonly table: ThirdPlacesTableRow[];
  readonly advancingGroups: string;
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
  };
}

const sortThirdPlacedRanking = (a: ThirdPlacesTableRow, b: ThirdPlacesTableRow) => {
  const [, , goalsForA, , goalDiffA, pointsA] = a;
  const [, , goalsForB, , goalDiffB, pointsB] = b;

  // 1. Points
  if (pointsB !== pointsA) return pointsB - pointsA;

  // 2. Goal Difference
  if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;

  // 3. Goals For
  if (goalsForA !== goalsForB) return goalsForB - goalsForA;
  return 0;
};
