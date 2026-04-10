import { describe, expect, test } from "vitest";
import Group from "./Group";
import type { GroupName } from "./data/groups";
import { getGroup } from "./data/groups";

const nameA: GroupName = "A";
const nameB: GroupName = "B";
const teamsA = getGroup(nameA);
const teamsB = getGroup(nameB);
const [mexico, southAfrica] = teamsA.map((t) => t.abbreviation);
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
});
