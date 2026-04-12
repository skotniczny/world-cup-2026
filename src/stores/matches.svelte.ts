import { type MatchItem } from "../data/matches";
import matches from "../data/matches";
import { updateGroupScore } from "./groups.svelte";
import { updateKnockout } from "../Knockout";
import { createStorage } from "../utils/storage";

export const matchesData: MatchItem[] = $state(matches);

export function findMatchById(id: number): MatchItem {
  const match: MatchItem | undefined = matchesData.find((match) => match.id === id);
  if (!match) throw Error(`Match ${id} not found`);
  return match;
}

function updateStandings(match: MatchItem): void {
  if (match.group) {
    updateGroupScore(match);
  } else {
    updateKnockout(match);
  }
}

export type MatchScore = Pick<MatchItem, "id" | "result" | "penalties">;
function applyMatchScore({ id, result, penalties }: MatchScore): void {
  const match = findMatchById(id);
  const isDraw = result && result[0] !== null && result[1] !== null && result[0] === result[1];
  match.result = result;
  match.penalties = !match.group && isDraw ? penalties : undefined;
  updateStandings(match);
}

export function updateMatchScore(score: MatchScore): void {
  applyMatchScore(score);
  saveResultsToStorage();
}

export function initGroupStandings(): void {
  for (const match of matchesData) {
    if (match.result && match.completed && match.group) {
      updateGroupScore(match);
    }
  }
}

type TeamUpdate = Pick<MatchItem, "id"> & Partial<Pick<MatchItem, "home" | "away">>;

export function updateMatchTeam({ id, home, away }: TeamUpdate): void {
  const match = findMatchById(id);
  if (home) match.home = home;
  if (away) match.away = away;
}

const storage = createStorage<MatchScore[]>("wc26-simulated-results", []);

function saveResultsToStorage(): void {
  const results: MatchScore[] = matchesData
    .filter((match) => !match.completed && match.result && (match.result[0] !== null || match.result[1] !== null))
    .map(({ id, result, penalties }) => ({ id, result, penalties }));
  storage.save(results);
}

export function loadResultsFromStorage(): void {
  for (const { id, result, penalties } of storage.load()) {
    const match = matchesData.find((match) => match.id === id);
    if (match && !match.completed) applyMatchScore({ id, result, penalties });
  }
}
