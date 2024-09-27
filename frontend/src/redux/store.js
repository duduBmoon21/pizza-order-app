import { createStore, combineReducers } from 'redux';
import userReducer from './reducers';

const rootReducer = combineReducers({
    user: userReducer,
    // Add other reducers here if needed
});

const store = createStore(rootReducer);

export default store;
