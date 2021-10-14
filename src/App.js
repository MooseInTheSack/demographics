import React, { useRef, useEffect, useState } from 'react';
import logo from './logo.svg';
import Chart from 'chart.js';
import './App.css';

import { SimpleTabs } from './components/SimpleTabs/SimpleTabs'


function App() {

  const [chosenCategory, setChosenCategory] = useState('income')
  
  return (
    <div className="App">
        <SimpleTabs />
    </div>
  )
  
}

export default App;
