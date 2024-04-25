import { csrfFetch } from "./csrf";

const LOAD_GAME = 'game/LOAD_GAME';
const CREATE_GAME = 'game/CREATE_GAME';

export const loadGame = (list) => ({
    type: LOAD_GAME,
    list
});

export const createGame = (game) => ({
    type: CREATE_GAME,
    game
});

export const getAllGames = () => async dispatch => {
    const response = await csrfFetch('/api/games/all-game');

    if (response.ok) {
        const list = await response.json();
        dispatch(loadGame(list));
        return list;
    };
};

export const createNewGame = (game) => async dispatch => {
    const response = await csrfFetch('/api/games/random-number', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            max: game
        })
    });

    const newGame = await response.json();
    dispatch(createGame(newGame));
    return newGame
};

const initialState = {}

const gameReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_GAME:
            const allGames = {};
            action.list.forEach(game => {
                allGames[game.id] = game
            });
            return {
                ...allGames,
            };

        case CREATE_GAME:
            if (!state[action.game.id]) {
                console.log(action.game)
                const createdState = action.game;
                return createdState
            };

        default:
            return state;
    }
};

export default gameReducer;
