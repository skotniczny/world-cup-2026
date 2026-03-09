import { type MatchItem, type Result } from "./data/matches";
import { type Slot, knockoutTreeFlat, semiFinalsIds, thirdPlaceMatchId } from "./data/knockoutTree";
import type { TeamInfo } from "./data/teams";
import { getTeam } from "./data/teams";
import { updateMatchTeam } from "./stores/matches.svelte";

function isFilled(result?: [Result, Result]): result is [number, number] {
  return !!result && result[0] !== null && result[1] !== null;
}

function rankTeams(match: MatchItem, [home, away]: [number, number]): [winner: TeamInfo, runner: TeamInfo] {
  return home > away ? [match.home, match.away] : [match.away, match.home];
}

function getTeamOrPlaceholder(match: MatchItem, type: "winner" | "runner"): TeamInfo {
  const placeholder = type === "winner" ? `W${match.id}` : `RU${match.id}`;

  if (!isFilled(match.result)) return getTeam(placeholder);
  const [scoreHome, scoreAway] = match.result;
  if (scoreHome !== scoreAway) {
    const [winner, runner] = rankTeams(match, [scoreHome, scoreAway]);
    return type === "winner" ? winner : runner;
  }

  if (!isFilled(match.penalties)) return getTeam(placeholder);
  const [penHome, penAway] = match.penalties;
  if (penHome === penAway) return getTeam(placeholder);
  const [winner, runner] = rankTeams(match, [penHome, penAway]);
  return type === "winner" ? winner : runner;
}

function updateThirdPlace(match: MatchItem, slot: Slot): void {
  const matchLoserOrPlaceholder: TeamInfo = getTeamOrPlaceholder(match, "runner");
  updateMatchTeam({ id: thirdPlaceMatchId, [slot]: matchLoserOrPlaceholder });
}

export function updateKnockout(match: MatchItem): void {
  if (match.group) return;

  const next = knockoutTreeFlat[match.id];
  if (!next) return;

  const matchWinnerOrPlaceholder = getTeamOrPlaceholder(match, "winner");
  updateMatchTeam({ id: next.next, [next.slot]: matchWinnerOrPlaceholder });

  if (semiFinalsIds.includes(match.id)) {
    updateThirdPlace(match, next.slot);
  }
}
