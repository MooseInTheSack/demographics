import React, { useRef, useEffect, useState } from 'react';
import logo from './logo.svg';
import Chart from 'chart.js';
import './App.css';

import { RaceData2019 } from './components/2019RaceData/2019RaceData'
import { DecadeLineChart } from './components/DecadeLineChart/DecadeLineChart'
import { IncomeBracketChart } from './components/IncomeBracketChart/IncomeBracketChart'

function App() {
  
  return (
    <div className="App">
      
      <div>
        <h2>Total Number of Households in each Income Bracket by Race, 2019</h2>
          <IncomeBracketChart type="totalIncome" />
      </div>
      <br />

      <div>
        <h2>Each Race as a Percent of the Total Respective Income Bracket, 2019</h2>
          <IncomeBracketChart type="percentIncome" />
      </div>
      <br />

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
