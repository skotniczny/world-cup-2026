import type { TeamInfo } from "./data/teams";
import type { GroupName } from "./data/groups";

// [Team, Matches Played, Goals For, Goals Against, Goal Difference, Points]
export type TableRow = [TeamInfo, number, number, number, number, number];
export type Result = number | null;

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
    const homeIndex: number = this.teams.findIndex((t) => t.abbreviation === homeAbbr);
    const awayIndex: number = this.teams.findIndex((t) => t.abbreviation === awayAbbr);
    if (homeIndex === -1 || awayIndex === -1) {
      throw new Error("Unknown team name");
    }
    if (homeIndex === awayIndex) {
      throw new Error("Team cannot play against itself");
    }
    const [scoreHome, scoreAway] = result;
    this.#results[homeIndex][awayIndex] = scoreHome;
    this.#results[awayIndex][homeIndex] = scoreAway;
    this.#table = this.#calculateTable().sort(this.#sortTable);
  }

  #calculateTable(): TableRow[] {
    return this.teams.map((team, index) => {
      const matchesPlayed: number = this.#matchesPlayed(index);
      const points: number = this.#sumPoints(index);
      const goalsFor: number = this.#goalsFor(index);
      const goalsAgainst: number = this.#goalsAgainst(index);
      const goalDifference: number = goalsFor - goalsAgainst;
      return [team, matchesPlayed, goalsFor, goalsAgainst, goalDifference, points];
    });
  }

  #sortTable = (a: TableRow, b: TableRow) => {
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

  #matchesPlayed(teamIndex: number): number {
    let count = 0;
    for (let i = 0; i < this.#results.length; i++) {
      if (i === teamIndex) continue;
      const home = this.#results[teamIndex][i];
      const away = this.#results[i][teamIndex];
      if (home != null && away != null) count++;
    }
    return count;
  }

  #goalsFor(rowIndex: number): number {
    return this.#results[rowIndex].reduce<number>((acc, score, columnIndex) => {
      if (rowIndex === columnIndex) return acc;
      return acc + (score ?? 0);
    }, 0);
  }

  #goalsAgainst(columnIndex: number): number {
    return this.#results.reduce<number>((acc, row, rowIndex) => {
      if (rowIndex === columnIndex) return acc;
      return acc + (row[columnIndex] ?? 0);
    }, 0);
  }

  #sumPoints(teamIndex: number): number {
    let points: number = 0;
    for (let index = 0; index < this.#results.length; index += 1) {
      if (teamIndex === index) continue;
      const home: Result = this.#results[teamIndex][index] ?? null;
      const away: Result = this.#results[index][teamIndex] ?? null;
      points += this.#getPoints(home, away);
    }
    return points;
  }

  #getPoints(scoreHome: Result, scoreAway: Result): number {
    if (scoreHome === null || scoreAway === null) return 0;
    if (scoreHome > scoreAway) return 3;
    if (scoreHome === scoreAway) return 1;
    return 0;
  }
}
