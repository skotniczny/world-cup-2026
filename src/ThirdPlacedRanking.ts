import type { GroupsData } from "./stores.svelte";

export type ThirdPlacesTableRow = [string, number, number, number, string];

export default class ThirdPlacedRanking {
  #data: GroupsData
  constructor(source: GroupsData) {
    this.#data = source
  }

  get table() { 
    const thirdPlacedData:ThirdPlacesTableRow[] = Object
      .entries(this.#data)
      .map(([groupKey, { table }]) => [...table[2], groupKey]);

      return thirdPlacedData.sort(sortThirdPlacedRanking);
    }
  
  get advancingGroups() {
    return this.table.map(i => i[4]).slice(0, 8).sort().join("");
  }
}

const sortThirdPlacedRanking = (a:ThirdPlacesTableRow, b:ThirdPlacesTableRow) => {
  // 1. Points
  const pointsA = a[1];
  const pointsB = b[1];
  if (pointsB !== pointsA) return pointsB - pointsA;

  // 2. Goal Difference
  const goalDiffA = a[2] - a[3];
  const goalDiffB = b[2] - b[3];
  if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;

  // 3. Goals For
  const goalsForA = a[2];
  const goalsForB = b[2];
  if (goalsForA !== goalsForB) return goalsForB - goalsForA;
  return 0;
};