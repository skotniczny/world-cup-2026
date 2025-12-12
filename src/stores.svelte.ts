import Group, { type Result, type TableRow } from "./Group";

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

export function updateScore(
  homeName: string,
  awayName: string,
  score: [home: Result, away: Result],
  groupLetter?: GroupName
): void {
  if (groupLetter && homeName && awayName) {
    const group: Group = groups[groupLetter];
    group.setScore(homeName, awayName, score);
    groupsData[groupLetter] = { name: group.name, table: group.table };
  }
}
