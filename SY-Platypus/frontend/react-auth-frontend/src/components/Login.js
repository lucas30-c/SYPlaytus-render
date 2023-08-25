import React, { useState, useRef, useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import axios from 'axios';
import { Paper, Avatar, TextField, Button, createTheme, ThemeProvider } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { Navigate, useNavigate } from 'react-router-dom';



const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', { username, password });
            const token = response.data.token;
            localStorage.setItem('token', token);
            console.log("Logged in!");

            //navigate to pre-survey upon succesful login
            navigate('/presurvey');
        } catch (error) {
            console.error("Error during login:", error);
        }
    };
    const theme = createTheme({
        palette: {
            primary: {
                main: '#5d5fef'
            }
        }
    })
    const paperstyle = { padding: 20, height: '400px', width: '300px', margin: "100px auto", background: "#E4E4FC" }
    return (
        <ThemeProvider theme={theme}>
            <Grid>
                <Paper elevation={10} style={paperstyle}>
                    <Grid align="center">
                        <Avatar sx={{ bgcolor: "#8D8FF3" }}>
                            <LoginIcon />

                        </Avatar>
                        <h2>Synesthesia</h2>
                    </Grid>
                    <TextField label='Username' margin='normal' onChange={e => setUsername(e.target.value)} fullWidth required />
                    <TextField label='Password' margin='normal' type='password' onChange={e => setPassword(e.target.value)} fullWidth required />
                    <Button type='submit' color='primary' variant="contained" style={{ margin: '30px' }} onClick={handleLogin}>Log in</Button>
                </Paper>

            </Grid>
        </ThemeProvider>


    );
};

export default Login;
