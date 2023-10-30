import React, { useContext } from 'react';
import { Grid } from '@mui/material';
import Output from './Outputs';
import LedOutput from './LedOutput';
import LedInput from './LedInput';
import Inputs from './Inputs';
import ComComponent from './comComponent';
import NetworkLeds from './networkLeds';
import Board from '../assets/img/Board.svg';

function FormBoard(props) {
  return (
      <Grid container spacing={2} alignItems='center' justifyContent='center' sx={{marginTop: 15}}>
        <Grid item xs={12} sm={12} md={6} lg={5} xl={2} style={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          <Output onChange={props.onChange} />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={5} xl={2.4} style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: 170,
          marginBottom: 90,
        }}>
          <div style={{ position: 'relative', transform: 'rotate(90deg)' }} >
            <img src={Board} alt='logo' width={728} />

            <div style={{ position: 'absolute', left: 430, top: 212, transform: 'rotate(-90deg)'}}>
              <LedOutput data={props.data} />
            </div>

            <div style={{ position: 'absolute', left: 378, top: 169, transform: 'rotate(90deg)'}}>
              <NetworkLeds data={props.data} />
            </div>

            <div style={{ position: 'absolute', left: 410, bottom: 190, transform: 'rotate(-90deg)' }}>
              <LedInput data={props.data} />
            </div>
          </div>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={5} xl={2} style={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          <Inputs data={props.data} onChange={props.onChange} />
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={5} xl={2} style={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          <ComComponent data={props.data} onChange={props.onChange} />
        </Grid>

      </Grid>
  );
}

export default FormBoard;