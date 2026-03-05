import type { MatchItem } from "../data/matches";
import matches from "../data/matches";

export const matchesData: MatchItem[] = $state(matches.map(match => ({ ...match })))

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
    if (!a.group && !b.group) return 0
    if (!a.group) return 1
    if (!b.group) return -1
    return a.group.localeCompare(b.group)
  })
}