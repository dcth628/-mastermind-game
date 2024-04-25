import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import Button from '@mui/material/Button';
import './landingPage.css'

function LoadingPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const demoUserLogin = async (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login(
      {"credential":'john.smith@gmail.com', "password":'secret password'}))
      .then(history.push('/newgame'))
  };

  return (
    <div className="landing-page">
      <div className="landing-p">
        <h1>
          Welcome to the Quad Cipher
        </h1>
        <h1>
          You can sign up or log in to store your score
        </h1>
        <h1>
          or you can start the game as demo user
        </h1>
      </div>
      <div className="landing-button">
        <Button variant="contained" href="/login"
          size="large"
          fontWeight='bold'
          sx={{
            backgroundColor: '#77FB84',
            color: '#000000',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: '#65e072',
              boxShadow: '5px 5px 15px rgba(0,0,0,0.3)'
            }
          }}
        >Log In</Button>
        <Button variant="contained" href="/signup"
          size="large"
          fontWeight='bold'
          sx={{
            backgroundColor: '#77FB84',
            color: '#000000',
            fontSize: '18px',
            fontWeight: 'bold',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: '#65e072',
              boxShadow: '5px 5px 15px rgba(0,0,0,0.3)'
            }
          }}
        >Sign Up</Button>
        <Button variant="contained" href="/allspot"
          size="large"
          fontWeight='bold'
          onClick={demoUserLogin}
          sx={{
            backgroundColor: '#77FB84',
            color: '#000000',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.2)',
            borderRadius: '10px',
            '&:hover': {
              backgroundColor: '#65e072',
              boxShadow: '5px 5px 15px rgba(0,0,0,0.3)'
            }
          }}
        >Demo User</Button>
      </div>
    </div>
  )
};

export default LoadingPage;
