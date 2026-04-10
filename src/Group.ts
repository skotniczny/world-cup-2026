import type { Result } from "./data/matches";
import type { TeamInfo } from "./data/teams";
import type { GroupName } from "./data/groups";

type TeamRecord = [
  matchesPlayed: number,
  goalsFor: number,
  goalsAgainst: number,
  goalDifference: number,
  points: number,
];

export type TableRow = [team: TeamInfo, ...record: TeamRecord];

// Input must be pre-sorted by key
function chunkBy(items: number[], key: (item: number) => number | string): number[][] {
  const groups: number[][] = [];
  for (const item of items) {
    const currentGroup = groups[groups.length - 1];
    if (currentGroup && key(currentGroup[0]) === key(item)) {
      currentGroup.push(item);
    } else {
      groups.push([item]);
    }
  }
  return groups;
}

export default class Group {
  readonly name: string;
  #results: (Result | undefined)[][] = [
    [undefined, null, null, null],
    [null, undefined, null, null],
    [null, null, undefined, null],
    [null, null, null, undefined],
  ];

  #table: TableRow[] = [];

  constructor(
    groupName: GroupName,
    readonly teams: TeamInfo[],
  ) {
    if (teams.length !== 4) throw new Error("Require 4 Teams");
    this.name = `Group ${groupName}`;
    this.#table = this.#calculateTable();
  }

  get table(): TableRow[] {
    return this.#table;
  }

  setScore(homeAbbr: string, awayAbbr: string, result: [home: Result, away: Result]): void {
    const homeIndex = this.teams.findIndex((t) => t.abbreviation === homeAbbr);
    const awayIndex = this.teams.findIndex((t) => t.abbreviation === awayAbbr);
    if (homeIndex === -1 || awayIndex === -1) {
      throw new Error("Unknown team name");
    }
    if (homeIndex === awayIndex) {
      throw new Error("Team cannot play against itself");
    }
    const [scoreHome, scoreAway] = result;
    this.#results[homeIndex][awayIndex] = scoreHome;
    this.#results[awayIndex][homeIndex] = scoreAway;
    this.#table = this.#sortTable(this.#calculateTable());
  }

  #calculateTable(): TableRow[] {
    return this.teams.map((team, teamIndex) => [team, ...this.#calculateRecord(teamIndex)]);
  }

  // FIFA World Cup 26 Regulations,
  // Art. 13 — Equal points and qualification for knockout stages
  // https://digitalhub.fifa.com/m/636f5c9c6f29771f/original/FWC2026_regulations_EN.pdf
  #sortTable(table: TableRow[]): TableRow[] {
    // Step 1: apply criteria 1/2/3 using only matches played between the teams concerned.
    // If a sub-group remains tied, recurse on that sub-group (smaller set of teams concerned).
    // If this yields no resolution at all, fall through to Step 2.
    const step1 = (group: number[]): number[] => {
      if (group.length === 1) return group;

      const opponents = (teamIndex: number) => group.filter((opponent) => opponent !== teamIndex);
      const recordBetweenTeamsConcerned = (teamIndex: number): TeamRecord =>
        this.#calculateRecord(teamIndex, opponents(teamIndex));

      const sorted = [...group].sort((teamA, teamB) => {
        const [, goalsForA, , goalDiffA, pointsA] = recordBetweenTeamsConcerned(teamA);
        const [, goalsForB, , goalDiffB, pointsB] = recordBetweenTeamsConcerned(teamB);

        // 1. Points obtained in the matches played between the teams concerned
        if (pointsB !== pointsA) return pointsB - pointsA;

        // 2. Goal difference resulting from the matches played between the teams concerned
        if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;

        // 3. Goals scored in the matches played between the teams concerned
        if (goalsForA !== goalsForB) return goalsForB - goalsForA;
        return 0;
      });

      // Teams with identical records between teams concerned — still tied after Step 1
      const subGroups = chunkBy(sorted, (teamIndex) => recordBetweenTeamsConcerned(teamIndex).join(","));

      return subGroups.flatMap((subGroup) => {
        if (subGroup.length === 1) return subGroup;
        // recurse only if the set of teams concerned narrowed; otherwise fall through to Step 2
        if (subGroup.length < group.length) return step1(subGroup);
        return step2(subGroup);
      });
    };

    // Step 2: apply criteria 4/5 using all group stage matches.
    // Does not restart after each criterion — remaining ties move directly to the next.
    const step2 = (group: number[]): number[] => {
      return [...group].sort((teamA, teamB) => {
        const [, , goalsForA, , goalDiffA] = table[teamA];
        const [, , goalsForB, , goalDiffB] = table[teamB];

        // 4. Goal difference in all group stage matches
        if (goalDiffB !== goalDiffA) return goalDiffB - goalDiffA;

        // 5. Goals scored in all group stage matches
        if (goalsForB !== goalsForA) return goalsForB - goalsForA;
        return 0;
      });
    };
    // 6. and beyond not implemented

    const sortedByPoints = [...table.keys()].sort((teamA, teamB) => table[teamB][5] - table[teamA][5]);
    const equalPointGroups = chunkBy(sortedByPoints, (teamIndex) => table[teamIndex][5]);
    return equalPointGroups.flatMap(step1).map((teamIndex) => table[teamIndex]);
  }

  #calculateRecord(rowIndex: number, against = [...this.teams.keys()].filter((i) => i !== rowIndex)): TeamRecord {
    let matchesPlayed = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;
    let points = 0;
    for (const columnIndex of against) {
      const home = this.#results[rowIndex][columnIndex];
      const away = this.#results[columnIndex][rowIndex];
      if (home != null && away != null) matchesPlayed++;
      goalsFor += home ?? 0;
      goalsAgainst += away ?? 0;
      points += this.#getPoints(home ?? null, away ?? null);
    }
    const goalDifference = goalsFor - goalsAgainst;
    return [matchesPlayed, goalsFor, goalsAgainst, goalDifference, points];
  }

  #getPoints(scoreHome: Result, scoreAway: Result): number {
    if (scoreHome === null || scoreAway === null) return 0;
    if (scoreHome > scoreAway) return 3;
    if (scoreHome === scoreAway) return 1;
    return 0;
  }
}
