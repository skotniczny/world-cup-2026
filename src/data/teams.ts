import TEAMS_DATA from "./teams.json" with { type: "json" };

export type TeamInfo = {
  name: string;
  abbreviation: string;
  flag: string;
};

const teams = new Map<string, TeamInfo>(Object.entries(TEAMS_DATA));

export function getTeam(name: string): TeamInfo {
  const team = teams.get(name);
  if (!team) throw new Error(`Team not found: "${name}"`);
  return team;
}
