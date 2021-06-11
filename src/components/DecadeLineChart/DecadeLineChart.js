/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js';
import { colorCombos } from '../../utility/colorCombos'
import { getAnnualPopulation } from '../../utility/getAnnualRaceAgeData'

const addAllHispanicData = () => {
    var allHispanics = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    const hispanicWhiteData = getAnnualPopulation("HispanicWhite")
    const hispanicBlackData = getAnnualPopulation("HispanicBlack")
    const hispanicAsianData = getAnnualPopulation("HispanicAsian")
    const hispanicAmericanIndianData = getAnnualPopulation("HispanicAmericanIndian")

    for(const yearIndex in allHispanics) {
        allHispanics[yearIndex] += hispanicWhiteData[yearIndex]
        allHispanics[yearIndex] += hispanicBlackData[yearIndex]
        allHispanics[yearIndex] += hispanicAsianData[yearIndex]
        allHispanics[yearIndex] += hispanicAmericanIndianData[yearIndex]
    }

    return allHispanics

}

const addAllPopData = (arrayOfRacialData) => {
    var totalPopData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for(let yearIndex in totalPopData) {
        for(let dataForOneRaceIndex in arrayOfRacialData) {
            totalPopData[yearIndex] += arrayOfRacialData[dataForOneRaceIndex][yearIndex]
        }
    }
    return totalPopData
}

export const DecadeLineChart = (props) => {
    
    const [racialData, setRacialData] = useState([])
    const [myLineChart, setMyLineChart] = useState()
    const [ chartColors ] = useState(colorCombos())

    useEffect( () => {
        var arrayOfRacialData = []
        arrayOfRacialData.push(getAnnualPopulation("NonHispanicWhite"))
        arrayOfRacialData.push(getAnnualPopulation("Black"))
        arrayOfRacialData.push(getAnnualPopulation("Asian"))
        arrayOfRacialData.push(getAnnualPopulation("AmericanIndian"))
        
        const allHispanics = addAllHispanicData()
        arrayOfRacialData.push(allHispanics)

        //MUST display differently if we're doing it based on %!!!
        if(props.type === "percent") {
            //get an array to represent the TOTAL pop of all races per decade
            const totalPopData = addAllPopData(arrayOfRacialData)

            var whiteAsPercentData = getAnnualPopulation("NonHispanicWhite").map((dataForOneYear, yearIndex) => dataForOneYear/totalPopData[yearIndex])
            var blackAsPercentData =getAnnualPopulation("Black").map((dataForOneYear, yearIndex) => dataForOneYear/totalPopData[yearIndex])
            var asianAsPercentData =getAnnualPopulation("Asian").map((dataForOneYear, yearIndex) => dataForOneYear/totalPopData[yearIndex])
            var americanIndianAsPercentData =getAnnualPopulation("AmericanIndian").map((dataForOneYear, yearIndex) => dataForOneYear/totalPopData[yearIndex])
            const allHispanics = addAllHispanicData()
            var HispanicAsPercentData =allHispanics.map((dataForOneYear, yearIndex) => dataForOneYear/totalPopData[yearIndex])

            arrayOfRacialData = []
            arrayOfRacialData.push(whiteAsPercentData, blackAsPercentData, asianAsPercentData, americanIndianAsPercentData, HispanicAsPercentData)
        }
        
        setRacialData(arrayOfRacialData)

    }, [])

    useEffect(() => {
        const ctx = document.getElementById(props.type);

        if (typeof myLineChart !== "undefined" && typeof myLineChart !== undefined) myLineChart.destroy();

        setMyLineChart(new Chart(ctx, {
            type: 'line',
            data: {
                labels: [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019],
                datasets: [
                {
                    label: "Non-Hispanic White",
                    data: racialData[0],
                    backgroundColor: chartColors[0],
                    borderColor: chartColors[0],
                    borderWidth: 1,
                    fill: false,
                    borderWidth: 3,
                    
                },
                {
                    label: "Black",
                    data: racialData[1],
                    backgroundColor: chartColors[2],
                    borderColor: chartColors[2],
                    borderWidth: 1,
                    fill: false,
                    borderWidth: 3,
                    
                },
                {
                    label: "Asian",
                    data: racialData[2],
                    backgroundColor: chartColors[4],
                    borderColor: chartColors[4],
                    borderWidth: 1,
                    fill: false,
                    borderWidth: 3,
                    
                },
                {
                    label: "American Indian",
                    data: racialData[3],
                    backgroundColor: chartColors[8],
                    borderColor: chartColors[8],
                    borderWidth: 1,
                    fill: false,
                    borderWidth: 3,
                    
                },
                {
                    label: "All Hispanic",
                    data: racialData[4],
                    backgroundColor: chartColors[10],
                    borderColor: chartColors[10],
                    borderWidth: 1,
                    fill: false,
                    borderWidth: 3,
                    
                }
                ]
            },
            options: {
                spanGaps: false,
            }
        }))
    }, [racialData])
    
    return (
        <div>
            <canvas id={props.type} width="400" height="400" />
        </div>
    )
}