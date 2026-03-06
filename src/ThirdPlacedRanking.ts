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
  // 1. Points
  const pointsA = a[5];
  const pointsB = b[5];
  if (pointsB !== pointsA) return pointsB - pointsA;

  // 2. Goal Difference
  const goalDiffA = a[4];
  const goalDiffB = b[4];
  if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;

  // 3. Goals For
  const goalsForA = a[2];
  const goalsForB = b[2];
  if (goalsForA !== goalsForB) return goalsForB - goalsForA;
  return 0;
};
