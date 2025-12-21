export type TableRow = [string, number, number, number];
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

  constructor(groupName: string, readonly teams: string[]) {
    if (teams.length !== 4) throw new Error("Require 4 Teams");
    this.name = `Group ${groupName}`;
    this.#table = this.#calculateTable()
  }

  get table(): TableRow[] {
    return this.#table
  }

  setScore(homeName: string, awayName: string, result: [home: Result, away: Result]): void {
    const homeIndex: number = this.teams.indexOf(homeName)
    const awayIndex: number = this.teams.indexOf(awayName)
    if (homeIndex === -1 || awayIndex === -1) {
      throw new Error("Unknown team name");
    }
    if (homeIndex === awayIndex) {
      throw new Error("Team cannot play against itself");
    } 
    const [scoreHome, scoreAway] = result;
    if (scoreHome == null && scoreAway == null) return
    if (scoreHome != null) {
      this.#results[homeIndex][awayIndex] = scoreHome
    }
    if (scoreAway != null) {
      this.#results[awayIndex][homeIndex] = scoreAway
    }
    this.#table = this.#calculateTable().sort(this.#sortTable)
  }

  #calculateTable(): TableRow[] {
    return this.teams.map((team, index) => {
      const points: number = this.#sumPoints(index);
      const goalsFor: number = this.#goalsFor(index);
      const goalsAgainst: number = this.#goalsAgainst(index);
      return [team, points, goalsFor, goalsAgainst];
    });
  }

  #sortTable = (a:TableRow, b:TableRow) => {
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
      if (teamIndex == index) continue;
      const home: Result = this.#results[teamIndex][index] ?? null;
      const away: Result = this.#results[index][teamIndex] ?? null;
      points += this.#getPoints(home, away);
    }
    return points;
  }

  #getPoints(scoreHome: Result, scoreAway: Result): number {
    if (scoreHome === null || scoreAway === null) return 0
    if (scoreHome > scoreAway) return 3;
    if (scoreHome === scoreAway) return 1;
    return 0;
  }
}
