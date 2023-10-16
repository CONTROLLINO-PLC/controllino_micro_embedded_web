import React, { useContext, useEffect } from 'react';
import { Box } from '@mui/material';
import { context } from '../App';

const RegletaLEDs = (props) => {
  const { data } = useContext(context);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: 197 }}>
      {[...Array(8)].map((_, index) => (
        <Box
          id={'outputLed' + index}
          key={index}
          width={25}
          height={20}
          style={{
            backgroundColor: `RGB(${128 - data[index] * 0.51}, ${128 + data[index]* 1.27}, ${128 - data[index] * 1.12})`
          }}
        />
      ))}
    </div>
  );
};

export default RegletaLEDs;
