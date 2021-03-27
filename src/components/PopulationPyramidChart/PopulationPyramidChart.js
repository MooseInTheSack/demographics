import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js';
import { colorCombos } from '../../utility/colorCombos'
//import { getWhiteAndNHWhiteData } from '../../utility/getPopulationPyramidData'
import { getWhiteAsianAndOtherData } from '../../utility/getPopulationPyramidData'
import { SimpleSelect } from '../SimpleSelect/SimpleSelect';
import { MenuItem } from '@material-ui/core';

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
                if (c.datasetIndex === 0) {
                retStr += `Male: ${positiveOnly.toString()}`;
                } else {
                retStr += `Female: ${positiveOnly.toString()}`;
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

    //const [ NHWData, setNHWData] = useState([])
    const [ myLineChart, setMyLineChart] = useState()
    const [selectedRace, setSelectedRace ] = useState('')
    const [racialData, setRacialData ] = useState([])

    const handleChange = (event) => {
        setSelectedRace(event.target.value);
    }

    const selections = [
        <MenuItem value={'NHW'}>Non-Hispanic White</MenuItem>,
        <MenuItem value={'Asian'}>Asian</MenuItem>,
        <MenuItem value={'Other'}>Other (Black, Hispanic, etc.)</MenuItem>,
    ]

    const getDataAndCreateChart = () => {
        var maleData, femaleData, datasets
        
        //TODO: move this somewhere else
        setRacialData(getWhiteAsianAndOtherData())
        
        //make labels
        var labels = getCategoryNames(racialData, "Male")
        maleData = convertDemoToChartFormat(racialData, selectedRace, "Male")
        femaleData = convertDemoToChartFormat(racialData, selectedRace, "Female")

        datasets = [
            {
                label: "Male",
                stack: "stack 0",
                data: maleData && maleData.length > 0 ? maleData.map((k) => -k).reverse() : [],
                backgroundColor: '#3765b0',
                borderWidth: 1,
            },
            {
                label: "Female",
                stack: "stack 0",
                data: femaleData && femaleData.length > 0 ? femaleData.reverse() : [],
                backgroundColor: '#d41111',
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
        }  
    }

    useEffect(() => {
        setSelectedRace('NHW')
    }, [])
    
    useEffect(() => {
        getDataAndCreateChart()
        
    }, [selectedRace])

    return (
        <div>
            <SimpleSelect 
                data={selections}
                selectedType={selectedRace}
                handleChange={handleChange}
            />
            <canvas id={props.type} width="400" height="400" />

        </div>
    )
}