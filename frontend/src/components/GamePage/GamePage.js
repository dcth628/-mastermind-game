import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { checkResult } from '../../store/check';
import { getHint } from '../../store/hint';
import { updateWinGame } from '../../store/game';
import { updateWinGuess } from '../../store/guess';
import Modal from '../Navigation/OpenModalMenu';
import './GamePage.css';

const GamePage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const firstInputRef = useRef(null);
    const difficulty = useSelector((state) => state?.game.difficulty)
    const gameNumber = useSelector((state) => state?.game.number)
    const [time, setTime] = useState(0);
    const [inputValues, setInputValues] = useState({ 1: '', 2: '', 3: '', 4: '' });
    const [guess, setGuess] = useState([]);
    const [result, setResult] = useState([]);
    const [hint, setHint] = useState();
    const [errors, setErrors] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [winMessage, setWinMessage] = useState();
    const [timerId, setTimerId] = useState(null);

    const maxInputByDifficulty = () => {
        switch (difficulty) {
            case 1: // Easy
                return 7;
            case 2: // Medium
                return 8;
        }
    };

    const isSubmitDisabled = () => {
        // Check for any errors first
        if (errors) return true;

        const maxInput = maxInputByDifficulty();
        return (Object.values(inputValues).some(value => {
            const num = Number(value);
            return value === '' || num < 0 || num > maxInput;
        }) && guess.length > 9);
    };


    // Set input values and input validations
    const handleInputChange = (index, value) => {
        const inputNum = Number(value);
        if (inputNum < 0 || inputNum > (difficulty + 6)) {
            setErrors(`Input must be between 0 and ${difficulty + 6}`)
        } else {
            setErrors()
        }
        setInputValues({ ...inputValues, [index]: value });
    };

    const handleKeyDown = (event, callback) => {
        if (guess.length > 9) {
            event.preventDefault();
            return;
        };

        if (event.key === 'Enter') {
            event.preventDefault();
            callback(event);
        }
    };

    // Check function to update the game and guess
    const gameCheck = async (check) => {
        const id = check.id;
        if (check.location === 4 && check.digit === 4) {
            await dispatch(updateWinGame(true));
            await dispatch(updateWinGuess({ id, time }))
            setIsModalOpen(true);
            setWinMessage(check);
            clearInterval(timerId)
        }
        let newCheck = [...result, check]
        await setResult(newCheck)
    };

    // Submit the input to get check result
    const handleSubmit = async (e) => {
        e.preventDefault();
        const inputs = await Object.entries(inputValues).reduce((newObj, [key, value]) => {
            newObj[key] = Number(value);
            return newObj;
        }, {});
        const guesses = [...guess, Object.values(inputs)];

        setGuess(guesses);
        if (guesses.length <= 10) {
            let check = await dispatch(checkResult(inputs));
            await gameCheck(check)

            if (guesses.length === 10) {
                setIsModalOpen(true);
            }
        };
        setInputValues({
            1: '',
            2: '',
            3: '',
            4: ''
        });
        firstInputRef.current.focus();
    };

    // Submit request to get hint
    const handleSubmitHint = async (e) => {
        e.preventDefault();
        const hint = await dispatch(getHint());
        await setHint(hint)
    }

    const indexWords = ['first', 'second', 'third', 'fourth'];
    let index = indexWords[hint?.index];

    const stepWords = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X']
    // set difficulty classname & button
    function getDifficultyClass(difficulty) {
        switch (difficulty) {
            case 1:
                return 'easy';
            case 2:
                return 'medium';
            case 3:
                return 'hard';
        }
    };
    const getDifficultyButton = (difficulty) => {
        switch (difficulty) {
            case 1:
                return 'Easy';
            case 2:
                return 'Medium';
            case 3:
                return 'Hard';
        }
    }
    // This effect could be used to start the game timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);
        setTimerId(timer);
        // Clear interval on cleanup
        return () => clearInterval(timer);
    }, [dispatch]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // const handleRestart = () => {
    //     history.push('/newgame');
    // };

    // function Modal({ isOpen, onClose }) {
    //     if (!isOpen) return null;

    //     return (
    //         <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    //             {winMessage && winMessage ? <div style={{
    //                 backgroundColor: 'white',
    //                 padding: 20,
    //                 maxWidth: '600px',
    //                 width: '50%',
    //                 height: 'auto',
    //                 borderRadius: '15px',
    //                 textAlign: 'center'
    //             }}>
    //                 <h2 style={{
    //                     marginTop: '50px',
    //                     fontSize: '20px',
    //                     }}>Congratulations!<br></br>
    //                     You won the game with a score of {winMessage.score} and a finish time of {formatTime(time)}.
    //                     The number is {winMessage.gameNumber}.
    //                 </h2>
    //                 <button onClick={onClose}
    //                     style={{
    //                         padding: '10px 20px',
    //                         fontSize: '16px',
    //                         cursor: 'pointer',
    //                         backgroundColor: '#007BFF',
    //                         color: 'white',
    //                         border: 'none',
    //                         borderRadius: '5px'
    //                     }}
    //                 >Close</button>
    //                 <button onClick={handleRestart}
    //                     style={{
    //                         padding: '10px 20px',
    //                         fontSize: '16px',
    //                         cursor: 'pointer',
    //                         backgroundColor: '#007BFF',
    //                         color: 'white',
    //                         border: 'none',
    //                         borderRadius: '5px',
    //                         marginLeft: '30px',
    //                         marginTop: '30px'
    //                     }}
    //                 >Restart</button>
    //             </div> :
    //             <div style={{
    //                 backgroundColor: 'white',
    //                 padding: 20,
    //                 maxWidth: '600px',
    //                 width: '50%',
    //                 height: 'auto',
    //                 borderRadius: '15px',
    //                 textAlign: 'center'
    //             }}>
    //                 <h2 style={{
    //                     marginTop: '50px',
    //                     fontSize: '20px',
    //                     }}>Whoops! The number is {gameNumber}<br></br>
    //                     You've hit the 10-try limit this round. Restart and try again!<br></br>
    //                     You're getting better with every game.🌟
    //                 </h2>
    //                 <button onClick={onClose}
    //                     style={{
    //                         padding: '10px 20px',
    //                         fontSize: '16px',
    //                         cursor: 'pointer',
    //                         backgroundColor: '#007BFF',
    //                         color: 'white',
    //                         border: 'none',
    //                         borderRadius: '5px'
    //                     }}
    //                 >Close</button>
    //                 <button onClick={handleRestart}
    //                     style={{
    //                         padding: '10px 20px',
    //                         fontSize: '16px',
    //                         cursor: 'pointer',
    //                         backgroundColor: '#007BFF',
    //                         color: 'white',
    //                         border: 'none',
    //                         borderRadius: '5px',
    //                         marginLeft: '30px',
    //                         marginTop: '30px'
    //                     }}
    //                 >Restart</button>
    //             </div>
    //             }
    //         </div>
    //     );
    // }

    return (
        <div className='gamepage-container'>
            <div className='gamepage'>
                <div className='game-control'>
                    <div>
                        <button className={`button ${getDifficultyClass(difficulty)}`}>
                            {getDifficultyButton(difficulty)}
                        </button>
                    </div>
                    <div className='timer'>
                        Time
                        <div>{formatTime(time)}</div>
                    </div>
                    <div>
                        {errors && <div
                            className='input-error'
                            style={{ color: 'red' }}>{errors}</div>}
                    </div>
                    <div className='inputs'>
                        {Array.from({ length: 4 }, (_, i) => (
                            <div>
                                <input
                                    key={i}
                                    ref={i === 0 ? firstInputRef : null}
                                    className='numberInput'
                                    type='number'
                                    min='0'
                                    max={difficulty + 6}
                                    value={inputValues[i + 1]}
                                    onChange={(e) => handleInputChange(i + 1, e.target.value)}
                                    onKeyDown={e => handleKeyDown(e, handleSubmit)}
                                />
                            </div>
                        ))}
                    </div>
                    <button className='submitBtn' disabled={isSubmitDisabled()} onClick={handleSubmit}>
                        Submit
                    </button>
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        winMessage={winMessage}
                        time={time}
                        gameNumber={gameNumber}
                    />

                    {
                        hint ?
                            <div className='hint-display'>
                                The number in the {index} position is {hint.number}
                            </div> :
                            <div className='hint-nondisplay'>
                            </div>
                    }
                    {
                        hint ?
                            <div className='hint'>
                                <button className='nohintButton' onClick={handleSubmitHint}>HINT</button>
                            </div> :
                            <div className='hint'>
                                <button className='hintButton' onClick={handleSubmitHint}>HINT</button>
                            </div>
                    }
                </div>
                <div className='guess-section'>
                    {guess.map((guess, index) => (
                        <div key={index} className="guessRow">
                            <div className='guessIndex'>
                                {stepWords[index]}
                            </div>
                            {guess.map((number, numberIndex) => (
                                <div key={numberIndex} className="guessNumber">
                                    {number}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className='result-section'>
                    {result.map((result, index) => (
                        <div className='result-tab'>
                            <div className="resultRow">

                                <div className="ballsContainer">
                                    {Array.from({ length: result.location }, (_, i) => (
                                        <div key={`location-${i}`} className="ball greenBall"></div>
                                    ))}
                                </div>
                                <div className="ballsContainer">
                                    {Array.from({ length: result.digit }, (_, i) => (
                                        <div key={`number-${i}`} className="ball yellowBall"></div>
                                    ))}
                                </div>
                            </div>
                            <div className="resultText">
                                {result.location} correct location
                                <br />
                                {result.digit} correct number
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GamePage;
