import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LocationCard from './components/LocationCard';
import DailyStatisticsCard from './components/DailyStatisticsCard';

import axios from 'axios';
import {ValidPostcode} from './util/validations'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { getLocationByPostCode, getDailyStatsByArea } from './api/api_wrapper';

const useStyles = makeStyles((theme) => ({
  container:{
    width: 900,
  },
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: 'auto',
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  options: {
    padding: theme.spacing(1),
    textAlign: 'left',
    color: theme.palette.text.secondary,
  },
}));

const App = () => {
  const classes = useStyles();

  // Default button state for a new game  
  const [postCode, setPostCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [statistics, setStatistics] = useState(null);
  const [historicStats, setHistoricStats] = useState(null);
  const [location, setLocation] = useState(null);
  
  useEffect(() => {
  
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [location]);

  const fetchStatistics = async () =>{

    console.log(location);
    if (location)
    {
      try {
        setLoading(true);
        const response = await axios.get(getDailyStatsByArea(location.msoa));
        setStatistics(response.data.latest.newCasesBySpecimenDate);

        setHistoricStats(response.data.newCasesBySpecimenDate.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        setLoading(false);

        console.log(historicStats);
      } catch (error) {
        setError(error.message);
      }
    }
  }

  const fetchLocation = async () =>{

    try {
      setLoading(true);
      const response = await axios.get(getLocationByPostCode(postCode));
      setLocation(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
    }
  }

  const onValidateForm = () =>{
    let bValid = true;
    if (postCode === "") {
      bValid = false;
      setError(`Post Code must be entered`);
    } else {
      bValid = true;// ValidPostcode(postCode);
      setError(!bValid ? `Post Code is not valid` : "");
    }
    return(bValid);
  }

  const onPostCodeSearch = () =>{
    if (onValidateForm()){
      console.log(`Doing a search for ${postCode}`);
      fetchLocation();
    }
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={1} className={classes.container}>
        <Grid container item xs={12}>
          <Grid item xs={12}>
            <Paper className={classes.options}>
              <TextField
                inputProps={{style: {textTransform: 'uppercase'}}} 
                id="outlined-error"
                label="Post Code"
                variant="outlined"
                size="small"
                onChange={e => setPostCode(e.target.value)}
                value={postCode}
              />
              <Button variant="contained" color='primary' onClick={()=>onPostCodeSearch()}>Search Post Code</Button>
              {error}
            </Paper>
            {location ? 
            <Paper className={classes.options}>
              <LocationCard location={location} />
            </Paper> : ""}
            {statistics ? 
            <Paper className={classes.options}>
              <DailyStatisticsCard statistics={statistics} />

              <LineChart
                width={800}
                height={400}
                data={historicStats}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rollingRate" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="rollingSum" stroke="#82ca9d" />
              </LineChart>
            </Paper> : ""}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;