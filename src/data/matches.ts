import DATA from "./data.json" with {type: "json"}
import { type Result } from "../Group"
import { type GroupName } from "../stores/groups.svelte"

export type TeamInfo = {
  name: string
  abbreviation: string
  flag: string
}

export type MatchItem = {
  id: number
  datetime: string
  group?: GroupName
  stage: string
  home: TeamInfo
  away: TeamInfo
  result?: [Result, Result]
  stadium: string
  city: string
  completed: boolean
}

const matches: MatchItem[] = (DATA as unknown as MatchItem[]).map((item, index) => ({
  ...item,
  id: index + 1,
  completed: !!item.result,
}))

export default matches
