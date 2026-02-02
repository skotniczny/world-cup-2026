import { type MatchItem } from "./data/matches";
import { findMatchById } from "./stores.svelte";

const knockoutTree: Record<number, { next: number; slot: "home" | "away"; }> = {
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
}

function getTeamOrPlaceholder(match: MatchItem, type: "winner" | "runner") {
  const result = match.result;

  if (!result || result[0] === null || result[1] === null || result[0] === result[1]) {
    return type === "winner" ? `W${match.id}` : `RU${match.id}`;
  }
  const [scoreHome, scoreAway] = result
  if (type === "winner") {
    return scoreHome > scoreAway ? match.home : match.away;
  } else {
    return scoreHome < scoreAway ? match.home : match.away;
  }
}

function updateThirdPlace(match: MatchItem): void {
  const thirdPlaceSlot: Record<number, { slot: "home" | "away"; }> = {
    101: { slot: "home" },
    102: { slot: "away" },
  }
  const next = thirdPlaceSlot[match.id]

  try {
    const thirdPlaceMatchId: number = 103;
    const thirdPlaceMatch:MatchItem = findMatchById(thirdPlaceMatchId);
    const matchLoserOrPlaceholder:string = getTeamOrPlaceholder(match, "runner");
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
      const nextMatch:MatchItem = findMatchById(next.next);
      const matchWinnerOrPlaceholder:string = getTeamOrPlaceholder(match, "winner");
      nextMatch[next.slot] = matchWinnerOrPlaceholder;

      if ([101, 102].includes(match.id)) {
        updateThirdPlace(match);
      }
  } catch (e) {
    console.error(e);
  }
}