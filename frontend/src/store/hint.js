import { csrfFetch } from "./csrf";

const GET_HINT = 'hint/GET_HINT';

export const loadHint = (hint) => ({
    type: GET_HINT,
    hint
});

export const getHint = () => async dispatch => {
    const response = await csrfFetch('/api/games/hint');

    if (response.ok) {
        const hint = await response.json();
        dispatch(loadHint(hint));
        return hint;
    };
};

const initialState = {}

const hintReducer = (state = initialState, action) => {
    switch (action.type) {

        case GET_HINT:
            return action.hint

        default:
            return state;
    }
};

export default hintReducer;
