import { describe, expect, test } from "vitest";
import { encodeScores, decodeScores } from "./scoresCodec";
import type { MatchScore } from "../stores/matches.svelte";

const scores: MatchScore[] = [
  { id: 1, result: [2, 0] },
  { id: 2, result: [null, 1] },
  { id: 104, result: [3, 3], penalties: [3, 2] },
];

const encodedScores = "1.2-0_2.-1_104.3-3p3-2";

describe("round-trip", () => {
  test("decode(encode(scores)) returns original scores", () => {
    expect(decodeScores(encodeScores(scores))).toEqual(scores);
  });
});

describe("encodeScores", () => {
  test("encodes results into compact string", () => {
    expect(encodeScores(scores)).toBe(encodedScores);
  });

  test("encodes empty list into empty string", () => {
    expect(encodeScores([])).toBe("");
  });
});

describe("decodeScores", () => {
  test("decodes compact string back into match scores", () => {
    expect(decodeScores(encodedScores)).toEqual(scores);
  });

  test("decodes empty string into empty list", () => {
    expect(decodeScores("")).toEqual([]);
  });

  test("skips malformed entries and decodes valid ones", () => {
    expect(decodeScores("1.2-0_2.-1_.-_42.abc-def_43.-p-__")).toEqual([
      { id: 1, result: [2, 0] },
      { id: 2, result: [null, 1] },
      { id: 43, result: [null, null], penalties: [null, null] },
    ]);
  });
});
