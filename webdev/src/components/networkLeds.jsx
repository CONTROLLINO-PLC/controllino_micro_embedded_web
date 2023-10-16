import React, {useEffect} from 'react';
import { Box } from '@mui/material';
let count = 0;
const NetworkLeds = (props) => {
  useEffect(() => {
    if (!props.data) return;
        count ++;
        if(count%2 === 0){
            document.getElementById('network0').style.backgroundColor = '#4DFF10';
            document.getElementById('network1').style.backgroundColor = 'yellow';
        }else{
            document.getElementById('network0').style.backgroundColor = 'yellow';
            document.getElementById('network1').style.backgroundColor = '#4DFF10';
        }
        }, [props.data])
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', width: 60 }}>
        <Box
            id={'network0'}
            key={0}
            width={14}
            height={27}
            style={{
                backgroundColor:'grey',
                borderRadius: '10px'
            }}
        />
        <Box
            id={'network1'}
            key={1}
            width={14}
            height={27}
            style={{
                backgroundColor:'grey',
                borderRadius: '10px'
            }}
        />
    </div>
  );
};

export default NetworkLeds;
