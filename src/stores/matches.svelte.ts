import type { MatchItem } from "../data/matches";
import matches from "../data/matches";

export const matchesData: MatchItem[] = $state(matches.map(match => ({ ...match })))

export function updateMatch(updatedMatch: MatchItem): void {
  const index = matchesData.findIndex(match => match.id === updatedMatch.id)
  if (index !== -1) {
    matchesData[index] = { ...updatedMatch }
  }
}

export function findMatchById(id: number):MatchItem {
  const match: MatchItem | undefined = matchesData.find(match => match.id === id)
  if (!match) throw Error(`Match ${id} not found`)
  return match
}

export function sortMatchesByDatetime() {
  matchesData.sort(
    (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
  )
}

export function sortMatchesByGroup() {
  matchesData.sort((a, b) => {
    const valA = a.group && a.group.length > 0 ? a.group : undefined
    const valB = b.group && b.group.length > 0 ? b.group : undefined
    if (valA === undefined && valB === undefined) return 0
    if (valA === undefined) return 1
    if (valB === undefined) return -1
    return valA.localeCompare(valB)
  })
}