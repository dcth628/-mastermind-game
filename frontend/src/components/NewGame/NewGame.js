import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createNewGame } from '../../store/game';
import './NewGame.css';

const NewGame = () => {
    const history = useHistory();
    const dispatch = useDispatch();

    const difficultySelect = async (value) => {
        let response = await dispatch(createNewGame(value))
        if (response) {
            await history.push('/gamepage')
        }
    };


    return (
        <div className='newGameContainer'>
            <h1>Start a new game</h1>
            <p>Please choose the difficulty</p>
            <div className='buttonContainer'>
                <button
                    className='button easy'
                    onClick={() => difficultySelect(7)}
                >
                    Easy
                </button>
                <button
                    className='button medium'
                    onClick={() => difficultySelect(8)}
                >
                    Medium
                </button>
                <button
                    className='button hard'
                    onClick={() => difficultySelect(9)}
                >
                    Hard
                </button>
            </div>
        </div>
    );
};

export default NewGame;
