import TEAMS_DATA from "./teams.json" assert { type: "json" }
import type { TeamInfo } from "./matches"

const teams = new Map<string, TeamInfo>(Object.entries(TEAMS_DATA))

export function getTeam(name: string): TeamInfo {
  const team = teams.get(name)
  if (!team) throw new Error(`Team not found: "${name}"`)
  return team
}
