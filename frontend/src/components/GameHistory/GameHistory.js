import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllGames } from '../../store/game';
import OpenModalButton from "../OpenModalButton/index";
import GameGuessDetail from '../GameDetail/GameDetail';
import './GameHistory.css'

function GameHistory() {
    const dispatch = useDispatch();

    const game = useSelector((state) => state?.game)
    const games = Object.values(game)

    const dateFormat = (date) => {
        const newDate = new Date(date);
        const month = (newDate.getMonth() + 1).toString().padStart(2, '0')
        const day = (newDate.getDate()).toString().padStart(2, '0')
        const year = (newDate.getFullYear()).toString()
        const hour = (newDate.getHours()).toString().padStart(2, '0')
        const min = (newDate.getMinutes()).toString().padStart(2, '0')
        return month +'/'+day+'/'+year+' '+hour+':'+min
    };

    useEffect(() => {
        dispatch(getAllGames());
    }, [dispatch]);

    return (
        <div className="game-page">
            <div className='game-history'>
                {games.map((game, index) => (
                    <OpenModalButton
                    buttonText={
                        <div key={game.id} className="game-card">
                        <h3>Game {index + 1}</h3>
                        <p>Difficulty: {game.difficulty}</p>
                        <p>Solved: {game.solve === false ? 'N' : 'Y'}</p>
                        <p>{dateFormat(game.createdAt)}</p>
                    </div>
                    }
                    modalComponent={<GameGuessDetail gameId={game.id} index={index} gameNumber={game.number}/>} />
                ))}
            </div>
        </div>
    );
}

export default GameHistory;
