import axios from 'axios';

// Utility functions to manage tokens
const getTokens = () => JSON.parse(localStorage.getItem('tokens')) || {};
const setTokens = (tokens) => localStorage.setItem('tokens', JSON.stringify(tokens));
const clearTokens = () => localStorage.removeItem('tokens');

// Base URL based on environment
const baseURL = 'http://localhost:8000/api/';

// Create Axios instance for API requests
const Axios = axios.create({
    baseURL: baseURL,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
Axios.interceptors.request.use(
    (config) => {
        const tokens = getTokens();
        if (tokens.access) {
            config.headers['Authorization'] = `Bearer ${tokens.access}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh and errors
Axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle token expiration error (401 Unauthorized)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Try to refresh the token
            const tokens = getTokens();
            try {
                const response = await axios.post(`${baseURL}token/refresh/`, {
                    refresh: tokens.refresh,
                });

                const { access } = response.data;
                setTokens({ access, refresh: tokens.refresh });

                // Retry the original request with the new token
                originalRequest.headers['Authorization'] = `Bearer ${access}`;
                return Axios(originalRequest);
            } catch (refreshError) {
                clearTokens();
                // Optionally redirect to login page or handle error
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default Axios;
