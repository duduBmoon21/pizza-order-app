import { LOGIN_USER, REGISTER_USER } from './actions';

const initialState = {
    user: null,
    isAuthenticated: false,
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_USER:
            // Logic for user login
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
            };
        case REGISTER_USER:
            // Logic for user registration
            return state;
        default:
            return state;
    }
};

export default userReducer;
