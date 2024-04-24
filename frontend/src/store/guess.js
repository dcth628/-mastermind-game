import { csrfFetch } from "./csrf";

const LOAD_GUESS = 'guess/LOAD_GUESS';

export const loadGuess = (history) => ({
    type: LOAD_GUESS,
    history,
});

export const loadGuessHistory = () => async dispatch => {
    const response = await csrfFetch('/api/games/history');

    if (response.ok) {
        const history = await response.json();
        dispatch(loadGuess(history));
        return history
    }
};

const initialState = {}

const guessReducer = (state = initialState, action) => {
    switch (action.type) {

            case LOAD_GUESS:
                const allGuess = {};
                console.log(action)
                action.history.forEach(history => {
                    allGuess[history.id] = history
                });
                return {
                    ...allGuess
                };

        default:
            return state;
    }
};

export default guessReducer;
