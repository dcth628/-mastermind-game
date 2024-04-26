import { csrfFetch } from "./csrf";

const CREATE_RESULT = 'check/CREATE_RESULT';

export const createResult = (guess) => ({
    type: CREATE_RESULT,
    guess
});

export const checkResult = (guess) => async dispatch => {

    const response = await csrfFetch('/api/games/result', {
        method: 'POST',
        body: JSON.stringify(guess)
    });
    const newGuess = await response.json();
    dispatch(createResult(newGuess));
    return newGuess;
};

const initialState = {}

const checkReducer = (state = initialState, action) => {
    switch (action.type) {

        case CREATE_RESULT:
            if (!state[action.guess.id]) {
                const createdState = {
                    ...state,
                    [action.guess.id]: action.guess
                };
                return createdState
            };

        default:
            return state;
    }
};

export default checkReducer;
