import { useEffect } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { useSelector, useDispatch } from "react-redux";
import { loadGameGuess } from "../../store/guess";
import './GameDetail.css'


const GameGuessDetail = ({ gameId, index, gameNumber }) => {
    const dispatch = useDispatch();
    const guess = useSelector(state => state?.guess)

    const guesses = Object.values(guess)

    useEffect(() => {
        dispatch(loadGameGuess(gameId))
    }, [dispatch, gameId]);

    return (
        <div className="guess-card">
            <h1>Game {index + 1}</h1>
            <h2>Game Number: {gameNumber}</h2>
            {guesses.map((guess, index) => (
                <p>Guess{index + 1}: [{guess.number}] {guess.digit} correct number, {guess.location} correct location</p>
            ))}
        </div>
    )
};

export default GameGuessDetail
