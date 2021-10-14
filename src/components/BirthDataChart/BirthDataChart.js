/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-redeclare */
/* eslint-disable no-dupe-keys */
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js';
import { colorCombos } from '../../utility/colorCombos'
import { getBirthData } from '../../utility/getBirthData'
import { SimpleSelect } from '../SimpleSelect/SimpleSelect'
import { MenuItem } from '@material-ui/core';
import './BirthDataChart.css'

const getDataForRace = (arr, raceName) => {
    if(raceName === "White" || raceName === "Black") {
        var pre1989 = arr.filter(entry => parseInt(entry.year) < 1989 && entry.race === raceName)
        var post1989 = arr.filter(entry => parseInt(entry.year) >= 1989 && entry.race === "Non-Hispanic " + raceName)
        return pre1989.concat(post1989)

    } else if(raceName === "Hispanic") {
        var post1989 = arr.filter(entry => entry.race === "Hispanic Total")
        var pre1989 = []
        for(let index_i = 1960; index_i < 1989; index_i++) {
            pre1989.push(
                { 
                    year: 1960 + "", 
                    live_births: null,
                    birth_rate: null,
                    fertility_rate: null,
                })
        }
        
        return pre1989.concat(post1989)
    } else if(raceName === "Asian") {
        return arr.filter(entry => entry.race === "Asian or Pacific Islander")
    } else {
        return []
    }
}

export const BirthDataChart = (props) => {
    
    const [selectedType, setSelectedType] = useState()
    const [racialData, setRacialData] = useState([])
    const [myLineChart, setMyLineChart] = useState()
    const [ chartColors ] = useState(colorCombos())

    const handleChange = (event) => {
        setSelectedType(event.target.value);
    }

    const selections = [
        <MenuItem value={'Total Births'}>Total Births</MenuItem>,
        <MenuItem value={'Fertility Rate'}>Fertility Rate</MenuItem>,
        <MenuItem value={'Birth Rate'}>Birth Rate</MenuItem>
    ]
    
    useEffect( () => {
        var arrayOfRacialData = []

        const allRaceData = getBirthData()

        const whiteData = getDataForRace(allRaceData, "White")
        const blackData = getDataForRace(allRaceData, "Black")
        const hispanicTotal = getDataForRace(allRaceData, "Hispanic")

        arrayOfRacialData.push(whiteData)
        arrayOfRacialData.push(blackData)
        arrayOfRacialData.push(hispanicTotal)
    
        setRacialData(arrayOfRacialData)

        setSelectedType('Total Births')

    }, [])

    useEffect(() => {
        if(racialData && racialData.length > 2) {
            
            const ctx = document.getElementById(props.type);

            const whichTypeToDisplay = selectedType === 'Total Births' ? "live_births" : (selectedType === 'Birth Rate' ? 'birth_rate' : 'fertility_rate') 

            if (typeof myLineChart !== "undefined" && typeof myLineChart !== undefined) myLineChart.destroy();
            
            const yeet = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: racialData[0].map((entry) => entry.year),
                    datasets: [
                    {
                        label: "White",
                        data: racialData[0].map((entry) => entry[whichTypeToDisplay]),
                        backgroundColor: chartColors[0],
                        borderColor: chartColors[0],
                        borderWidth: 1,
                        fill: false,
                        borderWidth: 3,
                    },
                    {
                        label: "Black",
                        data: racialData[1].map((entry) => entry[whichTypeToDisplay]),
                        backgroundColor: chartColors[10],
                        borderColor: chartColors[10],
                        borderWidth: 1,
                        fill: false,
                        borderWidth: 3,
                    },
                    {
                        label: "Hispanic Total",
                        data: racialData[2].map((entry) => entry[whichTypeToDisplay]),
                        backgroundColor: chartColors[4],
                        borderColor: chartColors[4],
                        borderWidth: 1,
                        fill: false,
                        borderWidth: 3,
                    },
                    ]
                },
                options: {
                    spanGaps: false,
                }
            })
            
            setMyLineChart(yeet)
        }
        
    }, [selectedType])
    
    return (
        <div>
            <SimpleSelect 
                data={selections}
                selectedType={selectedType}
                handleChange={handleChange}
            />
            <br />
            <canvas id={props.type} className="canvasContainer" />
        </div>
    )
}