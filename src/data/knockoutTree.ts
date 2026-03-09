export type Slot = "home" | "away";

type TreeNode = {
  matchId: number;
  home?: TreeNode;
  away?: TreeNode;
};

const knockoutTree: Required<TreeNode> = {
  matchId: 104,
  home: {
    matchId: 101,
    home: {
      matchId: 97,
      home: {
        matchId: 89,
        home: { matchId: 73 },
        away: { matchId: 75 },
      },
      away: {
        matchId: 90,
        home: { matchId: 74 },
        away: { matchId: 77 },
      },
    },
    away: {
      matchId: 98,
      home: {
        matchId: 93,
        home: { matchId: 83 },
        away: { matchId: 84 },
      },
      away: {
        matchId: 94,
        home: { matchId: 81 },
        away: { matchId: 82 },
      },
    },
  },
  away: {
    matchId: 102,
    home: {
      matchId: 99,
      home: {
        matchId: 91,
        home: { matchId: 76 },
        away: { matchId: 78 },
      },
      away: {
        matchId: 92,
        home: { matchId: 79 },
        away: { matchId: 80 },
      },
    },
    away: {
      matchId: 100,
      home: {
        matchId: 95,
        home: { matchId: 86 },
        away: { matchId: 88 },
      },
      away: {
        matchId: 96,
        home: { matchId: 85 },
        away: { matchId: 87 },
      },
    },
  },
};

type KnockoutFlatMap = Record<number, { next: number; slot: Slot }>;


function buildFlatTree(
  node: TreeNode,
  map: KnockoutFlatMap = {},
): KnockoutFlatMap {
  for (const slot of ["home", "away"] as const) {
    const child = node[slot];
    if (child) {
      map[child.matchId] = { next: node.matchId, slot };
      buildFlatTree(child, map);
    }
  }
  return map;
}

type BracketLevels = [sf: number[], qf: number[], r16: number[], r32: number[]];

function collectIdsByLevel(node: TreeNode): BracketLevels {
  const levels: number[][] = [];
  let current: TreeNode[] = [node];
  while (current.length > 0) {
    levels.push(current.map((n) => n.matchId));
    const next: TreeNode[] = [];
    for (const n of current) {
      if (n.home) next.push(n.home);
      if (n.away) next.push(n.away);
    }
    current = next;
  }
  if (levels.length !== 4) {
    throw new Error(`Expected 4 bracket levels, got ${levels.length}`);
  }
  return levels as BracketLevels;
}

export const thirdPlaceMatchId = 103;
export const semiFinalsIds: readonly [number, number] = [knockoutTree.home.matchId, knockoutTree.away.matchId];
export const knockoutTreeFlat: KnockoutFlatMap = buildFlatTree(knockoutTree);

const [leftSf, leftQf, leftRoundOf16, leftRoundOf32] = collectIdsByLevel(knockoutTree.home);
const [rightSf, rightQf, rightRoundOf16, rightRoundOf32] = collectIdsByLevel(knockoutTree.away);

export const knockoutMatchesByRound = {
  leftRoundOf32,
  leftRoundOf16,
  leftQf,
  leftSf,
  rightRoundOf32,
  rightRoundOf16,
  rightQf,
  rightSf,
  final: knockoutTree.matchId,
  thirdPlace: thirdPlaceMatchId,
};
