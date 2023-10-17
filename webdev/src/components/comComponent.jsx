import React, { useState, useEffect } from 'react';
import { Grid, TextField, Button, MenuItem } from '@mui/material';
import ItemContainer from './ItemContainer';

const classes = {
  container: {
    border: 'solid gray 1px',
    borderRadius: '3px',
    backgroundColor: '#3C3D3C',
    padding: 15,
  },
  select: {
    '& & .MuiOutlinedInputRoot': {
      '& fieldset': {
        borderColor: 'transparent',
      },
      '&:hover fieldset': {
        borderColor: 'transparent',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'transparent',
      },
    },
    '& input': {
      color: 'white',
    },
    width: '100%'
  },
}


const ComComponent = (props) => {
  const [inputValue, setInputValue] = useState('');
  const [serials, setSerials] = useState([]);
  const [selectedOption, setSelectedOption] = useState('nl');

  useEffect(() => {
    if (!props.data) return;
    setSerials(JSON.parse(props.data)[0].serial);
  }, [props.data])

  const handleButtonClick = () => {
    props.onChange({ id: 'RS485', value: inputValue });
    //setSerials([...serials, inputValue]);
    setInputValue('')
  };

  const handleOptionChange = (event) => {
    const value = event.target.value;
    setSelectedOption(value);
    props.onChange({ id: 'terminal', value});
  };

  return (
    <ItemContainer title='CAN / RS485'>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
        <TextField
          onKeyDown={(e) => {if (e.key === 'Enter') handleButtonClick();}}
          variant='outlined'
          sx={{
            '& & .MuiOutlinedInputRoot': {
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
            '& input': {
              color: 'white',
            },
            borderRadius: '3px',
            backgroundColor: '#565656',
            width: '100%',
          }}
          size='small'
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Button
          variant='contained'
          sx={{
            marginLeft: '1rem',
            borderRadius: '20px',
            background: 'yellow !important',
            color: 'black',
            height: '40px'
          }}
          onClick={handleButtonClick}
        >
          SEND
        </Button>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
      <TextField style={{...classes.select}}
        select
        labelid='select-label'
        defaultValue={'nl'}
        value={selectedOption}
        onChange={handleOptionChange}
                size='small'
        InputProps={{
          style: {
            color: 'white',
          },
        }}
      >
        <MenuItem value='nl'>New Line</MenuItem>
        <MenuItem value='cr'>Carriage Return</MenuItem>
        <MenuItem value='bnc'>Both NL & CR</MenuItem>
      </TextField>
        <Button
          variant='contained'
          sx={{
            marginLeft: '1rem',
            borderRadius: '20px',
            background: 'black !important',
            color: 'yellow',
            height: '40px',
            fontSize: '12px'
          }}
          onClick={() => setSerials([])}
        >
          CLEAR
        </Button>
      </Grid>
      <div style={{
        overflowY: 'auto',
        border: '1px solid yellow',
        backgroundColor: '#251c1a',
        padding: '4px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '20px',
        height: '68%',
      }}>
        {serials.map((serial, key) => <p key={key} style={{ marginBlockStart: 0, marginBlockEnd: 2 }}>{'>_ ' + serial.replace('\\n', `\n`)}</p>)}
        <p style={{ marginBlockStart: 0, marginBlockEnd: 2 }}>{'>_'}</p>
      </div>

    </ItemContainer>
  );
};

export default ComComponent;
