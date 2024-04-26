import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { NavLink } from 'react-router-dom';
import { logout } from '../../store/session';
import './Navigation.css';

function Navigation() {
  const dispatch = useDispatch();
  const history = useHistory();
  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    history.push('/')
  };

  return (
    <nav className="navigation">
      <NavLink className="nav-button" activeClassName="active" to="/newgame">Start a new game</NavLink>
      <NavLink className="nav-button" activeClassName="active" to="/game-history">Game History</NavLink>
      <NavLink className="nav-button" activeClassName="active" to="/leaderboard">Leaderboard</NavLink>
      <NavLink className="nav-button" activeClassName="active" to="/rules">Rules</NavLink>
      <button className="nav-button" onClick={handleLogout} to="/logout">Log out</button>
    </nav>
  );
}

export default Navigation;
