import React from 'react';
import './Rules.css';

function Rules() {
    return (
            <div className="game-rules">
                <p>At the start of the game the computer will randomly select a pattern of four different numbers from a total of 8 different numbers.</p>
                <p>A player will have 10 attempts to guess the number combinations</p>
                <p>At the end of each guess, computer will provide one of the following response as feedback:</p>
                <ul>
                    <li>The player had guess a correct number</li>
                    <li>The player had guessed a correct number and its correct location</li>
                    <li>The player's guess was incorrect</li>
                </ul>
                <p>Example Run:</p>
                <p>Game initializes and selects "0 1 3 5"</p>
                <p>Player guesses “2 2 4 6”, game responds “0 correct number and 0 correct location”</p>
                <p>Player guesses “0 2 4 6”, game responds “1 correct number and 1 correct location”</p>
                <p>Player guesses “2 2 1 1”, game responds “1 correct number and 0 correct location”</p>
                <p>Player guesses “0 1 5 6”, game responds “3 correct numbers and 2 correct location”</p>
                <p>Player guesses “0 1 3 5”, game responds “4 correct numbers and 4 correct location”</p>
                <div className="indicators">
                    <div>
                        <span className="indicator yellow"></span> <span>yellow ball indicate correct number</span>
                    </div>
                    <div>
                        <span className="indicator green"></span> <span>green ball indicate correct location</span>
                    </div>
                </div>
            </div>
    );
}

export default Rules;
