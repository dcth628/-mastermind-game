import React from 'react';
import { NavLink } from 'react-router-dom'; // NavLink is used for navigation
import './Navigation.css'; // Assuming you have a CSS file for styling

function Navigation() {
  return (
    <nav className="navigation">
      <NavLink className="nav-button" activeClassName="active" to="/newgame">Start a new game</NavLink>
      <NavLink className="nav-button" activeClassName="active" to="/game-history">Game History</NavLink>
      <NavLink className="nav-button" activeClassName="active" to="/leaderboard">Leaderboard</NavLink>
      <NavLink className="nav-button" activeClassName="active" to="/rules">Rules</NavLink>
      <NavLink className="nav-button" activeClassName="active" to="/logout">Log out</NavLink>
    </nav>
  );
}

export default Navigation;
