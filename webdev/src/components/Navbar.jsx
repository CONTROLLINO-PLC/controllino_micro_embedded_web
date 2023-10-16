import React from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Grid, Button} from '@mui/material';
import Logo from '../assets/img/controllino.png';

const classes = {
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: '16px'
    },
    title: {
        flexGrow: 1
    },
    imagen: {
        borderRadius: '0%'
    },
    style: {
        background: '#2E3B55'
    }

};

function Navbar(props) {

    return (
        <div style={classes.root}>
            <AppBar position='fixed' style={{ background: '#111111' }}>
                <Toolbar style={{ justifyContent: 'space-between' }}>
                    <Box
                        component='img'
                        sx={{
                            height: 40,
                        }}
                        alt='Logo'
                        src={Logo}
                    />
                    <Grid item xs={0} sm={0} md={0} lg={0} xl={0.2}></Grid>

                    <Box style={{ textAlign: 'center', width: 200, height: 25, borderRadius: '15px', background: '#D8D500', color: '#000000' }}>
                        <Typography style={{marginTop: '1.5%'}}>MICRO Embedded Web</Typography>
                    </Box>

                    <IconButton color='inherit'/>

                    <Button onClick={props.onClick} variant='contained' color='primary' style={{ marginLeft: 'auto', background: '#D8D500', borderRadius: '20px', color: '#000000', height: 30 }}>Logout</Button>

                </Toolbar>

            </AppBar>

        </div>
    );
}

export default Navbar;