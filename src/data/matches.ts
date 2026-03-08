import MATCHES from "./matches.json" with { type: "json" };
import type { GroupName } from "./groups";
import type { TeamInfo } from "./teams";

export type Result = number | null;

export function sanitizeResult(value: Result): Result {
  if (value === null) return null;
  value = Math.trunc(value);
  return value < 0 ? 0 : value;
}

export type MatchItem = {
  id: number;
  datetime: string;
  group?: GroupName;
  stage: string;
  home: TeamInfo;
  away: TeamInfo;
  result?: [Result, Result];
  penalties?: [Result, Result];
  stadium: string;
  city: string;
  completed: boolean;
};

const matches: MatchItem[] = (MATCHES as unknown as MatchItem[]).map((item, index) => ({
  ...item,
  id: index + 1,
  completed: !!item.result,
}));

export const semiFinalsIds: readonly [number, number] = [101, 102];
export const thirdPlaceMatchId = 103;

export default matches;
