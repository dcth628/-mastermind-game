import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './GamePage.css';

const GamePage = () => {
    const dispatch = useDispatch();
    const difficulty = useSelector((state) => state?.game.difficulty)
  const [time, setTime] = useState(0);

  // set difficulty classname
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

    // Clear interval on cleanup
    return () => clearInterval(timer);
  }, []);

  // This could be the function to format the timer
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };


  return (
    <div className='gameContainer'>
      <div>
        <button
          className={`button ${getDifficultyClass(difficulty)}`}
        >
            {getDifficultyButton(difficulty)}
        </button>
      </div>
      <div className='timer'>
        Time
        <div>{formatTime(time)}</div>
      </div>
      <div className='hint'>
        <button className='hintButton'>Hint</button>
      </div>
    </div>
  );
};

export default GamePage;
