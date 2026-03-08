import { type MatchItem, lastGroupMatchId } from "../data/matches";
import matches from "../data/matches";
import { updateGroupScore } from "./groups.svelte";
import { updateKnockout } from "../Knockout";

export const matchesData: MatchItem[] = $state(matches);

export function findMatchById(id: number): MatchItem {
  const match: MatchItem | undefined = matchesData.find((match) => match.id === id);
  if (!match) throw Error(`Match ${id} not found`);
  return match;
}

function updateStandings(match: MatchItem): void {
  if (match.id <= lastGroupMatchId) {
    updateGroupScore(match);
  } else {
    updateKnockout(match);
  }
}

type MatchScore = Pick<MatchItem, "id" | "result" | "penalties">;

export function updateMatchScore({ id, result, penalties }: MatchScore): void {
  const match = findMatchById(id);
  match.result = result;
  match.penalties = penalties;
  updateStandings(match);
}

export function initCompletedMatches(): void {
  for (const match of matchesData) {
    if (match.result && match.completed) {
      updateStandings(match);
    }
  }
}

export function sortMatchesByDatetime() {
  matchesData.sort((a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime());
}

export function sortMatchesByGroup() {
  matchesData.sort((a, b) => {
    if (!a.group && !b.group) return 0;
    if (!a.group) return 1;
    if (!b.group) return -1;
    return a.group.localeCompare(b.group);
  });
}
