export const getAnnualRaceAgeData = () => {
    const jsonData = require('../demographic-data/race_population_change/annual_est_by_age_and_sex_2010_to_2019.json')
    //TODO: Stuff
    return []
}

export const getAnnualPopulation = (raceParam) => {
    var keyword = ""
    var jsonData = ""

    switch(raceParam) {
        case "NonHispanicWhite":
            keyword = ".NOT HISPANIC"
            jsonData = require("../demographic-data/race_population_change/whiteData.json")
            break
        case "HispanicWhite":
            keyword = ".HISPANIC"
            jsonData = require("../demographic-data/race_population_change/whiteData.json")
            break
        case "Black":
            keyword = ".NOT HISPANIC"
            jsonData = require("../demographic-data/race_population_change/blackData.json")
            break
        case "HispanicBlack":
            keyword = ".HISPANIC"
            jsonData = require("../demographic-data/race_population_change/blackData.json")
            break
        case "Asian":
            keyword = ".NOT HISPANIC"
            jsonData = require("../demographic-data/race_population_change/asianData.json")
            break
        case "HispanicAsian":
            keyword = ".HISPANIC"
            jsonData = require("../demographic-data/race_population_change/asianData.json")
            break
        case "AmericanIndian":
            keyword = ".NOT HISPANIC"
            jsonData = require("../demographic-data/race_population_change/americanIndianData.json")
            break
        case "HispanicAmericanIndian":
            keyword = ".HISPANIC"
            jsonData = require("../demographic-data/race_population_change/americanIndianData.json")
            break
        default:
            break
    }

    const duck = jsonData.filter((row) => row["Census"] === keyword)

    const popDict = duck[0]

    const justPopArray = Object.keys(popDict).map((key) => {
        return parseInt(popDict[key].replace(/,/g, ""))
    })
    delete justPopArray["Census"]
    delete justPopArray["Estimates Base"]

    return justPopArray

}