import React, { useRef, useEffect, useState } from 'react';
import logo from './logo.svg';
import Chart from 'chart.js';
import './App.css';

import { RaceData2019 } from './components/2019RaceData/2019RaceData'
import { DecadeLineChart } from './components/DecadeLineChart/DecadeLineChart'

function App() {
  
  return (
    <div className="App">
      <div>
        <h2>Population by Race 2010-2019</h2>
          <DecadeLineChart type="total" />
      </div>
      <br />
      <div>
        <h2>Population as a Pecent of Total Inhabitants by Race</h2>
          <DecadeLineChart type="percent" />
      </div>
    </div>
  )
  
}

export default App;
