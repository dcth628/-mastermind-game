import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllScores } from '../../store/score';
import { getFewRound } from '../../store/round';
import { getFastTime } from '../../store/time';
import './leaderboard.css'

function Leaderboard() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state?.session.user);
    const userId = sessionUser.id;
    const score = useSelector((state) => state?.score);
    const scoreData = Object.values(score);
    const time = useSelector(state => state?.time);
    const timeData = Object.values(time);
    const round = useSelector(state => state?.round);
    const roundData = Object.values(round);

    const userData = scoreData.find(data => data.userId === userId)
    const scores = userData.numbers;

    const [filter, setFilter] = useState('score');

    const getActiveData = () => {
      switch (filter) {
        case 'score':
          return scoreData;
        case 'time':
          return timeData;
        case 'round':
          return roundData;
        default:
          return [];
      }
    };

    const data = getActiveData()


    useEffect(() => {
        dispatch(getAllScores());
        dispatch(getFewRound());
        dispatch(getFastTime());
    }, [dispatch]);

    return (
        <>
         <h1 className='user-score'>Your score is {scores}!!</h1>
        <div className="leaderboard">
            <div className="filter">
                <button activeClassName='filterActive'
                onClick={() => setFilter('score')}
                className={filter === 'score' ? 'filterActive' : ''}
                >Score</button>
                <button
                onClick={() => setFilter('time')}
                className={filter === 'time' ? 'filterActive' : ''}
                >Time</button>
                <button
                onClick={() => setFilter('round')}
                className={filter === 'round' ? 'filterActive' : ''}
                >Round</button>
            </div>
            <div className="ranking">
                <table>
                    <thead>
                        <tr>
                            <th>RANK</th>
                            <th>NAME</th>
                            <th>{filter.toUpperCase()}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filter === 'score' ? scoreData.map((score, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{score.Player}</td>
                                <td>{score.numbers}</td>
                            </tr>
                        )): <></>}
                        {filter === 'time' ? timeData.map((time, index) => (
                            <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{time.Player}</td>
                            <td>{time.time}</td>
                        </tr>
                        )): <></>}
                        {filter === 'round' ? roundData.map((round, index) => (
                            <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{round.player}</td>
                            <td>{round.round}</td>
                        </tr>
                        )): <></>}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
}

export default Leaderboard;
