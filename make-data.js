import { writeFile } from 'node:fs/promises'

try {
  const data = await fetch("https://api.fifa.com/api/v3/calendar/matches?language=en&count=500&idSeason=285023")
  const matches = await data.json()
  const output = []
  for (const match of matches.Results) {
    const item = makeItem(match)
    output.push(item)
  }
  await writeFile("./src/data/data.json", JSON.stringify(output, null, 2))
} catch (error) {
  console.debug(error)
}

function makeItem(match) {
  console.log(match.MatchNumber)
  return {
    "datetime": match.Date,
    "stage": match.StageName[0].Description,
    "group": match.GroupName[0]?.Description.replace("Group ", "") || "" ,
    "home": match.Home?.ShortClubName || match.PlaceHolderA,
    "away": match.Away?.ShortClubName || match.PlaceHolderB,
    "stadium": match.Stadium.Name[0].Description,
    "city": match.Stadium.CityName[0].Description
  }
}