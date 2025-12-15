import DATA from "./data.json" assert {type: "json"}
import { type Result } from "../Group"
import { type GroupName } from "../stores.svelte"

export type MatchItem = {
  id: number
  datetime: string
  group?: GroupName,
  home: string
  away: string
  result?: [Result, Result]
  stadium: string
  city: string
  completed: boolean
}

const matches: MatchItem[] = (DATA as unknown as MatchItem[]).map((item, index) => ({
  ...item,
  id: index,
  completed: !!item.result
}))

export default matches
