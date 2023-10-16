import React from 'react';
import { Card, Typography, CardContent } from '@mui/material';
import ElectricalServicesIcon from '@mui/icons-material/ElectricalServices';

const classes = {
    titulo: {
        fontWeight: 'blond',
        fontSize: 12,
        color: 'white',
    },
    card:{
        background: '#404038',
        display: 'flex',
        justifyContent: 'center',
    },
    contentIcon:{
        color: 'yellow',
        display: 'flex',
        marginTop: '25%'
    },
    contentText:{
        display: 'flex',
        marginTop: '5%',
        marginLeft: '-10%'
    }
};

function VsuplyCard(props) {
    return (
        <Card style={classes.card}>
            <CardContent>
                <Typography style={classes.titulo}>
                    <ElectricalServicesIcon style={classes.contentIcon}/>
                </Typography>
            </CardContent>

            <CardContent style={classes.contentText}>
                <Typography style={classes.titulo}>
                    {props.titulo}
                </Typography>
            </CardContent>
        </Card>
    );
}

export default VsuplyCard;