import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js';
import { getDirectRaceDict, raceCodes } from '../../utility/get2019RaceData'
import { colorCombos } from '../../utility/colorCombos'

export const RaceData2019 = () => {

    const [alabamaRacialData, setAlabamaRacialData] = useState([])
    const [myPieChart, setMyPieChart] = useState(null)
    const [ chartColors ] = useState(colorCombos())

    useEffect( () => {
    const raceDataByState = getDirectRaceDict()
    
    if(raceDataByState) {
        const obj = raceDataByState["Arkansas"]
        const justPopulations = Object.keys(obj).map((key) => parseInt(obj[key]))
        setAlabamaRacialData(justPopulations)
    }
    }, []);

    useEffect(() => {
    const ctx = document.getElementById("myChart");

    const raceNames = raceCodes()
    const justRaceNames = Object.keys(raceNames).map((key) => raceNames[key])
    
        setMyPieChart(new Chart(ctx, {
        type: "pie",
        data: {
            labels: justRaceNames,
            datasets: [
            {
                label: "# of Votes",
                data: alabamaRacialData,
                backgroundColor: chartColors,
                borderColor: chartColors,
                borderWidth: 1
            }
            ]
        }
        }));
    
    
    }, [alabamaRacialData])



    return (
    <div className="App">
        <canvas id="myChart" width="400" height="400" />
    </div>
    );
}