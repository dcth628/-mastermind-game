import { csrfFetch } from "./csrf";

const LOAD_TIME = 'time/LOAD_TIME';

export const loadTime = (time) => ({
    type: LOAD_TIME,
    time
});

export const getFastTime = () => async dispatch => {
    const response = await csrfFetch('/api/games/fast-time');

    if (response.ok) {
        const fastTime = await response.json();
        dispatch(loadTime(fastTime));
        return fastTime;
    };
};

const initialState = {}

const timeReducer = (state = initialState, action) => {
    switch (action.type) {

        case LOAD_TIME:
            const fastTime = {};
            action.time.forEach( time => {
                fastTime[time.id] = time
            });
            return { ...fastTime }
        default:
            return state;
    }
};

export default timeReducer;
