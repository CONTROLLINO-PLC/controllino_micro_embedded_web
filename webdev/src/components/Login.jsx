import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Box, Avatar, TextField, Typography, Container } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme();
const classes = {
  button: {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '15px',
    background: 'yellow',
    height: '35px',
    width: '100%',
    textDecoration: 'none',
    marginTop: '30px',
    marginBottom: '20px'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '80px',
    justifyContent: 'center'
  },
  border: {
    border: '1px solid yellow',
    borderRadius: '5px',
    marginTop: '100px',
    backgroundColor: '#2f2f2f'
  }
};

const Login = ({ onLogin }) => {
  const [username, setUser] = useState('');
  const [ password, setPass ] = useState( '' );
  
  // Hardcoded username and password for now
  const realuser = "admin";
  const realpass = "admin";

  const handleLogin = () => {
    (username === realuser && password === realpass) ? (onLogin()) : null;
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        const submitButton = document.getElementById('submit');
        if (submitButton) {
          submitButton.click();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container component='main' maxWidth='xs' style={classes.border}>
        <Box style={classes.container}>
          <Avatar className='App-logo' sx = {{bottom:'30px', height: 40, backgroundColor: 'yellow'}}>
            <img style={classes.avatar} alt='Logo' src='/favicon.ico' />
          </Avatar>
          <Box component='form' noValidate sx={{ mt: 1 }}>
            <TextField
              onChange={(e) => setUser(e.target.value)}
              value={username}
              margin='normal'
              required
              fullWidth
              id='user'
              label='user'
              autoComplete='user'
              InputProps={{
                style: {
                  color: 'yellow',
                },
              }}
            />
            <TextField
              onChange={(e) => setPass(e.target.value)}
              value={password}
              margin='normal'
              required
              fullWidth
              label='password'
              type='password'
              id='pass'
              autoComplete='current-password'
              InputProps={{
                style: {
                  color: 'yellow',
                },
              }}
            />
          </Box>
          <Link id='submit' style={classes.button} onClick={handleLogin} to='/home'>
            <Typography component='h1' variant='h6' color='#000000'>
              Login
            </Typography>
          </Link>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
