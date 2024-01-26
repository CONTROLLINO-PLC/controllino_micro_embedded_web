import React, { useCallback, useState, useEffect } from 'react';
import { Grid, Tabs, Tab, Box } from '@mui/material';
import Navbar from './Navbar';
import VsuplyCard from './VsuplyCard';
import TsensorCard from './TsensorCard';
import TmcuCard from './TmcuCard';
import FormBoard from './FormBoard';
import FormComms from './FormComms';
import FormFirmware from './FormFirmwareUpdate';

const classes = {
  general: {
    background: '#1f1f1f',
    top: '0',
    bottom: '0',
    left: '0',
    right: '0',
    position: 'absolute'
  },
  container: {
    paddingTop: '70px',
    alignItems: 'center'
  },
  tabColor: {
    background: '#D8D500'
  },
};

// Socket connection management
const socket = new WebSocket( `ws://${ window.location.hostname }/ws` );
socket.onopen = () => {
  socket.updateInterval = setInterval( () => {
    if ( socket.readyState == WebSocket.OPEN ) {
      socket.send( 'd' );
    } 
  }, 500 );
};
socket.onclose = () => { 
  clearInterval( socket.updateInterval );
};

const Home = ({ onLogout }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [wsData, setWsData] = useState('');
  const [Vsuply, setVsuply] = useState('');
  const [Tsensor, setTsensor] = useState('');
  const [ Tmcu, setTmcu ] = useState( '' );

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  const handleClick = useCallback((data) => {
    socket.send(JSON.stringify(data));
    console.log(JSON.stringify(data));
  }, [])

  useEffect(() => {
    socket.onmessage = (evt) => {
      if ( !evt.data ) return;
      if ( evt.data === 'h' ) return; // Heartbeat ingnored
      setWsData( evt.data );
      const parsedData = JSON.parse( evt.data );
      // console.log( parsedData );
      setVsuply(parsedData[1].vsply.toFixed(3));
      setTsensor(parsedData[1].tsens.toFixed(2));
      setTmcu(parsedData[1].tmcu.toFixed(2));
    };
  }, []);

  return (
    <div style={classes.general} >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Navbar onClick={onLogout}></Navbar>
        </Grid>
      </Grid>

      <Grid container spacing={1} style={classes.container}>
        <Grid item xs={12} sm={3} md={5} lg={5} xl={1.32} style={{marginBottom: '0.2%'}}>
          <VsuplyCard titulo={`Vsupply: ${Vsuply} V`}></VsuplyCard>
        </Grid>

        <Grid item xs={12} sm={3} md={5} lg={5} xl={1.32} style={{marginBottom: '0.2%'}}>
          <TsensorCard titulo={`Tsensor: ${Tsensor} °C`}></TsensorCard>
        </Grid>

        <Grid item xs={12} sm={3} md={5} lg={5} xl={1.32} style={{marginBottom: '0.2%'}}>
          <TmcuCard titulo={`Tmcu: ${Tmcu} °C`}></TmcuCard>
        </Grid>
      </Grid>

      <Grid item xs={0} sm={0} md={1} lg={1} xl={1}></Grid>

      <Grid container spacing={0.1} >
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} >
          <Box >
            <Box style={classes.tabColor} >
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                textColor='secondary'
                indicatorColor='secondary'>
                <Tab label='Board' />
                <Tab label='Network' />
                <Tab label='Firmware Update' />
              </Tabs>
            </Box>
            <Box sx={{ padding: 2 }}>
              {tabIndex === 0 && <FormBoard data={wsData} onChange={handleClick}/>}
              {tabIndex === 1 && <FormComms data={wsData} onClick={handleClick}/>}
              {tabIndex === 2 && <FormFirmware data={wsData} onClick={handleClick}/>}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;