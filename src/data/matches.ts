import DATA from "./data.json" assert {type: "json"}
import FLAGS from "./flags.json" assert {type: "json"}
import { type Result } from "../Group"
import { type GroupName } from "../stores.svelte"

export type MatchItem = {
  id: number
  datetime: string
  group?: GroupName
  stage: string
  home: string
  away: string
  homeFlag: string
  awayFlag: string
  result?: [Result, Result]
  stadium: string
  city: string
  completed: boolean
}

const findFlag = (country:string):string => FLAGS.find(flag => flag.name === country)?.emoji ?? "🇺🇳"

const matches: MatchItem[] = (DATA as unknown as MatchItem[]).map((item, index) => ({
  ...item,
  id: index + 1,
  completed: !!item.result,
  homeFlag: findFlag(item.home),
  awayFlag: findFlag(item.away),
}))

export default matches
