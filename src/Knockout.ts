import type { MatchItem } from "./data/matches";
import type { TeamInfo } from "./data/teams";
import { getTeam } from "./data/teams";
import type { Result } from "./Group";
import { findMatchById } from "./stores/matches.svelte";

const knockoutTree: Record<number, { next: number; slot: "home" | "away" }> = {
  // Round of 32
  73: { next: 89, slot: "home" },
  75: { next: 89, slot: "away" },

  74: { next: 90, slot: "home" },
  77: { next: 90, slot: "away" },

  83: { next: 93, slot: "home" },
  84: { next: 93, slot: "away" },

  81: { next: 94, slot: "home" },
  82: { next: 94, slot: "away" },

  76: { next: 91, slot: "home" },
  78: { next: 91, slot: "away" },

  79: { next: 92, slot: "home" },
  80: { next: 92, slot: "away" },

  86: { next: 95, slot: "home" },
  88: { next: 95, slot: "away" },

  85: { next: 96, slot: "home" },
  87: { next: 96, slot: "away" },

  // Round of 16
  89: { next: 97, slot: "home" },
  90: { next: 97, slot: "away" },

  93: { next: 98, slot: "home" },
  94: { next: 98, slot: "away" },

  91: { next: 99, slot: "home" },
  92: { next: 99, slot: "away" },

  95: { next: 100, slot: "home" },
  96: { next: 100, slot: "away" },

  // Quarter Finals
  97: { next: 101, slot: "home" },
  98: { next: 101, slot: "away" },

  99: { next: 102, slot: "home" },
  100: { next: 102, slot: "away" },

  // Semi Finals
  101: { next: 104, slot: "home" },
  102: { next: 104, slot: "away" },
};

function isFilled(result?: [Result, Result]): result is [number, number] {
  return !!result && result[0] !== null && result[1] !== null;
}

function rankTeams(match: MatchItem, [home, away]: [number, number]): [winner: TeamInfo, runner: TeamInfo] {
  return home > away ? [match.home, match.away] : [match.away, match.home]
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

function updateThirdPlace(match: MatchItem): void {
  const thirdPlaceSlot: Record<number, { slot: "home" | "away" }> = {
    101: { slot: "home" },
    102: { slot: "away" },
  };
  const next = thirdPlaceSlot[match.id];

  try {
    const thirdPlaceMatchId: number = 103;
    const thirdPlaceMatch: MatchItem = findMatchById(thirdPlaceMatchId);
    const matchLoserOrPlaceholder: TeamInfo = getTeamOrPlaceholder(match, "runner");
    thirdPlaceMatch[next.slot] = matchLoserOrPlaceholder;
  } catch (e) {
    console.error(e);
  }
}

export function updateKnockout(match: MatchItem): void {
  const firstKnockoutMatchId = 73;
  if (match.id < firstKnockoutMatchId) return;
  const next = knockoutTree[match.id];
  try {
    const nextMatch: MatchItem = findMatchById(next.next);
    const matchWinnerOrPlaceholder: TeamInfo = getTeamOrPlaceholder(match, "winner");
    nextMatch[next.slot] = matchWinnerOrPlaceholder;

    if ([101, 102].includes(match.id)) {
      updateThirdPlace(match);
    }
  } catch (e) {
    console.error(e);
  }
}
