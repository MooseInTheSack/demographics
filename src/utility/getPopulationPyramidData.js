import { getData } from '../demographic-data/pyramid_by_race/formatted_hispanic_and_non_hispanic_white_data.js'
import { getWAOData } from '../demographic-data/pyramid_by_race/formatted_nhwhite_and_asian_pyramids'

export const getWhiteAndNHWhiteData = () => {
    return getData()
}

export const getWhiteAsianAndOtherData = () => {
    return getWAOData()
}