import type { MatchItem } from "./data/matches";
import Group, { type TableRow } from "./Group";
import matches from "./data/matches";

export type GroupName = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";

const groups: Record<GroupName, Group> = {
  A: new Group("A", ["Mexico", "South Africa", "Korea Republic", "DEN/MKD/CZE/IRL"]),
  B: new Group("B", ["Canada", "ITA/NRL/WAL/BIH", "Qatar", "Switzerland"]),
  C: new Group("C", ["Brazil", "Morocco", "Haiti", "Scotland"]),
  D: new Group("D", ["USA", "Paraguay", "Australia", "TUR/ROU/SVK/KOS"]),
  E: new Group("E", ["Germany", "Curaçao", "Côte d'Ivoire", "Ecuador"]),
  F: new Group("F", ["Netherlands", "Japan", "UKR/SWE/POL/ALB", "Tunisia"]),
  G: new Group("G", ["Belgium", "Egypt", "IR Iran", "New Zealand"]),
  H: new Group("H", ["Spain", "Cabo Verde", "Saudi Arabia", "Uruguay"]),
  I: new Group("I", ["France", "Senegal", "BOL/SUR/IRQ", "Norway"]),
  J: new Group("J", ["Argentina", "Algeria", "Austria", "Jordan"]),
  K: new Group("K", ["Portugal", "NCL/JAM/COD", "Uzbekistan", "Colombia"]),
  L: new Group("L", ["England", "Croatia", "Ghana", "Panama"]),
};

export const groupsData: Record<GroupName, { name: string; table: TableRow[] }> = $state({
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

export function updateGroupScore(match: MatchItem): void {
  const { home, away, result, group } = match;

  if (group && home && away && result) {
    const groupItem: Group = groups[group];
    groupItem.setScore(home, away, result);
    groupsData[group] = { name: groupItem.name, table: groupItem.table };
  }
}

export const matchesData: MatchItem[] = $state(matches.map(match => ({ ...match })))

export function updateMatch(updatedMatch: MatchItem): void {
  const index = matchesData.findIndex(match => match.id === updatedMatch.id)
  if (index !== -1) {
    matchesData[index] = { ...updatedMatch }
  }
}

export function findMatchById(id: number):MatchItem {
  const match: MatchItem | undefined = matchesData.find(match => match.id === id)
  if (!match) throw Error(`Match ${id} not found`)
  return match
}

export function sortMatchesByDatetime() {
  matchesData.sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  )
}

export function sortMatchesByGroup() {
  matchesData.sort((a, b) => {
    const valA = a.group && a.group.length > 0 ? a.group : undefined
    const valB = b.group && b.group.length > 0 ? b.group : undefined
    if (valA === undefined && valB === undefined) return 0
    if (valA === undefined) return 1
    if (valB === undefined) return -1
    return valA.localeCompare(valB)
  })
}
