import { writeFile } from 'node:fs/promises'
import FLAGS from "./flags.json" with { type: "json" }

const findFlag = (country) => FLAGS.find(flag => flag.name === country)?.emoji ?? "🇺🇳"

try {
  const data = await fetch("https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idSeason=285023")
  const matches = await data.json()
  const output = []
  const teamsOrPlaceholders = {};
  const groups = {};
  for (const match of matches.Results) {
    const item = makeItem(match)
    output.push(item)

    if (!teamsOrPlaceholders[item.home.abbreviation]) {
      teamsOrPlaceholders[item.home.abbreviation] = item.home
    }

    if (!teamsOrPlaceholders[item.away.abbreviation]) {
      teamsOrPlaceholders[item.away.abbreviation] = item.away
    }

    if (item.group) {
      if (!groups[item.group]) groups[item.group] = [];
      if (!groups[item.group].some(t => t.abbreviation === item.home.abbreviation)) groups[item.group].push(item.home)
      if (!groups[item.group].some(t => t.abbreviation === item.away.abbreviation)) groups[item.group].push(item.away)
    }
  }
  await Promise.all([
    writeFile("./src/data/matches.json", JSON.stringify(output, null, 2)),
    writeFile("./src/data/teams.json", JSON.stringify(teamsOrPlaceholders, null, 2)),
    writeFile("./src/data/groups.json", JSON.stringify(
      Object.fromEntries(Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))), null, 2
    ))
  ])
} catch (error) {
  console.debug(error)
}

function makeItem(match) {
  console.log(match.MatchNumber)
  const homeName = match.Home?.ShortClubName || match.PlaceHolderA
  const awayName = match.Away?.ShortClubName || match.PlaceHolderB
  return {
    "datetime": match.Date,
    "stage": match.StageName[0].Description,
    "group": match.GroupName[0]?.Description.replace("Group ", "") || "" ,
    "home": {
      "name": homeName,
      "abbreviation": match.Home?.Abbreviation || match.PlaceHolderA,
      "flag": findFlag(homeName)
    },
    "away": {
      "name": awayName,
      "abbreviation": match.Away?.Abbreviation || match.PlaceHolderB,
      "flag": findFlag(awayName)
    },
    "stadium": match.Stadium.Name[0].Description,
    "city": match.Stadium.CityName[0].Description
  }
}