import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import sessionReducer from './session';
import checkReducer from './check';
import gameReducer from './game';
import guessReducer from './guess';
import hintReducer from './hint';
import roundReducer from './round';
import scoreReducer from './score';
import timeReducer from './time';

const rootReducer = combineReducers({
    session: sessionReducer,
    check: checkReducer,
    game: gameReducer,
    guess: guessReducer,
    hint: hintReducer,
    round: roundReducer,
    score: scoreReducer,
    time: timeReducer
});

let enhancer;

if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(thunk);
} else {
    const logger = require('redux-logger').default;
    const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    enhancer = composeEnhancers(applyMiddleware(thunk, logger));
};

const configureStore = (preloadedState) => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
