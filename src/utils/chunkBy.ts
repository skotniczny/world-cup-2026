// Input must be pre-sorted by key
export function chunkBy(items: number[], key: (item: number) => number | string): number[][] {
  const groups: number[][] = [];
  for (const item of items) {
    const currentGroup = groups[groups.length - 1];
    if (currentGroup && key(currentGroup[0]) === key(item)) {
      currentGroup.push(item);
    } else {
      groups.push([item]);
    }
  }
  return groups;
}
