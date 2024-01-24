import React, { useCallback, useEffect } from 'react';
import { Typography, Grid, Box } from '@mui/material';
import TextField from '@mui/material/TextField/TextField';
import Button from '@mui/material/Button';

let editFlag = false;
const classes = {
    root: {
        display: 'flex',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: '#4E586B'
    },
    container: {
        marginLeft : 15,
        marginTop : 10,
        borderRadius: '3px',
        border: 'solid grey 1px',
        width: 600,
        color: 'grey',
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#3C3D3C'
    },
    componentContainer: {
        borderRadius: 3,
        marginLeft: 2,
        marginBottom: 2,
        '& .MuiOutlinedInputRoot': {
            color:'white',
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
        borderRadius: '15px', 
        background: 'yellow', 
        color: '#000000',
        display: 'flex',
        width: '98%',
        marginTop: '8%',
        marginBottom: 5,
      }
};

function FormComms(props) {
    const handleClick = useCallback(() => {
        const ip = Array.from({ length: 4 }, (_, i) => document.getElementById(`ip${i}`).value).join('.');
        const subnet = Array.from({ length: 4 }, (_, i) => document.getElementById(`s${i}`).value).join('.');
        const gateway = Array.from({ length: 4 }, (_, i) => document.getElementById(`g${i}`).value).join('.');
        data[1] = { ...data[1], IP_address: ip, subnet, gateway, modifyed: true };
        props.onClick(data);
        data[1].modifyed = false;
        window.location.href = `http://${data[1].IP_address}:81/`;
      }, []);

    const editComms = () => {
        editFlag = true;
        setTimeout(() => {
            editFlag = false;
        }, '15000');
    };
    useEffect(() => {
        if (!props.data) return;
        const parsedData = JSON.parse(props.data)[2];
        const { ip, subnet, gateway, mac } = parsedData;
        
        const ipValues = ip.split('.');
        const subnetValues = subnet.split('.');
        const gatewayValues = gateway.split('.');
        const macValues = mac.split(':');
        
        if (!editFlag) {
          for (let i = 0; i < 4; i++) {
            document.getElementById(`ip${i}`).value = ipValues[i];
            document.getElementById(`s${i}`).value = subnetValues[i];
            document.getElementById(`g${i}`).value = gatewayValues[i];
          }
          
          for (let i = 0; i < 6; i++) {
            document.getElementById(`m${i}`).value = macValues[i];
          }
        }
      }, [props.data]);
    return (
        <div style={{display: 'flex', justifyContent: 'center'}}>
            <Grid container spacing={2} onClick={editComms} style={classes.container}>
                    <Grid item xs={12} sm={3} >
                        <Typography variant='h6' color='common.white'>
                            IP Address:
                        </Typography>
                    </Grid>
                    {[...Array(4)].map((_, index) => (
                        <Grid item xs={6} sm={2} key={index}>
                        <TextField
                        size='small'
                        style={classes.componentContainer} 
                        variant='outlined'
                        id={'ip' + index}
                        InputProps={{
                          sx: {
                            "& input": {
                                textAlign: "center",
                                color: 'white'
                            }
                            }
                          }}
                        />
                        </Grid>
                    ))}

                    <Grid item xs={12} sm={3} >
                        <Typography variant='h6' color='common.white'>
                            Subnet:
                        </Typography>
                    </Grid>
                    {[...Array(4)].map((_, index) => (
                        <Grid item xs={6} sm={2} key={index}>
                        <TextField
                        size='small'
                        style={classes.componentContainer} 
                        variant='outlined'
                        id={'s' + index}
                        InputProps={{
                          sx: {
                            "& input": {
                                textAlign: "center",
                                color: 'white'
                            }
                            }
                          }}
                        />
                        </Grid>
                    ))}

                    <Grid item xs={12} sm={3} >
                        <Typography variant='h6' color='common.white'>
                            Gateway:
                        </Typography>
                    </Grid>
                    {[...Array(4)].map((_, index) => (
                        <Grid item xs={6} sm={2} key={index}>
                        <TextField 
                        size='small'
                        style={classes.componentContainer} 
                        variant='outlined'
                        id={'g' + index}
                        InputProps={{
                          sx: {
                            "& input": {
                                textAlign: "center",
                                color: 'white'
                            }
                            }
                          }}
                        />
                        </Grid>
                    ))}

                    <Grid item xs={12} sm={3}>
                            <Typography variant='h6' color='common.white'>
                                MAC:
                            </Typography>
                    </Grid>
                    {[...Array(3)].map((_, index) => (
                        <Grid item xs={12} sm={2} key={index}>
                        <TextField
                        size='small'
                        style={classes.componentContainer} 
                        variant='outlined'
                        id={'m' + index}
                        InputProps={{
                          sx: {
                            "& input": {
                                textAlign: "center",
                                color: 'white'
                            }
                            }
                          }}
                        />
                        </Grid>
                    ))}
                    <Grid item xs={12} sm={1}/>
                    <Grid item xs={12} sm={3}/>
                    {[...Array(3)].map((_, index) => (
                        <Grid item xs={12} sm={2} key={index}>
                        <TextField
                        size='small'
                        style={classes.componentContainer} 
                        variant='outlined'
                        id={'m' +(index + 3)}
                        InputProps={{
                          sx: {
                            "& input": {
                                textAlign: "center",
                                color: 'white'
                            }
                            }
                          }}
                        />
                        </Grid>
                    ))}

                    <Grid container spacing={1} xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Grid item xs={6}>
                            <Button onClick={handleClick}
                                variant='contained'
                                style={{
                                    borderRadius: '15px', 
                                    background: '#D8D500', 
                                    color: '#000000',
                                    display: 'flex',
                                    width: '99%',
                                    marginLeft: '3%',
                                    marginTop: '8%',
                                    marginBottom: 10
                                    }}
                                >
                                save and reload page
                            </Button>
                        </Grid>

                        <Grid item xs={6}>
                            <Button onClick={handleClick}
                                variant='contained'
                                style={{
                                    borderRadius: '15px', 
                                    background: '#e15757', 
                                    color: 'white',
                                    display: 'flex',
                                    width: '99%',
                                    marginLeft: '2%',
                                    marginTop: '8%',
                                    marginBottom: 10
                                    }} 
                                >
                                save to memory
                            </Button>
                        </Grid>
                    </Grid>

            </Grid>

        </div>
    );
}

export default FormComms;