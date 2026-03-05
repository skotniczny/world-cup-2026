import type { MatchItem, TeamInfo } from "../data/matches";
import { type GroupName, getGroup } from "../data/groups";
import Group, { type TableRow } from "../Group";
import ThirdPlacedRanking from "../ThirdPlacedRanking";
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

export type GroupsData = Record<GroupName, { name: string; table: TableRow[] }>

export const groupsData:GroupsData = $state({
  A: { name: groups.A.name, table: groups.A.table },
  B: { name: groups.B.name, table: groups.B.table },
  C: { name: groups.C.name, table: groups.C.table },
  D: { name: groups.D.name, table: groups.D.table },
  E: { name: groups.E.name, table: groups.E.table },
  F: { name: groups.F.name, table: groups.F.table },
  G: { name: groups.G.name, table: groups.G.table },
  H: { name: groups.H.name, table: groups.H.table },
  I: { name: groups.I.name, table: groups.I.table },
  J: { name: groups.J.name, table: groups.J.table },
  K: { name: groups.K.name, table: groups.K.table },
  L: { name: groups.L.name, table: groups.L.table },
});

export const thirdPlaces = new ThirdPlacedRanking(groupsData);

export function getTeamAt(group: GroupName, position: number): TeamInfo {
  if (position < 1 || position > 4) throw Error("Argument exception, position is out of range")
  return groupsData[group].table[position - 1][0];
}

export function updateGroupScore(match: MatchItem): void {
  const { home, away, result, group } = match;

  if (!group || !result) return;

  const groupItem = groups[group];
  groupItem.setScore(home.abbreviation, away.abbreviation, result);
  groupsData[group] = { name: groupItem.name, table: groupItem.table };

  updateRoundOf32();
}
