import React, { useState } from "react";
import * as sessionActions from '../../store/session';
import { useDispatch } from "react-redux";
import './LoginForm.css'
import { useHistory } from "react-router-dom";
import * as seesionActions from '../../store/session'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const LoginForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors([]);
        return dispatch(sessionActions.login({ credential, password }))
            .then(history.push('/newgame'))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.errors) setErrors(data.errors);
            });
    };

    const demoUserLogin = async (e) => {
        e.preventDefault();
        return dispatch(sessionActions.login(
            {"credential":'demo@user.io', "password":'password6'}))
        .then(history.push('/newgame'))
    };

    return (
        <>
            <form
                className="login-form"
                onSubmit={handleSubmit}>
                <h1 className='login'>Log In</h1>
                <ul>
                    {errors.map((error, idx) =>
                        <li key={idx}>{error}</li>
                    )}
                </ul>
                <div className="login-input">
                    <TextField id="outlined-basic"
                        label="Username or Email"
                        variant="outlined"
                        type="email"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                        sx={{
                            width: '510px',
                            '& .MuiOutlinedInput-root': {
                                height: '56px',
                                backgroundColor: '#fff',
                                borderRadius: '15px',
                                '& fieldset': {
                                    // backgroundColor: '#fff',
                                    borderRadius: '15px',
                                },
                            },
                        }}
                    />
                </div>
                <div className="login-input">
                    <TextField
                        id="outlined-password-input"
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        sx={{
                            width: '510px',
                            '& .MuiOutlinedInput-root': {
                                height: '56px',
                                backgroundColor: '#fff',
                                borderRadius: '15px',
                                '& fieldset': {
                                    borderRadius: '15px',
                                },
                            },
                        }}
                    />
                </div>
                <div className="login-input">
                    <Button variant="contained" type="submit"
                        fontWeight='bold'
                        sx={{
                            width: '510px',
                            backgroundColor: '#77FB84',
                            color: '#000000',
                            fontSize: '18px',
                            boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
                            borderRadius: '15px',
                            '&:hover': {
                                backgroundColor: '#65e072',
                                boxShadow: '5px 5px 15px rgba(0,0,0,0.3)'
                            }
                        }}
                    >Log In</Button>
                </div>
                <div className="link-text">
                    Don't have an account? <a href='/signup'>Sign Up</a><br></br>
                    Log in as a <button onClick={demoUserLogin} >Demo User</button>
                </div>
            </form>
            <div className="footer">
				<div>
					<a href='https://github.com/dcth628/' target="_blank"  rel="noreferrer">
						<i className='fab fa-github'></i>
					</a>
					<a href='https://www.linkedin.com/in/deanhsieh/' target="_blank"  rel="noreferrer">
						<i className='fab fa-linkedin-in'></i>
					</a>
				</div>
				<div>Term of Use ・ Privacy Policy</div>
				<p>&copy; 2024 Copyright Dean Hsieh </p>
			</div>
        </>

    );
};

export default LoginForm;
