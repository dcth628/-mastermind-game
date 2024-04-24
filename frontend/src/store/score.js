import { csrfFetch } from "./csrf";

const GET_SCORE = 'game/GET_SCORE';
const LOAD_SCORE = 'game/LOAD_SCORE';

export const getScore = (score) => ({
    type: GET_SCORE,
    score
});

export const loadScore = (scores) => ({
    type: LOAD_SCORE,
    scores
});

export const getScoreSum = () => async dispatch => {
    const response = await csrfFetch('/api/games/total-score');

    if (response.ok) {
        const totalScore = await response.json();
        dispatch(getScore(totalScore));
        return totalScore
    };
};

export const getAllScores = () => async dispatch => {
    const response = await csrfFetch('/api/games/all-score');

    if (response.ok) {
        const allScores = await response.json();
        dispatch(loadScore(allScores));
        return allScores
    };
};

const initialState = {}

const scoreReducer = (state = initialState, action) => {
    switch (action.type) {

        case GET_SCORE:
            return action.score

        case LOAD_SCORE:
            const allScores = {};
            action.scores.forEach(score => {
                allScores[score.id] = score;
            });
            return { ...allScores }

        default:
            return state;
    }
};

export default scoreReducer;
