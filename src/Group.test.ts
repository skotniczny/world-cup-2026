import { describe, expect, test } from "vitest";
import Group from "./Group";
import type { GroupName } from "./data/groups";
import { getGroup } from "./data/groups";

const nameA: GroupName = "A";
const nameB: GroupName = "B";
const teamsA = getGroup(nameA);
const teamsB = getGroup(nameB);
const [mexico, southAfrica, korea, czechia] = teamsA.map((t) => t.abbreviation);
const [canada, ...otherBTeams] = teamsB.map((t) => t.abbreviation);

describe("Group", () => {
  describe("constructor", () => {
    test("should throw an error when group has more than 4 teams", () => {
      expect(() => new Group(nameA, [...teamsA, teamsB[0]])).toThrow("Require 4 Teams");
    });

    test("should throw an error when group has less than 4 teams", () => {
      expect(() => new Group(nameA, teamsA.slice(0, 3))).toThrow("Require 4 Teams");
    });

    test("should initialize all teams with zero stats", () => {
      const groupA = new Group(nameA, teamsA);
      expect(groupA.table[0]).toEqual([teamsA[0], 0, 0, 0, 0, 0]);
      expect(groupA.table[1]).toEqual([teamsA[1], 0, 0, 0, 0, 0]);
      expect(groupA.table[2]).toEqual([teamsA[2], 0, 0, 0, 0, 0]);
      expect(groupA.table[3]).toEqual([teamsA[3], 0, 0, 0, 0, 0]);
    });

    test("should set group name with prefix", () => {
      const groupA = new Group(nameA, teamsA);
      expect(groupA.name).toBe("Group A");
    });
  });

  describe("setScore", () => {
    test("should throw an error when a team plays against itself", () => {
      const groupA = new Group(nameA, teamsA);
      expect(() => groupA.setScore(mexico, mexico, [0, 0])).toThrow("Team cannot play against itself");
    });

    test("should throw an error when a team does not exist in the group", () => {
      const groupA = new Group(nameA, teamsA);
      expect(() => groupA.setScore(mexico, canada, [0, 0])).toThrow("Unknown team name");
    });

    test("should update team stats after setting a match score", () => {
      const groupA = new Group(nameA, teamsA);
      groupA.setScore(mexico, southAfrica, [4, 1]);
      expect(groupA.table[0]).toEqual([teamsA[0], 1, 4, 1, 3, 3]);
      expect(groupA.table[3]).toEqual([teamsA[1], 1, 1, 4, -3, 0]);
    });

    test("should award 1 point to each team after a draw", () => {
      const groupA = new Group(nameA, teamsA);
      groupA.setScore(mexico, southAfrica, [2, 2]);
      expect(groupA.table[0][5]).toBe(1);
      expect(groupA.table[1][5]).toBe(1);
    });

    test("should award 0 points to the losing team", () => {
      const groupA = new Group(nameA, teamsA);
      groupA.setScore(mexico, southAfrica, [0, 3]);
      expect(groupA.table[3][5]).toBe(0);
    });

    test("should accumulate 9 points after 3 wins as home", () => {
      const groupB = new Group(nameB, teamsB);

      groupB.setScore(canada, otherBTeams[0], [1, 0]);
      groupB.setScore(canada, otherBTeams[1], [2, 0]);
      groupB.setScore(canada, otherBTeams[2], [3, 0]);

      expect(groupB.table[0][5]).toBe(9);
    });

    test("should accumulate 9 points after 3 wins as away", () => {
      const groupB = new Group(nameB, teamsB);

      groupB.setScore(otherBTeams[0], canada, [0, 1]);
      groupB.setScore(otherBTeams[1], canada, [0, 2]);
      groupB.setScore(otherBTeams[2], canada, [0, 3]);

      expect(groupB.table[0][5]).toBe(9);
    });

    test("should accumulate 7 goals for", () => {
      const groupB = new Group(nameB, teamsB);

      groupB.setScore(canada, otherBTeams[0], [1, 0]);
      groupB.setScore(canada, otherBTeams[1], [2, 0]);
      groupB.setScore(canada, otherBTeams[2], [4, 0]);

      expect(groupB.table[0][2]).toBe(7);
    });

    test("should accumulate 6 goals against", () => {
      const groupB = new Group(nameB, teamsB);

      groupB.setScore(canada, otherBTeams[0], [0, 1]);
      groupB.setScore(canada, otherBTeams[1], [0, 2]);
      groupB.setScore(canada, otherBTeams[2], [0, 3]);

      expect(groupB.table[3][3]).toBe(6);
    });

    test("should reset table to initial state after removing a result", () => {
      const groupA = new Group(nameA, teamsA);
      const initialTable = groupA.table.map((row) => [...row]);

      groupA.setScore(mexico, southAfrica, [3, 1]);

      expect(groupA.table[0]).toEqual([teamsA[0], 1, 3, 1, 2, 3]);
      expect(groupA.table[3]).toEqual([teamsA[1], 1, 1, 3, -2, 0]);

      groupA.setScore(mexico, southAfrica, [null, null]);

      for (let i = 0; i < initialTable.length; i++) {
        expect(groupA.table[i]).toEqual(initialTable[i]);
      }
    });
  });

  describe("table sorting", () => {
    test("unique points — ranked by points descending", () => {
      // MEX 9pts, RSA 6pts, KOR 3pts, CZE 0pts
      const group = new Group(nameA, teamsA);
      group.setScore(mexico, southAfrica, [1, 0]);
      group.setScore(mexico, korea, [1, 0]);
      group.setScore(mexico, czechia, [1, 0]);
      group.setScore(southAfrica, korea, [1, 0]);
      group.setScore(southAfrica, czechia, [1, 0]);
      group.setScore(korea, czechia, [1, 0]);

      expect(group.table[0][0].abbreviation).toBe(mexico);
      expect(group.table[0][5]).toBe(9);
      expect(group.table[1][0].abbreviation).toBe(southAfrica);
      expect(group.table[1][5]).toBe(6);
      expect(group.table[2][0].abbreviation).toBe(korea);
      expect(group.table[2][5]).toBe(3);
      expect(group.table[3][0].abbreviation).toBe(czechia);
      expect(group.table[3][5]).toBe(0);
    });

    test("tied on points — Step 1a: ranked by points in matches between the teams concerned", () => {
      // MEX 6pts, RSA 6pts — H2H: MEX beat RSA
      // KOR 3pts, CZE 3pts — H2H: CZE beat KOR
      const group = new Group(nameA, teamsA);
      group.setScore(mexico, southAfrica, [1, 0]); // MEX beats RSA
      group.setScore(mexico, korea, [0, 1]);
      group.setScore(mexico, czechia, [1, 0]);
      group.setScore(southAfrica, korea, [1, 0]);
      group.setScore(southAfrica, czechia, [1, 0]);
      group.setScore(korea, czechia, [0, 1]); // CZE beats KOR

      expect(group.table[0][0].abbreviation).toBe(mexico);
      expect(group.table[0][5]).toBe(6);
      expect(group.table[1][0].abbreviation).toBe(southAfrica);
      expect(group.table[1][5]).toBe(6);
      expect(group.table[2][0].abbreviation).toBe(czechia);
      expect(group.table[2][5]).toBe(3);
      expect(group.table[3][0].abbreviation).toBe(korea);
      expect(group.table[3][5]).toBe(3);
    });

    test("tied on points — Step 1b: ranked by goal difference in matches between the teams concerned", () => {
      // MEX, RSA, KOR all 6pts
      // H2H goal diff: MEX +1, RSA 0, KOR -1
      const group = new Group(nameA, teamsA);
      group.setScore(mexico, southAfrica, [2, 0]); // MEX beats RSA 2:0
      group.setScore(korea, mexico, [1, 0]); // KOR beats MEX 1:0
      group.setScore(southAfrica, korea, [2, 0]); // RSA beats KOR 2:0
      group.setScore(mexico, czechia, [1, 0]); // all beat CZE to equalize overall points
      group.setScore(southAfrica, czechia, [1, 0]);
      group.setScore(korea, czechia, [1, 0]);

      expect(group.table[0][0].abbreviation).toBe(mexico);
      expect(group.table[0][5]).toBe(6);
      expect(group.table[1][0].abbreviation).toBe(southAfrica);
      expect(group.table[1][5]).toBe(6);
      expect(group.table[2][0].abbreviation).toBe(korea);
      expect(group.table[2][5]).toBe(6);
      expect(group.table[3][0].abbreviation).toBe(czechia);
      expect(group.table[3][5]).toBe(0);
    });

    test("tied on points — Step 1c: ranked by goals scored in matches between the teams concerned", () => {
      // MEX, RSA, KOR all 6pts — equal H2H goal diff (all 0)
      // H2H goals scored: KOR 6, MEX 5, RSA 4
      const group = new Group(nameA, teamsA);
      group.setScore(mexico, southAfrica, [2, 1]); // MEX beats RSA 2:1
      group.setScore(korea, mexico, [4, 3]); // KOR beats MEX 4:3
      group.setScore(southAfrica, korea, [3, 2]); // RSA beats KOR 3:2
      group.setScore(mexico, czechia, [1, 0]); // all beat CZE to equalize overall points
      group.setScore(southAfrica, czechia, [1, 0]);
      group.setScore(korea, czechia, [1, 0]);

      expect(group.table[0][0].abbreviation).toBe(korea);
      expect(group.table[0][5]).toBe(6);
      expect(group.table[1][0].abbreviation).toBe(mexico);
      expect(group.table[1][5]).toBe(6);
      expect(group.table[2][0].abbreviation).toBe(southAfrica);
      expect(group.table[2][5]).toBe(6);
      expect(group.table[3][0].abbreviation).toBe(czechia);
      expect(group.table[3][5]).toBe(0);
    });

    test("tied on points — Step 1 recursion: H2H partially resolves, sub-group resolved by direct result", () => {
      // MEX, RSA, KOR all 6pts. H2H within the three:
      // RSA and KOR look identical (3pts, GD 0, GF 3) → chunk → recurse on {RSA, KOR}
      // MEX ranked last by GF in H2H (GF 2)
      // In recursion on {RSA, KOR}: RSA beat KOR 3:1 → RSA above KOR by Step 1a
      const group = new Group(nameA, teamsA);
      group.setScore(mexico, southAfrica, [2, 0]); // MEX beats RSA
      group.setScore(korea, mexico, [2, 0]); // KOR beats MEX
      group.setScore(southAfrica, korea, [3, 1]); // RSA beats KOR — decisive in recursion
      group.setScore(mexico, czechia, [1, 0]); // all beat CZE to equalize overall points
      group.setScore(southAfrica, czechia, [1, 0]);
      group.setScore(korea, czechia, [1, 0]);

      expect(group.table[0][0].abbreviation).toBe(southAfrica);
      expect(group.table[0][5]).toBe(6);
      expect(group.table[1][0].abbreviation).toBe(korea);
      expect(group.table[1][5]).toBe(6);
      expect(group.table[2][0].abbreviation).toBe(mexico);
      expect(group.table[2][5]).toBe(6);
      expect(group.table[3][0].abbreviation).toBe(czechia);
      expect(group.table[3][5]).toBe(0);
    });

    test("tied on points — Step 2d: ranked by goal difference in all group stage matches", () => {
      // MEX, RSA, KOR all 6pts — circular H2H all 1:0 (equal pts, GD, GF in H2H)
      // Overall GD: MEX +3, RSA +2, KOR +1
      const group = new Group(nameA, teamsA);
      group.setScore(mexico, southAfrica, [1, 0]); // circular H2H, all 1:0
      group.setScore(southAfrica, korea, [1, 0]);
      group.setScore(korea, mexico, [1, 0]);
      group.setScore(mexico, czechia, [3, 0]); // different margins vs CZE to create GD spread
      group.setScore(southAfrica, czechia, [2, 0]);
      group.setScore(korea, czechia, [1, 0]);

      const [
        [team1, , , , goalDiff1, points1],
        [team2, , , , goalDiff2, points2],
        [team3, , , , goalDiff3, points3],
        [team4, , , , , points4],
      ] = group.table;
      expect(team1.abbreviation).toBe(mexico);
      expect(goalDiff1).toBe(3);
      expect(points1).toBe(6);
      expect(team2.abbreviation).toBe(southAfrica);
      expect(goalDiff2).toBe(2);
      expect(points2).toBe(6);
      expect(team3.abbreviation).toBe(korea);
      expect(goalDiff3).toBe(1);
      expect(points3).toBe(6);
      expect(team4.abbreviation).toBe(czechia);
      expect(points4).toBe(0);
    });

    test("tied on points — Step 2e: ranked by goals scored in all group stage matches", () => {
      // MEX, RSA, KOR all 6pts — circular H2H all 1:0
      // Overall GD all equal (+1) — Overall GF: KOR 5, RSA 4, MEX 3
      const group = new Group(nameA, teamsA);
      group.setScore(mexico, southAfrica, [1, 0]); // circular H2H, all 1:0
      group.setScore(southAfrica, korea, [1, 0]);
      group.setScore(korea, mexico, [1, 0]);
      group.setScore(mexico, czechia, [2, 1]); // same GD (+1), different GF vs CZE
      group.setScore(southAfrica, czechia, [3, 2]);
      group.setScore(korea, czechia, [4, 3]);

      const [
        [team1, , goalsFor1, , goalDiff1, points1],
        [team2, , goalsFor2, , goalDiff2, points2],
        [team3, , goalsFor3, , goalDiff3, points3],
        [team4, , , , , points4],
      ] = group.table;
      expect(team1.abbreviation).toBe(korea);
      expect(goalsFor1).toBe(5);
      expect(goalDiff1).toBe(1);
      expect(points1).toBe(6);
      expect(team2.abbreviation).toBe(southAfrica);
      expect(goalsFor2).toBe(4);
      expect(goalDiff2).toBe(1);
      expect(points2).toBe(6);
      expect(team3.abbreviation).toBe(mexico);
      expect(goalsFor3).toBe(3);
      expect(goalDiff3).toBe(1);
      expect(points3).toBe(6);
      expect(team4.abbreviation).toBe(czechia);
      expect(points4).toBe(0);
    });
  });
});
