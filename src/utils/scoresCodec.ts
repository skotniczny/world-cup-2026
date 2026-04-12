import type { MatchScore } from "../stores/matches.svelte";
import type { Result } from "../data/matches";

function parseScore(encodedResult: string): [Result, Result] {
  const parse = (s: string) => (s === "" ? null : parseInt(s, 10));
  const [home, away] = encodedResult.split("-").map(parse);
  return [home, away];
}

export function encodeScores(results: MatchScore[]): string {
  const encoded = results.map(({ id, result, penalties }) => {
    const encodedResult = result ? `${result[0] ?? ""}-${result[1] ?? ""}` : "";
    const encodedPenalties = penalties ? `p${penalties[0] ?? ""}-${penalties[1] ?? ""}` : "";
    return `${id}.${encodedResult}${encodedPenalties}`;
  });
  return encoded.join("_");
}

const ENTRY_PATTERN = /^\d+\.\d*-\d*(p\d*-\d*)?$/;

export function decodeScores(encoded: string): MatchScore[] {
  const decoded: MatchScore[] = [];
  for (const encodedMatchScore of encoded.split("_")) {
    if (!ENTRY_PATTERN.test(encodedMatchScore)) continue;
    const [encodedId, encodedScores] = encodedMatchScore.split(".");
    const id = parseInt(encodedId, 10);

    const [encodedResult, encodedPenalties] = encodedScores.split("p");
    const result = encodedResult ? parseScore(encodedResult) : undefined;
    const penalties = encodedPenalties ? parseScore(encodedPenalties) : undefined;
    decoded.push({
      id,
      result,
      penalties,
    });
  }
  return decoded;
}
