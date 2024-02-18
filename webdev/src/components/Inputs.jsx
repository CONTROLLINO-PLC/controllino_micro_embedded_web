import React, { useEffect, useState } from 'react';
import { Grid, Typography, TextField, Button } from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import ItemContainer from './ItemContainer';

const classes = {
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  container: {
    border: 'solid gray 1px',
    borderRadius: '3px',
    backgroundColor: '#3C3D3C',
    padding: 15,
  },
  boxcontainer: {
    border: 'solid yellow 1px',
    borderRadius: '3px',
    color: 'white',
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

    }
  },
  componentContainer: {
    borderRadius: '3px',
    display: 'flex',
    justifyContent: 'center',
    color: 'white',
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

    }
  },
  labelLeft: {
    color: 'white',
    fontSize: '12px'
  },
  labelRigth: {
    color: 'white',
    fontSize: '12px'
  },

  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  title: {
    color: 'white',
    fontSize: '15px'
  },
  alert: {
    color: 'white',
    fontSize: '20px',
  },
  subtitle: {
    color: 'white',
    fontSize: '13px'
  },
  labelContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: 5,
  },
  analogPin: {
    fontSize: '15px'
  },
  maximum: {
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
  button: {
    borderRadius: '20px',
    background: 'yellow',
    color: 'black'
  }

};

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function InputsComponent(props) {
  // const {setData} = useContext(context);
  const [warning, setWarning] = useState(false);
  const [analogPin, setAnalogPin] = useState(Array(10).fill('0.000'));
  const [digitals, setDigitals] = useState(Array(10).fill('0.000'));

  useEffect(() => {
    if (!props.data) return;
    const parsedData = JSON.parse(props.data)[3].ai;
    setAnalogPin([
      parsedData[0].toFixed(3),
      parsedData[1].toFixed(3),
      parsedData[2].toFixed(3),
      parsedData[3].toFixed(3),
      parsedData[4].toFixed(3),
      parsedData[5].toFixed(3),
      parsedData[6].toFixed(3),
      parsedData[7].toFixed(3),
      parsedData[8].toFixed(3),
      parsedData[9].toFixed(3),
    ]);
  }, [props.data]);

  const validateCurrentValue = (value) => {
    if (value == '') return true;
    return (value >= 0 && value <= 30);
  }

  const handleStateChange = (index, value, array, setFunction) => {
    const temp = JSON.parse(JSON.stringify(array));
    temp[index] = value;
    setFunction(temp);
  }

  useEffect(() => {
    const needForAlert = digitals.find(i => !validateCurrentValue(i));
    if (!!needForAlert) return setWarning(true);
    setWarning(false);
  }, [digitals]);

  const handleDigitalChange = (index, value) => {
    handleStateChange(index, value || '', digitals, setDigitals);
  };

  const handleButtonClick = (index) => {
    if (validateCurrentValue(digitals[index])) {
      props.onChange({ id: `digital_threshold-${index}`, value: parseFloat(digitals[index]) });
    }
  };

  return (
    <ItemContainer title="INPUTS" warning={ warning } >
      <div style={classes.labelContainer}>
        <Typography variant='caption' style={classes.labelLeft}>
          READINGS
        </Typography>

        <Typography variant='caption' style={classes.labelRigth}>
          DIGITAL THRESHOLD V
        </Typography>
      </div>

      <div>
        {[...Array(10)].map((_, index) => (
          <Grid container key={`DO${index}`} spacing={1} alignItems='center' marginBottom={index === 5 ? 2 : 0.5}>
            <Grid item xs={5}>
              <TextField
                value={`${analogPin[index]} V`}
                style={{...classes.componentContainer, height: '50%'}}
                variant='outlined'
                size='small'
                InputProps={{
                  sx: {
                    color: 'white',
                    height: 33,
                    "& input": {
                      textAlign: "center",
                  }
                  },
                }}
              />
            </Grid>

            <Grid item xs={5}>
              <TextField
                onKeyDown={(e) => {if (e.key === 'Enter') handleButtonClick(index);}}
                onChange={(event) => handleDigitalChange(index, event.target.value)}
                value={digitals[index]}
                style={{...classes.componentContainer}}
                variant='outlined'
                size='small'
                id={'digitalThreshold' + index}
                InputProps={{
                  sx: {
                    color: 'white',
                    height: 33,
                    "& input": {
                      textAlign: "center",
                  }
                  },
                }}
              />
            </Grid>
            <Grid item xs={2}>
              <Button
                disabled={!validateCurrentValue(digitals[index])}
                style={{ ...classes.button, height: '30px'}}
                variant='contained'
                onClick={() => handleButtonClick(index)}>
                set
              </Button>
            </Grid>
          </Grid>

        ))}
      </div>
    </ItemContainer>
  );
}

export default InputsComponent;