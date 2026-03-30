// Matchup rules for 8 advancing third-placed teams to their round-of-32 opponents.
// Source: FIFA World Cup 2026 regulations.
import THIRD_PLACE_MATCHUPS from "./thirdPlaceMatchups.json" with { type: "json" };

const thirdPlaceMatchups: Readonly<Record<string, string>> = THIRD_PLACE_MATCHUPS;

export function getThirdPlaceMatchup(advancingGroups: string): string {
  const matchupValue = thirdPlaceMatchups[advancingGroups];
  if (!matchupValue) throw new Error(`No third-place matchup found for advancing groups: "${advancingGroups}"`);
  return matchupValue;
}
