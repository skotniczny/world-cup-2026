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
    this.#table = this.#calculateTable().sort(this.#sortTable);
  }

  #calculateTable(): TableRow[] {
    return this.teams.map((team, teamIndex) => [team, ...this.#calculateRecord(teamIndex)]);
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
