// Matchup rules for 8 advancing third-placed teams to their round-of-32 opponents.
// Source: FIFA World Cup 2026 regulations.
import THIRD_PLACE_MATCHUPS from "./data/thirdPlaceMatchups.json" assert { type: "json" };

import { type GroupName, getTeamAt, thirdPlaces } from "./stores/groups.svelte";
import { findFlag } from "./data/matches";
import { findMatchById } from "./stores/matches.svelte";

type GroupSlot = { group: GroupName; position: number };
type ThirdPlaceSlot = { thirdPlaceIndex: number; position: 3 };
type Slot = GroupSlot | ThirdPlaceSlot;

const thirdPlaceMatchups: Readonly<Record<string, string>> = THIRD_PLACE_MATCHUPS;

const roundOf32Slots = new Map<number, { home: GroupSlot; away: Slot }>([
  [74, { home: { group: "C", position: 1 }, away: { group: "F", position: 2 } }],
  [76, { home: { group: "F", position: 1 }, away: { group: "C", position: 2 } }],
  [83, { home: { group: "H", position: 1 }, away: { group: "J", position: 2 } }],
  [87, { home: { group: "J", position: 1 }, away: { group: "H", position: 2 } }],
  [73, { home: { group: "A", position: 2 }, away: { group: "B", position: 2 } }],
  [77, { home: { group: "E", position: 2 }, away: { group: "I", position: 2 } }],
  [84, { home: { group: "K", position: 2 }, away: { group: "L", position: 2 } }],
  [86, { home: { group: "D", position: 2 }, away: { group: "G", position: 2 } }],
  [79, { home: { group: "A", position: 1 }, away: { thirdPlaceIndex: 0, position: 3 } }],
  [85, { home: { group: "B", position: 1 }, away: { thirdPlaceIndex: 1, position: 3 } }],
  [82, { home: { group: "D", position: 1 }, away: { thirdPlaceIndex: 2, position: 3 } }],
  [75, { home: { group: "E", position: 1 }, away: { thirdPlaceIndex: 3, position: 3 } }],
  [81, { home: { group: "G", position: 1 }, away: { thirdPlaceIndex: 4, position: 3 } }],
  [78, { home: { group: "I", position: 1 }, away: { thirdPlaceIndex: 5, position: 3 } }],
  [88, { home: { group: "K", position: 1 }, away: { thirdPlaceIndex: 6, position: 3 } }],
  [80, { home: { group: "L", position: 1 }, away: { thirdPlaceIndex: 7, position: 3 } }],
]);

function resolveSlot(slot: Slot): string {
  if ("group" in slot) return getTeamAt(slot.group, slot.position);

  const advancingGroups = thirdPlaces.advancingGroups;
  const matchupValue = thirdPlaceMatchups[advancingGroups];
  if (!matchupValue) throw new Error(`No third-place matchup found for advancing groups: "${advancingGroups}"`);

  const group = matchupValue[slot.thirdPlaceIndex] as GroupName;
  return getTeamAt(group, slot.position);
}

export function updateRoundOf32(): void {
  for (const [id, { home, away }] of roundOf32Slots) {
    const match = findMatchById(id);
    match.home = resolveSlot(home);
    match.homeFlag = findFlag(match.home);
    match.away = resolveSlot(away);
    match.awayFlag = findFlag(match.away);
  }
}
