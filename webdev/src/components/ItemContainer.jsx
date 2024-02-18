import React from 'react';
import { Snackbar, Typography, Switch } from '@mui/material';
import MuiAlert from "@mui/material/Alert";
import { styled } from '@mui/material/styles';

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

function ItemContainer(props) {

    return (
        <div style={{...classes.container, width: '400px', height: '430px', marginTop: 80}}>
            <Snackbar open={props.warning}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                style={{
                    top: '8%'
                }}
            >
                <Alert severity="warning">
                    <Typography variant="h1" style={classes.alert}>
                        Current range can only be 0.5 to 3A!
                    </Typography>
                </Alert>
            </Snackbar>
            <div style={{ textAlign: 'center', margin: 5 }}>
                <Typography variant="h1" style={classes.title}>
                    {props.title}
                </Typography>
            </div>
            {  props.children }
        </div>
    );
}

export default ItemContainer;