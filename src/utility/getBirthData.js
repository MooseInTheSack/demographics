import { getAllBirthData } from '../demographic-data/births/birth_fertility_rate_by_race_by_year_usa.js'

export const getBirthData = () => {
    const birthData = getAllBirthData()
    return birthData
}