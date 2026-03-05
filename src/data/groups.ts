import GROUPS_DATA from "./groups.json" with { type: "json" }
import type { TeamInfo } from "./teams"

export type GroupName = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";

export const groupNames = Object.keys(GROUPS_DATA) as GroupName[]

const groups = new Map<GroupName, TeamInfo[]>(Object.entries(GROUPS_DATA) as [GroupName, TeamInfo[]][])

export function getGroup(name: GroupName): TeamInfo[] {
  const group = groups.get(name)
  if (!group) throw new Error(`Group not found: "${name}"`)
  return group
}
