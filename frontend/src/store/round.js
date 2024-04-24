import { csrfFetch } from "./csrf";

const LOAD_ROUND = 'round/LOAD_ROUND';

export const loadRound = (round) => ({
    type: LOAD_ROUND,
    round
});

export const getFewRound = () => async dispatch => {
    const response = await csrfFetch('/api/games/less-round');

    if (response.ok) {
        const lessRound = await response.json();
        dispatch(loadRound(lessRound));
        return lessRound;
    };
};

const initialState = {}

const roundReducer = (state = initialState, action) => {
    switch (action.type) {

        case LOAD_ROUND:
            const top10Rounds = {};
            action.round.forEach(round => {
                top10Rounds[round.id] = round
            });
            return { ...top10Rounds }
        default:
            return state;
    }
};

export default roundReducer;
