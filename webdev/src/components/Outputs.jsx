import React, { useContext, useEffect, useState } from 'react';
import { Slider, Grid, Typography, Checkbox, Switch, TextField, Button } from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import { styled } from '@mui/material/styles';
import { context } from '../App';
import ItemContainer from './ItemContainer';

const classes = {
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  container: {
    border: 'solid gray 1px',
    borderRadius: '3px',
    backgroundColor: '#3C3D3C',
    padding: 15,
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: '15px',
  },
  alert: {
    color: 'white',
    fontSize: '20px',
  },
  labelContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  label: {
    color: 'white',
    fontSize: '13px',
  },
  componentContainer: {
    display: 'flex',
    justifyContent: 'center',
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
    },
  },
  button: {
    borderRadius: '20px',
    background: 'yellow',
    color: 'black',
  },
};
const CustomSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: 'yellow',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: 'yellow',
  },
  '& .MuiSwitch-switchBase': {
    color: '#ccc',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  '& .MuiSwitch-track': {
    backgroundColor: '#ccc',
  },
}));

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function OutputComponent(props) {
  const { setData, data } = useContext(context);
  const [sliderValues, setSliderValues] = useState(Array(8).fill(5));
  const [checkboxValues, setCheckboxValues] = useState(Array(8).fill(false));
  const [switchValues, setSwitchValues] = useState(Array(8).fill(false));
  const [currentValues, setCurrentValues] = useState(Array(8).fill('3.000'));
  const [warning, setWarning] = useState(false);

  const handleStateChange = (index, value, array, setFunction) => {
    const temp = JSON.parse(JSON.stringify(array));
    temp[index] = value;
    setFunction(temp);
  }

  const handleSliderChange = (index) => (event, value) => {
    if (checkboxValues[index]) return;

    handleStateChange(index, value, data, setData);
    handleStateChange(index, value, sliderValues, setSliderValues);
    props.onChange({ id: `sliders-${index}`, value: value });
  };

  const handleCheckboxChange = (index) => (event) => {
    const value = event.target.checked;
    handleStateChange(index, value, checkboxValues, setCheckboxValues);
  };

  const validateCurrentValue = (value) => {
    if (value == '') return true;
    return (value >= 0.5 && value <= 3);
  }

  const handleSwitchChange = (index) => (event) => {
    const isChecked = checkboxValues[index];
    const value = event.target.checked;

    handleStateChange(index, value, switchValues, setSwitchValues);
    handleStateChange(index, value ? 100 : 0, data, setData);
    handleStateChange(index, value ? 100 : 0, sliderValues, setSliderValues);
    props.onChange({ id: `switchs-${index}`, value: value });

    if (isChecked || !value) return;

    setTimeout(() => {
      handleStateChange(index, false, switchValues, setSwitchValues);
      handleStateChange(index, 0, data, setData);
      handleStateChange(index, 0, sliderValues, setSliderValues);
      props.onChange({ id: `switchs-${index}`, value: false });
    }, 500);
  };

  const handleButtonClick = (index) => {
    if (validateCurrentValue(currentValues[index]) && !!currentValues[index]) {
      props.onChange({ id: `current_limits-${index}`, value: parseFloat(currentValues[index]) });
    }
  };

  const handleCurrentChange = (index, value) => {
    handleStateChange(index, value || '', currentValues, setCurrentValues);
  }

  useEffect(() => {
    const needForAlert = currentValues.find(i => !validateCurrentValue(i));
    if (!!needForAlert) return setWarning(true);
    setWarning(false);
  }, [currentValues]);

  return (
    <ItemContainer title='OUTPUTS' warning={warning}>
      <div style={classes.labelContainer}>
        <Typography variant="caption" style={classes.label}>
          CURRENT LIMIT A
        </Typography>
        <Typography variant="caption" style={classes.label}>
          PWM
        </Typography>
        <Typography variant="caption" style={classes.label}>
          DIGITAL
        </Typography>
      </div>
      <div>
        {[...Array(8)].map((_, index) => (
          <Grid container key={`DO${index}`} spacing={1} alignItems='center'>
            {/* <Typography variant='caption' style={classes.labelLeft}>DO{index}</Typography> */}
            <Grid item xs={4}>
              <TextField
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleButtonClick(index);
                }}
                value={currentValues[index]}
                onChange={(event) => handleCurrentChange(index, event.target.value)}
                style={classes.componentContainer}
                size='small'
                id={`currentLimit${index}`}
                InputProps={{
                  sx: {
                    color: 'white',
                    "& input": {
                      textAlign: "center !important",
                  }
                  },
                }}
              />
            </Grid>

            <Grid item xs={2}>
              <Button
                disabled={!validateCurrentValue(currentValues[index])}
                style={classes.button}
                variant='contained'
                onClick={() => handleButtonClick(index)}
              >
                set
              </Button>
            </Grid>

            <Grid item xs={3}>
              <Slider
                value={switchValues[index] ? 100 : sliderValues[index]}
                min={0}
                max={100}
                onChange={handleSliderChange(index)}
                style={{ ...classes.slider, marginLeft: 12 }}
              />
            </Grid>
            <Grid item xs={1}>
              <Checkbox
                checked={checkboxValues[index]}
                onChange={handleCheckboxChange(index)}
              />
            </Grid>
            <Grid item xs={2}>
              <CustomSwitch
                style={classes.switch}
                checked={switchValues[index]}
                onChange={handleSwitchChange(index)}
              />
            </Grid>
          </Grid>
        ))}
      </div>

    </ItemContainer>
  );
}

export default OutputComponent;