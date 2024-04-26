import { csrfFetch } from "./csrf";

const LOAD_GUESS = 'guess/LOAD_GUESS';
const GETALL_GUESS = 'guess/GETALL_GUESS'
const UPDATE_GUESS = 'guess/UPDATE_GUESS'

export const loadGuess = (history) => ({
    type: LOAD_GUESS,
    history,
});

export const loadAllGuess = (game) => ({
    type: GETALL_GUESS,
    game
});

export const update = (guess) => ({
    type: UPDATE_GUESS,
    guess
})

export const loadGuessHistory = () => async dispatch => {
    const response = await csrfFetch('/api/games/history');

    if (response.ok) {
        const history = await response.json();
        dispatch(loadGuess(history));
        return history
    }
};

export const loadGameGuess = (gameId) => async dispatch => {
    const response = await csrfFetch(`/api/games/${gameId}/guess`);

    if (response.ok) {
        const guess = await response.json();
        dispatch(loadAllGuess(guess));
        return guess;
    };
};

export const updateWinGuess = (guess) => async dispatch => {
    const {id , time} = guess;
    const response = await csrfFetch('/api/games/win-guess', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id,
            time
        })
    });

    const winGameGuess = await response.json();
    dispatch(update(winGameGuess));
    return winGameGuess
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

            case UPDATE_GUESS:
                if (!state[action.guess.id]) {
                    const createdState = action.guess;
                    return createdState
                }

        default:
            return state;
    }
};

export default guessReducer;
