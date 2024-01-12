import React, { useCallback, useEffect } from 'react';
import {Grid} from '@mui/material';
import Button from '@mui/material/Button';

const classes = {
    container1: {
        marginTop : 10,
        borderRadius: '3px',
        border: 'solid grey 1px',
        width: 600,
        color: 'grey',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#3C3D3C'
    },
    container2: {
        marginTop : 10,
        marginLeft: 10,
        borderRadius: '3px',
        border: 'solid grey 1px',
        width: 600,
        color: 'grey',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#3C3D3C'
    },
      button: {
        borderRadius: '3px', 
        background: 'yellow', 
        color: '#000000',
        width: '86%',
        marginTop: '3%',
        marginLeft: 15,
        marginBottom: 3,
      },

      header:{
        borderBottom: 'solid grey 1px',
        color: 'white',
        fontSize: 17,
        height: 40
    },
    text: {
        display: 'flex',
        justifyContent: 'left',
        flexDirection: 'column',
        color: 'white',
        fontSize: 14,
    },
    info:{
        fontSize: 16,
        marginBottom: 6
    }

};

function FormFirmware(props) {
    const handleClick = useCallback(() => {

      }, []);

    useEffect(() => {
        if (!props.data) return;
        const parsedData = JSON.parse(props.data)[2];
        
      }, [props.data]);

    return (
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'row'}}>
            <Grid container spacing={2} style={classes.container1}>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={classes.header}>
                    CURRENT FIRMWARE IMAGE
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={classes.text}>
                    <div style={classes.info}>
                        <div>Status: NOT_COMMITED</div>

                        <div>CRC32: 9ec4ace4</div>

                        <div>Size: 84520</div>

                        <div>Flached at: 24/09/2023, 18:01:04</div>
                    </div>
                </Grid>

                <Grid container>
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <Button onClick={handleClick} style={classes.button}
                            variant='contained'>
                            Commit this firmware
                        </Button>
                    </Grid>

                    <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                        <Button onClick={handleClick} style={classes.button}
                            variant='contained'>
                            Reboot device
                        </Button>
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Button onClick={handleClick} style={classes.button}
                            variant='contained'>
                            Upload new firmware: choose .bin file
                        </Button>
                    </Grid>

                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={classes.text}>
                <div style={classes.info}>
                    <div>Uploading firmware .bin, bytes 84520 .. 84520 of 84520.</div>
                    <div>Done, resetting device...</div>
                </div>
                </Grid>

            </Grid>

            <Grid container spacing={2} style={classes.container2}>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={classes.header}>
                    PREVIOUS FIRMWARE IMAGE
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={classes.text}>
                    <div style={classes.info}>
                        <div>Status: COMMITED</div>

                        <div>CRC32: 0</div>

                        <div>Size: 0</div>

                        <div>Flached at: 01/01/1970, 01:00:00</div>
                    </div>
                </Grid>

                <Grid container>
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <Button onClick={handleClick} style={classes.button}
                            variant='contained'>
                            Rollback to this firmware
                        </Button>
                    </Grid>
                </Grid>

            </Grid>
        </div>
    );
}

export default FormFirmware;