import { type MatchItem, type Result } from "./data/matches";
import { type Slot, knockoutTreeFlat, semiFinalsIds, thirdPlaceMatchId } from "./data/knockoutTree";
import type { TeamInfo } from "./data/teams";
import { getTeam } from "./data/teams";
import { findMatchById, updateMatchScore, updateMatchTeam } from "./stores/matches.svelte";

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

function updateNextRound(nextId: number, slot: Slot, team: TeamInfo): void {
  if (findMatchById(nextId)[slot].abbreviation !== team.abbreviation) {
    updateMatchTeam({ id: nextId, [slot]: team });
    updateMatchScore({ id: nextId, result: undefined, penalties: undefined });
  }
}

export function updateKnockout(match: MatchItem): void {
  if (match.group) return;

  const next = knockoutTreeFlat[match.id];
  if (!next) return;

  updateNextRound(next.next, next.slot, getTeamOrPlaceholder(match, "winner"));

  if (semiFinalsIds.includes(match.id)) {
    updateNextRound(thirdPlaceMatchId, next.slot, getTeamOrPlaceholder(match, "runner"));
  }
}
