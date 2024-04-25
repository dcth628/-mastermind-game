import { csrfFetch } from "./csrf";

const LOAD_GUESS = 'guess/LOAD_GUESS';
const GETALL_GUESS = 'guess/GETALL_GUESS'

export const loadGuess = (history) => ({
    type: LOAD_GUESS,
    history,
});

export const loadAllGuess = (game) => ({
    type: GETALL_GUESS,
    game
})

export const loadGuessHistory = () => async dispatch => {
    const response = await csrfFetch('/api/games/history');

    if (response.ok) {
        const history = await response.json();
        dispatch(loadGuess(history));
        return history
    }
};

export const loadGameGuess = (game) => async dispatch => {
    const response = await csrfFetch(`/api/games/${game}/guess`);

    if (response.ok) {
        const guess = await response.json();
        dispatch(loadAllGuess(guess));
        return guess;
    };
};

const initialState = {}

const guessReducer = (state = initialState, action) => {
    switch (action.type) {

            case LOAD_GUESS:
                const allGuess = {};
                action.history.forEach(history => {
                    allGuess[history.id] = history
                });
                return {
                    ...allGuess
                };

            case GETALL_GUESS:
                const gameAllGuess = {};
                action.game.forEach(game => {
                    gameAllGuess[game.round] = game
                })
                return { ...gameAllGuess }

        default:
            return state;
    }
};

export default guessReducer;
