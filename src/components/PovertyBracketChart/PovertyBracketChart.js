/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js';
import { colorCombos } from '../../utility/colorCombos'

import { getNHWPoverty } from '../../demographic-data/income/poverty/nhw_poverty'
import { getAllHispanicPoverty } from '../../demographic-data/income/poverty/all_hispanic_poverty'
import { getBlackOnlyPoverty } from '../../demographic-data/income/poverty/black_only_poverty'
import { getAsianOnlyPoverty } from '../../demographic-data/income/poverty/asian_only_poverty'

const createDataset = (incomeBracketArray, label, barColor) => {
    var dataArray = []
    var labelArray = []
    const ignoreThese = ["Total", "18 to 64 years", "Under 18 years", "65 years and over", ]
    
    for(const bracketInfo of incomeBracketArray) {
        if(ignoreThese.indexOf(bracketInfo["Portion"]) === -1) {            
            dataArray.push(bracketInfo["Below 100% Poverty"])
            labelArray.push(bracketInfo["Portion"])
        }
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
    const ignoreThese = ["Total", "18 to 64 years", "Under 18 years", "65 years and over", ]

    for(const bracketInfo of incomeBracketArray) {
        console.log("bracketInfo['portion']: ", bracketInfo["Portion"])
        if(ignoreThese.indexOf(bracketInfo["Portion"]) === -1) {
            labelArray.push(bracketInfo["Portion"])
        }
    }
    return labelArray
}

export const PovertyBracketChart = (props) => {
    const [colorArray] = useState(colorCombos())
    const [myLineChart, setMyLineChart] = useState()
    const [NHWData] = useState(getNHWPoverty())
    const [hispanicData] = useState(getAllHispanicPoverty())
    const [blackData] = useState(getBlackOnlyPoverty())
    const [asianData] = useState(getAsianOnlyPoverty())

    useEffect(() => {
        const ctx = document.getElementById(props.type);
        var datasets = []
        //if total:
        if(props.type === "povertyData") {
            datasets = [
                createDataset(NHWData, "Non-Hispanic White Households", colorArray[0]),
                //createDataset(AllWhitesData, "All White Households", colorArray[3]),
                createDataset(hispanicData, "Hispanic Households", colorArray[3]),
                createDataset(blackData, "Black Households", colorArray[9]),
                createDataset(asianData, "Asian Households", colorArray[5]),
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