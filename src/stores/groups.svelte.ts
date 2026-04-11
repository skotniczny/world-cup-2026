import type { MatchItem } from "../data/matches";
import type { TeamInfo } from "../data/teams";
import { type GroupName, getGroup } from "../data/groups";
import Group, { type TableRow } from "../Group";
import { type ThirdPlaces, createThirdPlaces } from "../ThirdPlacedRanking";
import { updateRoundOf32 } from "../RoundOf32Setup";

const groups: Record<GroupName, Group> = {
  A: new Group("A", getGroup("A")),
  B: new Group("B", getGroup("B")),
  C: new Group("C", getGroup("C")),
  D: new Group("D", getGroup("D")),
  E: new Group("E", getGroup("E")),
  F: new Group("F", getGroup("F")),
  G: new Group("G", getGroup("G")),
  H: new Group("H", getGroup("H")),
  I: new Group("I", getGroup("I")),
  J: new Group("J", getGroup("J")),
  K: new Group("K", getGroup("K")),
  L: new Group("L", getGroup("L")),
};

export type GroupsData = Record<GroupName, { name: string; table: TableRow[]; hasUnresolvedTies: boolean }>;

export const groupsData: GroupsData = $state({
  A: { name: groups.A.name, table: groups.A.table, hasUnresolvedTies: groups.A.hasUnresolvedTies },
  B: { name: groups.B.name, table: groups.B.table, hasUnresolvedTies: groups.B.hasUnresolvedTies },
  C: { name: groups.C.name, table: groups.C.table, hasUnresolvedTies: groups.C.hasUnresolvedTies },
  D: { name: groups.D.name, table: groups.D.table, hasUnresolvedTies: groups.D.hasUnresolvedTies },
  E: { name: groups.E.name, table: groups.E.table, hasUnresolvedTies: groups.E.hasUnresolvedTies },
  F: { name: groups.F.name, table: groups.F.table, hasUnresolvedTies: groups.F.hasUnresolvedTies },
  G: { name: groups.G.name, table: groups.G.table, hasUnresolvedTies: groups.G.hasUnresolvedTies },
  H: { name: groups.H.name, table: groups.H.table, hasUnresolvedTies: groups.H.hasUnresolvedTies },
  I: { name: groups.I.name, table: groups.I.table, hasUnresolvedTies: groups.I.hasUnresolvedTies },
  J: { name: groups.J.name, table: groups.J.table, hasUnresolvedTies: groups.J.hasUnresolvedTies },
  K: { name: groups.K.name, table: groups.K.table, hasUnresolvedTies: groups.K.hasUnresolvedTies },
  L: { name: groups.L.name, table: groups.L.table, hasUnresolvedTies: groups.L.hasUnresolvedTies },
});

export const thirdPlaces: ThirdPlaces = createThirdPlaces(groupsData);

export function getTeamAt(group: GroupName, position: number): TeamInfo {
  if (position < 1 || position > 4) throw Error("Argument exception, position is out of range");
  return groupsData[group].table[position - 1][0];
}

export function updateGroupScore(match: MatchItem): void {
  const { home, away, result, group } = match;

  if (!group || !result) return;

  const groupItem = groups[group];
  groupItem.setScore(home.abbreviation, away.abbreviation, result);
  groupsData[group] = { name: groupItem.name, table: groupItem.table, hasUnresolvedTies: groupItem.hasUnresolvedTies };

  updateRoundOf32();
}
