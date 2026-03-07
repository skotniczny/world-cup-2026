import type { TeamInfo } from "./data/teams";
import type { GroupsData } from "./stores/groups.svelte";

const ADVANCING_THIRD_PLACES = 8;

export type ThirdPlacesTableRow = [TeamInfo, number, number, number, number, number, string];

export function getThirdPlacesTable(data: GroupsData): ThirdPlacesTableRow[] {
  const thirdPlacedData: ThirdPlacesTableRow[] = Object
    .entries(data)
    .map(([groupKey, { table }]) => [...table[2], groupKey]);

  return thirdPlacedData.sort(sortThirdPlacedRanking);
}

export function getAdvancingGroups(table: ThirdPlacesTableRow[]): string {
  return table
    .map((i) => i[6])
    .slice(0, ADVANCING_THIRD_PLACES)
    .sort()
    .join("");
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
