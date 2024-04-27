import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as sessionActions from "../../store/session";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './SignupForm.css';

function SignupForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(sessionActions.signup({ email, username, firstName, lastName, password }))
      .then(history.push('/newgame'))
      .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        });
    }
    return setErrors(['Confirm Password field must be the same as the Password field']);
  };

  const demoUserLogin = async (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login(
      {"credential":'demo@user.io', "password":'password6'}))
      .then(history.push('/newgame'))
  };


  return (
    <div>
      <form className="sign-up-page" onSubmit={handleSubmit}>
        <h1 className="signup">Sign Up</h1>
        <ul>
          {errors.length > 1 ?
            <li>{errors}</li> :
            errors.map((error, idx) =>
              <li key={idx}>{error}</li>
            )}
        </ul>

        <div className="login-input">
          <TextField id="outlined-basic"
            label="Email"
            variant="outlined"
            value={email}
            type="email"
            required
            onChange={(e) => setEmail(e.target.value)}
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
          <TextField id="outlined-basic"
            label="Username"
            variant="outlined"
            value={username}
            required
            onChange={(e) => setUsername(e.target.value)}
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
          <TextField id="outlined-basic"
            label="First Name"
            variant="outlined"
            value={firstName}
            required
            onChange={(e) => setFirstName(e.target.value)}
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
          <TextField id="outlined-basic"
            label="Last Name"
            variant="outlined"
            value={lastName}
            required
            onChange={(e) => setLastName(e.target.value)}
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
          <TextField
            id="outlined-password-input"
            label="Confirm Password"
            type="password"
            autoComplete="current-password"
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          Have an account? <a href='/login'>Log In</a><br></br>
          Log in as a <button onClick={demoUserLogin} >Demo User</button>
        </div>
      </form>
    </div>
  );
}

export default SignupForm;
