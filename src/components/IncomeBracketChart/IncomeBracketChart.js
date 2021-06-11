/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars*/
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js';
import { colorCombos } from '../../utility/colorCombos'
import { getIncomeBracketNonHispanicWhites } from "../../utility/usa_2019_income_bracket_non_hispanic_white.js"
//import { getIncomeBracketAllWhites } from "../../utility/usa_2019_income_bracket_all_white.js"
import { getIncomeBracketForBlackHouseholds } from "../../utility/usa_2019_income_bracket_black"
import { getIncomeBracketForAsians } from "../../utility/usa_2019_income_bracket_asian"
import { getIncomeBracketHispanic } from "../../utility/usa_2019_income_bracket_hispanic"


const getIncomeBracketForTotalPopulation = (NHWData, hispanicData, blackData, asianData) => {
    var totalForEachBracket = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    for(const i in totalForEachBracket) {
        totalForEachBracket[i] += NHWData[i]['Estimate Amount']
        totalForEachBracket[i] += hispanicData[i]['Estimate Amount']
        totalForEachBracket[i] += blackData[i]['Estimate Amount']
        totalForEachBracket[i] += asianData[i]['Estimate Amount']
    }
    return totalForEachBracket
}

const getIncomeBracketForRacialPercentage = (NHWData, hispanicData, blackData, asianData) => {
    const totalForEachBracket = getIncomeBracketForTotalPopulation(NHWData, hispanicData, blackData, asianData)

    const NHWPercentData = NHWData.map((bracketValue, bracketIndex) => {
        
        return bracketValue["Estimate Amount"]/totalForEachBracket[bracketIndex]
    })
    const hispanicPercentData = hispanicData.map((bracketValue, bracketIndex) => bracketValue["Estimate Amount"]/totalForEachBracket[bracketIndex])
    const blackPercentData = blackData.map((bracketValue, bracketIndex) => bracketValue["Estimate Amount"]/totalForEachBracket[bracketIndex])
    const asianPercentData = asianData.map((bracketValue, bracketIndex) => bracketValue["Estimate Amount"]/totalForEachBracket[bracketIndex])

    return [NHWPercentData, hispanicPercentData, blackPercentData, asianPercentData]
}

const createDataset = (incomeBracketArray, label, barColor) => {
    var dataArray = []
    var labelArray = []
    
    for(const bracketInfo of incomeBracketArray) {
        dataArray.push(bracketInfo["Estimate Amount"])
        labelArray.push(bracketInfo["Income Bracket"])
    }

    return {
        label: label,
        data: dataArray,
        backgroundColor: barColor,
        borderColor: barColor,
        borderWidth: 1,
        fill: true,
    }
}

const createLabelsArray = (incomeBracketArray) => {
    var labelArray = []
    
    for(const bracketInfo of incomeBracketArray) {
        labelArray.push(bracketInfo["Income Bracket"])
    }
    return labelArray
}

export const IncomeBracketChart = (props) => {
    const [ colorArray ] = useState(colorCombos())
    const [NHWData] = useState(getIncomeBracketNonHispanicWhites())
    //const [AllWhitesData] = useState(getIncomeBracketAllWhites())
    const [blackData] = useState(getIncomeBracketForBlackHouseholds())
    const [asianData] = useState(getIncomeBracketForAsians())
    const [hispanicData] = useState(getIncomeBracketHispanic())
    const [racialPercentageData, setRacialPercentageData] = useState([])
    const [myLineChart, setMyLineChart] = useState()

    useEffect(() => {
        const ctx = document.getElementById(props.type);
        var datasets = []
        //if total:
        if(props.type === "totalIncome") {
            datasets = [
                createDataset(NHWData, "Non-Hispanic White Households", colorArray[0]),
                //createDataset(AllWhitesData, "All White Households", colorArray[3]),
                createDataset(hispanicData, "Hispanic Households", colorArray[3]),
                createDataset(blackData, "Black Households", colorArray[9]),
                createDataset(asianData, "Asian Households", colorArray[5]),
            ]
        } else if(props.type === "percentIncome") {
            
            setRacialPercentageData(getIncomeBracketForRacialPercentage(NHWData, hispanicData, blackData, asianData))

            const yeet = getIncomeBracketForRacialPercentage(NHWData, hispanicData, blackData, asianData)

            const newNHWData = NHWData.map((bracketValue, bracketIndex) => {
                return { 
                    "Estimate Amount": yeet[0][bracketIndex],
                    "Income Bracket": bracketValue["Bracket Value"]
                }
            })
            const newhispanicData = hispanicData.map((bracketValue, bracketIndex) => {
                return { 
                    "Estimate Amount": yeet[1][bracketIndex],
                    "Income Bracket": bracketValue["Bracket Value"]
                }
            })
            const newblackData = blackData.map((bracketValue, bracketIndex) => {
                return { 
                    "Estimate Amount": yeet[2][bracketIndex],
                    "Income Bracket": bracketValue["Bracket Value"]
                }
            })
            const newasianData = asianData.map((bracketValue, bracketIndex) => {
                return { 
                    "Estimate Amount": yeet[3][bracketIndex],
                    "Income Bracket": bracketValue["Bracket Value"]
                }
            })

            datasets = [
                createDataset(newNHWData, "Non-Hispanic White Households", colorArray[0]),
                createDataset(newhispanicData, "Hispanic Households", colorArray[3]),
                createDataset(newblackData, "Black Households", colorArray[9]),
                createDataset(newasianData, "Asian Households", colorArray[5]), 
            ]
        }

        if (typeof myLineChart !== "undefined" && typeof myLineChart !== undefined) myLineChart.destroy();

        setMyLineChart(new Chart(ctx, {
            type: 'bar',
            data: {
                labels: createLabelsArray(NHWData),
                datasets: datasets
            },
        }))
    }, [NHWData])
    
    return (
        <div>
            <canvas id={props.type} width="400" height="400" />
        </div>
    )
}