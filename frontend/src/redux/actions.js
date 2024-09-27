// Actions for Redux
export const LOGIN_USER = 'LOGIN_USER';
export const REGISTER_USER = 'REGISTER_USER';

export const loginUser = (credentials) => ({
    type: LOGIN_USER,
    payload: credentials,
});

export const registerUser = (userData) => ({
    type: REGISTER_USER,
    payload: userData,
});
