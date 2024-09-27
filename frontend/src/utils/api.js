import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Change this to your backend URL

export const registerUserAPI = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const loginUserAPI = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};
