import React, {useEffect} from 'react';
import { Box } from '@mui/material';

const RegletaLEDs = (props) => {

  useEffect(() => {
    if (!props.data) return;
    for (let index = 0; index < 10; index++) {
        const di = JSON.parse(props.data)[3].di[index];
        if ( di === true || di === 1) {
          document.getElementById('inputputLed' + index).style.backgroundColor = '#4DFF10';
        }else {
            document.getElementById('inputputLed' + index).style.backgroundColor = 'gray';
        }
    }
}, [props.data])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 249 }}>
      {[...Array(10)].map((_, index) => (
        <Box
            id={'inputputLed' + index}
            key={index}
            width={25}
            height={20}
            style={{
                backgroundColor:'grey'
            }}
        />
      ))}
    </div>
  );
};

export default RegletaLEDs;
