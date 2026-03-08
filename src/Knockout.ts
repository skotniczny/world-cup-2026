import { type MatchItem, type Result, semiFinalsIds, thirdPlaceMatchId } from "./data/matches";
import type { TeamInfo } from "./data/teams";
import { getTeam } from "./data/teams";
import { updateMatchTeam } from "./stores/matches.svelte";

type Slot = "home" | "away";

const knockoutTree: Record<number, { next: number; slot: Slot }> = {
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

const thirdPlaceSlot: Record<number, { slot: Slot }> = {
  101: { slot: "home" },
  102: { slot: "away" },
};

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

function updateThirdPlace(match: MatchItem): void {
  const next = thirdPlaceSlot[match.id];

  const matchLoserOrPlaceholder: TeamInfo = getTeamOrPlaceholder(match, "runner");
  updateMatchTeam({ id: thirdPlaceMatchId, [next.slot]: matchLoserOrPlaceholder });
}

export function updateKnockout(match: MatchItem): void {
  if (match.group) return;

  const next = knockoutTree[match.id];
  if (!next) return;

  const matchWinnerOrPlaceholder = getTeamOrPlaceholder(match, "winner");
  updateMatchTeam({ id: next.next, [next.slot]: matchWinnerOrPlaceholder });

  if (semiFinalsIds.includes(match.id)) {
    updateThirdPlace(match);
  }
}
