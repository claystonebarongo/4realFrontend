import axios from 'axios';

const api = axios.create({
    // This will use the live link, or default to localhost for development
    baseURL: process.env.REACT_APP_API_URL || 'https://fourrealbackend.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;