import { type MatchItem } from "../data/matches"
import matches from "../data/matches"

const findMatchById = (id: number):MatchItem => {
  const match = matches.find(match => match.id === id)
  if (!match) throw Error(`Match ${id} not found`)
  return match
}

export {
  findMatchById
}