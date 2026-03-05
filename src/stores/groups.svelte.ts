import type { MatchItem, TeamInfo } from "../data/matches";
import { getTeam } from "../data/teams";
import Group, { type TableRow } from "../Group";
import { updateRoundOf32 } from "../RoundOf32Setup";

import ThirdPlacedRanking from "../ThirdPlacedRanking";

export type GroupName = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";

const groups: Record<GroupName, Group> = {
  A: new Group("A", [getTeam("MEX"), getTeam("RSA"), getTeam("KOR"), getTeam("DEN/MKD/CZE/IRL")]),
  B: new Group("B", [getTeam("CAN"), getTeam("ITA/NIR/WAL/BIH"), getTeam("QAT"), getTeam("SUI")]),
  C: new Group("C", [getTeam("BRA"), getTeam("MAR"), getTeam("HAI"), getTeam("SCO")]),
  D: new Group("D", [getTeam("USA"), getTeam("PAR"), getTeam("AUS"), getTeam("TUR/ROU/SVK/KOS")]),
  E: new Group("E", [getTeam("GER"), getTeam("CUW"), getTeam("CIV"), getTeam("ECU")]),
  F: new Group("F", [getTeam("NED"), getTeam("JPN"), getTeam("UKR/SWE/POL/ALB"), getTeam("TUN")]),
  G: new Group("G", [getTeam("BEL"), getTeam("EGY"), getTeam("IRN"), getTeam("NZL")]),
  H: new Group("H", [getTeam("ESP"), getTeam("CPV"), getTeam("KSA"), getTeam("URU")]),
  I: new Group("I", [getTeam("FRA"), getTeam("SEN"), getTeam("BOL/SUR/IRQ"), getTeam("NOR")]),
  J: new Group("J", [getTeam("ARG"), getTeam("ALG"), getTeam("AUT"), getTeam("JOR")]),
  K: new Group("K", [getTeam("POR"), getTeam("NCL/JAM/COD"), getTeam("UZB"), getTeam("COL")]),
  L: new Group("L", [getTeam("ENG"), getTeam("CRO"), getTeam("GHA"), getTeam("PAN")]),
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
