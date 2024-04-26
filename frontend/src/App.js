import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route, useLocation } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import AllSpots from "./components/SpotsAll";
import SpotDetails from "./components/SpotDetails";
import CreateSpotForm from "./components/SpotCreate";
import EditSpotForm from "./components/SpotEdit";
import EditReviewForm from "./components/ReviewEdit";
import CreateReviewFrom from "./components/ReviewCreate";
import CurrentSpot from "./components/SpotCurrent";
import LoadingPage from "./components/LandingPage/landingPage";
import LoginForm from "./components/LoginForm/LoginForm";
import SignupForm from "./components/SignupForm/SignupForm";
import NewGame from "./components/NewGame/NewGame";
import GamePage from "./components/GamePage/GamePage";
import GameHistory from "./components/GameHistory/GameHistory";
import Leaderboard from "./components/Leaderboard/Leaderboard";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);
  const showNavigation = isLoaded && !['/', '/login', '/signup'].includes(location.pathname);

  return (
    <>
      {showNavigation && <Navigation />}
      <Switch>
        <Route exact path="/">
          <LoadingPage />
        </Route>
        <Route exact path="/login">
          <LoginForm />
        </Route>
        <Route exact path="/signup">
          <SignupForm />
        </Route>
        <Route exact path="/allspot">
          <AllSpots />
        </Route>
        <Route exact path='/newgame'>
          <NewGame />
        </Route>
        <Route exact path='/gamepage'>
          <GamePage />
        </Route>
        <Route path='/history'>
          <GameHistory />
        </Route>
        <Route path='/leaderboard'>
          <Leaderboard />
        </Route>
        <Route path='/reviews/:reviewId/edit'>
          <EditReviewForm />
        </Route>
        <Route path='/:spotId/reviews'>
          <CreateReviewFrom />
        </Route>
      </Switch>
    </>
  );
}

export default App;
