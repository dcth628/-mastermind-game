import React, {useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { NavLink } from 'react-router-dom';
import { logout } from '../../store/session';
import './Navigation.css';

function Navigation() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [time, setTime] = useState(0);
  const [timerId, setTimerId] = useState(null);

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    history.push('/')
  };

  useEffect(() => {
        setTime(0);
}, [dispatch]);

  return (
    <>
    <nav className="navigation">
      <NavLink className="nav-button" activeClassName="active" to="/newgame">Start a new game</NavLink>
      <NavLink className="nav-button" activeClassName="active" to="/history">Game History</NavLink>
      <NavLink className="nav-button" activeClassName="active" to="/leaderboard">Leaderboard</NavLink>
      <NavLink className="nav-button" activeClassName="active" to="/rules">Rules</NavLink>
      <button className="nav-button" onClick={handleLogout} to="/logout">Log out</button>
    </nav>
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
}

export default Navigation;
