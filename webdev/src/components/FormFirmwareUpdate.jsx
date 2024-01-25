import React, { useCallback, useEffect, useState } from 'react';
import {Grid} from '@mui/material';
import Button from '@mui/material/Button';
import ThumbUpAlt from '@mui/icons-material/ThumbUpAlt';
import Loop from '@mui/icons-material/Loop';
import FastRewind from '@mui/icons-material/FastRewind';
import Upload from './UploadFileButton';

const classes = {
    container1: {
        marginTop : 15,
        borderRadius: '5px',
        border: 'solid grey 1px',
        width: 600,
        color: 'grey',
        backgroundColor: '#3C3D3C'
    },
    container2: {
        marginTop : 15,
        marginLeft: 15,
        borderRadius: '5px',
        border: 'solid grey 1px',
        width: 600,
        color: 'grey',
        backgroundColor: '#3C3D3C'
    },
      button: {
        borderRadius: '5px', 
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
        height: 40,
        fontFamily: 'Roboto,Helvetica,Arial,sans-serif'
    },
    text: {
        display: 'flex',
        justifyContent: 'left',
        flexDirection: 'column',
        color: 'white',
    },
    info:{
        fontSize: 16,
        marginBottom: 6,
        fontWeight: 'blond',
        fontFamily: 'Roboto,Helvetica,Arial,sans-serif',
    },
    icon:{
        color: 'black',
        fontSize: 23,
        margin: 8
    },
    browse:{
        color: 'white',
        marginLeft: 17,
        marginTop: 20
    }

};

function FormFirmware(props) {

    const [status, setStatus] = useState('NOT_COMMITED');
    const [crc32, setCrc32] = useState('9ec4ace4');
    const [size, setSize] = useState('84520');
    const [flached, setFlached] = useState('24/09/2023, 18:01:04');
    const [status_2, setStatus_2] = useState('COMMITED');
    const [crc32_2, setCrc32_2] = useState('0');
    const [size_2, setSize_2] = useState('0');
    const [flached_2, setFlached_2] = useState('01/01/1970, 01:00:00');
    
    // const handleClick = useCallback((event) => {
    //     props.onClick(event.target.id);
    //   }, []);

    const oncommit = ev => fetch('/api/firmware/commit')
    .then(r => r.json())

    const onreboot = ev => fetch('/api/device/reset')
    .then(r => r.json())
    .then(() => {
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    })
    .catch(error => console.error('Error:', error));

    const onrollback = ev => fetch('/api/firmware/rollback')
    .then(onreboot);

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
                        <div>{`Status: ${status}`}</div>

                        <div>{`CRC32: ${crc32}`}</div>

                        <div>{`Size: ${size}`}</div>

                        <div>{`Flached at: ${flached}`}</div>
                    </div>
                </Grid>

                <Grid container>
                    <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                        <Button onClick={oncommit} style={classes.button}
                            variant='contained'
                            id='commit'    
                        >
                            Commit this firmware
                            <ThumbUpAlt style={classes.icon}/>
                        </Button>
                    </Grid>

                    <Grid item xs={5} sm={5} md={5} lg={5} xl={5}>
                        <Button onClick={onreboot} style={classes.button}
                            variant='contained'
                            id='reboot0'    
                        >
                            Reboot device
                            <Loop style={classes.icon}/>
                        </Button>
                    </Grid>

                    <Grid container spacing={1}>



                    <Grid item xs={8} sm={8} md={8} lg={8} xl={12}>
                        <Upload/>
                    </Grid>
                    </Grid>

                </Grid>

            </Grid>
            

            <Grid container spacing={2} style={classes.container2}>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={classes.header}>
                    PREVIOUS FIRMWARE IMAGE
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}/>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={classes.text}>
                    <div style={classes.info}>
                        <div>{`Status: ${status_2}`}</div>

                        <div>{`CRC32: ${crc32_2}`}</div>

                        <div>{`Size: ${size_2}`}</div>

                        <div>{`Flached at: ${flached_2}`}</div>
                    </div>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}/>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}/>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}/>

                <Grid container>
                    <Grid item xs={7} sm={7} md={7} lg={7} xl={7}>
                        <Button onClick={onrollback} style={classes.button}
                            variant='contained'
                            id='rollback'
                        >
                            Rollback to this firmware
                            <FastRewind style={classes.icon}/>
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}/>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}/>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}/>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}/>

            </Grid>
        </div>
    );
}

export default FormFirmware;