import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import './SimpleTabs.css';

import { DecadeLineChart } from '../DecadeLineChart/DecadeLineChart'
import { IncomeBracketChart } from '../IncomeBracketChart/IncomeBracketChart'
import { PovertyBracketChart } from '../PovertyBracketChart/PovertyBracketChart'
import { BirthDataChart } from '../BirthDataChart/BirthDataChart'
import { PopulationPyramidChart } from '../PopulationPyramidChart/PopulationPyramidChart'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

export const SimpleTabs = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Pop Pyramid" {...a11yProps(0)} />
          <Tab label="Population" {...a11yProps(1)} />
          <Tab label="Income" {...a11yProps(2)} />
          <Tab label="Poverty" {...a11yProps(3)} />
          <Tab label="Fertility" {...a11yProps(4)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <div className="chartDiv">
          <PopulationPyramidChart type="popPyramid" />
        </div>

      </TabPanel>
      <TabPanel value={value} index={1}>
        <div>
          <div className="chartDiv">
            <h3>Population by Race 2010-2019</h3>
              <DecadeLineChart type="total" />
          </div>
          <br />
          
          <div className="chartDiv">
            <h3>Population as a Pecent of Total Inhabitants by Race</h3>
              <DecadeLineChart type="percent" />
          </div>
        </div>

      </TabPanel>
      <TabPanel value={value} index={2}>
        <div>
          <div className="chartDiv">
            <h3>Total Number of Households in each Income Bracket by Race, 2019</h3>
              <IncomeBracketChart type="totalIncome" />
          </div>
          <br />

          <div className="chartDiv">
            <h3>Each Race as a Percent of the Total Respective Income Bracket, 2019</h3>
              <IncomeBracketChart type="percentIncome" />
          </div>
          <br />
        </div>

      </TabPanel>
      <TabPanel value={value} index={3}>
        <div className="chartDiv">
          <h3>Total Number of Individuals in Poverty by Age Range, 2020</h3>  
          <PovertyBracketChart type="povertyData"/>
        </div>

      </TabPanel>
      <TabPanel value={value} index={4}>
        <div className="chartDiv">
          <h3>Number of Births Each Year By Race, 1960 to 2019</h3>  
          <BirthDataChart type="birthRate"/>
        </div>

      </TabPanel>
    </div>
  );
}
