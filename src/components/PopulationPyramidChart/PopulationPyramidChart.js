import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js';
import { colorCombos } from '../../utility/colorCombos'
//import { getWhiteAndNHWhiteData } from '../../utility/getPopulationPyramidData'
import { getWhiteAsianAndOtherData } from '../../utility/getPopulationPyramidData'
import { SimpleSelect } from '../SimpleSelect/SimpleSelect';
import { MenuItem } from '@material-ui/core';
import './PopulationPyramidChart.css'

const categoriesToCount = [
    "Under 5 years", 
    "5 to 9 years", 
    "10 to 14 years", 
    "15 to 19 years", 
    "20 to 24 years",
    "25 to 29 years",
    "30 to 34 years",
    "35 to 44 years",
    "45 to 54 years",
    "55 to 64 years",
    "65 to 74 years",
    "75 to 84 years",
    "85 years and over",
]

//for one specific file: nhw and hispanics, for ages 0-29 only
const convertDemographicDataToChartFormat = (arr, raceName, genderName) => {
    if(raceName === "NHW") {
        return arr.filter((entry) => entry.Sex === genderName).map((matchedEntry) => parseInt(matchedEntry["Non-Hispanic Middle"].replace(",", "")))
    }
    else if(raceName === "Hispanic") {
        return arr.filter((entry) => entry.Sex === genderName).map((matchedEntry) => {

            if(matchedEntry["Hispanic Middle"] & typeof matchedEntry["Hispanic Middle"] === "string") {
                return parseInt(matchedEntry["Hispanic Middle"].replace(",", ""))
            } else if(typeof matchedEntry["Hispanic Middle"] === "number") {
                return matchedEntry["Hispanic Middle"]
            } else {
                return null
            }
        })
    } else {
        return []
    }
}

const convertDemoToChartFormat = (arr, raceName, genderName) => {
    
    if(raceName === "NHW") {
        return arr.filter((entry) => categoriesToCount.includes(entry.Category) && entry.Sex === genderName && entry.Category !== "Female Total").map((matchedEntry) => matchedEntry["Non-Hispanic White Number"])
    }
    else if(raceName === "Asian") {
        return arr.filter((entry) => categoriesToCount.includes(entry.Category) && entry.Sex === genderName && entry.Category !== "Female Total").map((matchedEntry) => matchedEntry["Asian alone Number"])
    } else if(raceName === "Other") {
        return arr.filter((entry) => categoriesToCount.includes(entry.Category) && entry.Sex === genderName && entry.Category !== "Female Total").map((matchedEntry) => matchedEntry["Other Number"])
    }
}

const getCategoryNames = (arr, sex) => {
    return arr.filter((allEntry) => categoriesToCount.includes(allEntry.Category) && allEntry.Sex === sex).map((entry) => entry.Category).reverse()
}

const populationPyramidOptions = {
    title: {
        display: true,
        text: "Data from April 2020, all numbers are in thousands",
    },
    tooltips: {
        intersect: false,
        callbacks: {
            label: (c) => {
                const value = Number(c.value);
                const positiveOnly = value < 0 ? -value : value;
                let retStr = "";
                switch(c.datasetIndex) {
                    case 0:
                        retStr = `White Male: ${positiveOnly.toString()}`
                        break
                    case 1:
                        retStr = `Asian Male: ${positiveOnly.toString()}`
                        break
                    case 2:
                        retStr = `Other Male: ${positiveOnly.toString()}`
                        break
                    case 3:
                        retStr = `White Female: ${positiveOnly.toString()}`
                        break
                    case 4:
                        retStr = `Asian Female: ${positiveOnly.toString()}`
                        break
                    case 5:
                        retStr = `Other Female: ${positiveOnly.toString()}`
                        break
                    default:
                        retStr = "Unkown"
                        break
                }
                return retStr;
            },
        },
    },
    responsive: true,
    legend: {
        position: "bottom",
    },
    scales: {
        xAxes: [
        {
            stacked: false,
            ticks: {
                beginAtZero: true,
                callback: (v) => { return v < 0 ? -v: v }
            },
        },
        ],
        yAxes: [
        {
            stacked: true,
            ticks: {
            beginAtZero: true,
            },
            position: "left",
        }
        ],
    },

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

export const PopulationPyramidChart = (props) => {

    const [ myLineChart, setMyLineChart] = useState()
    const [racialData, setRacialData ] = useState([])
    const [ chartColors ] = useState(colorCombos())

    const getDataAndCreateChart = () => {
        var maleData, femaleData, datasets = []
        
        //make labels
        var labels = getCategoryNames(racialData, "Male")

        maleData = {
            "NHW": convertDemoToChartFormat(racialData, "NHW", "Male"),
            "Asian": convertDemoToChartFormat(racialData, "Asian", "Male"),
            "Other": convertDemoToChartFormat(racialData, "Other", "Male"),
        }

        femaleData = {
            "NHW": convertDemoToChartFormat(racialData, "NHW", "Female"),
            "Asian": convertDemoToChartFormat(racialData, "Asian", "Female"),
            "Other": convertDemoToChartFormat(racialData, "Other", "Female"),
        }

        console.log('ducky racialData: ', racialData)
        console.log('ducky maleData: ', maleData)

        datasets = [
            {
                label: "Non-Hispanic White Males",
                stack: "stack 0",
                data: maleData["NHW"] && maleData["NHW"].length > 0 ? maleData["NHW"].map((k) => -k).reverse() : [],
                backgroundColor: chartColors[0],
                borderWidth: 1,
            },
            {
                label: "Asian Males",
                stack: "stack 1",
                data: maleData["Asian"] && maleData["Asian"].length > 0 ? maleData["Asian"].map((k) => -k).reverse() : [],
                backgroundColor: chartColors[5],
                borderWidth: 1,
            },
            {
                label: "Other Males",
                stack: "stack 2",
                data: maleData["Other"] && maleData["Other"].length > 0 ? maleData["Other"].map((k) => -k).reverse() : [],
                backgroundColor: chartColors[9],
                borderWidth: 1,
            },
            {
                label: "Non-Hispanic White Females",
                stack: "stack 0",
                data: femaleData["NHW"] && femaleData["NHW"].length > 0 ? femaleData["NHW"].reverse() : [],
                backgroundColor: chartColors[0],
            },
            {
                label: "Asian Females",
                stack: "stack 1",
                data: femaleData["Asian"] && femaleData["Asian"].length > 0 ? femaleData["Asian"].reverse() : [],
                backgroundColor: chartColors[5],
            },
            {
                label: "Other Females",
                stack: "stack 2",
                data: femaleData["Other"] && femaleData["Other"].length > 0 ? femaleData["Other"].reverse() : [],
                backgroundColor: chartColors[9],
            }
        ]
        
        if(racialData) {
            const ctx = document.getElementById(props.type);

            if (typeof myLineChart !== "undefined") myLineChart.destroy();

            const yeet = new Chart(ctx, {
                type: 'horizontalBar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: populationPyramidOptions,
            })

            setMyLineChart(yeet)
        } else {
            console.error('ducky problem')
        }
    }
    
    useEffect(() => {
        //TODO: move this somewhere else
        setRacialData(getWhiteAsianAndOtherData())
    }, [])
    
    useEffect(() => {
        console.log('ducky1')
        getDataAndCreateChart()
        
    }, [racialData])

    return (
        <div>
            <h3>Population Pyramid Separated By Race</h3>
            <canvas id={props.type} className="canvasContainer" />
        </div>
    )
}