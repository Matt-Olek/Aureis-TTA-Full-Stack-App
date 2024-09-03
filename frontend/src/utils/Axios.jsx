import axios from 'axios';

// Utility functions to manage tokens
const getTokens = () => JSON.parse(localStorage.getItem('tokens')) || {};
const setTokens = (tokens) => localStorage.setItem('tokens', JSON.stringify(tokens));
const clearTokens = () => localStorage.removeItem('tokens');

// Base URL from environment variable
const baseURL = import.meta.env.VITE_API_URL;

// Create Axios instance for API requests
const Axios = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Create a separate Axios instance for refreshing tokens
const AxiosRefresh = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag to indicate refresh in progress
let isRefreshing = false;
let refreshSubscribers = [];

// Function to subscribe to token refresh
const subscribeTokenRefresh = (callback) => {
    refreshSubscribers.push(callback);
};

// Function to notify all subscribers with the new token
const onRefreshed = (token) => {
    refreshSubscribers.map(callback => callback(token));
    refreshSubscribers = [];
};

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

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // Queue requests until the token is refreshed
                return new Promise((resolve) => {
                    subscribeTokenRefresh((newToken) => {
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        resolve(Axios(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const tokens = getTokens();

            try {
                const response = await AxiosRefresh.post('token/refresh/', {
                    refresh: tokens.refresh,
                });

                const { access } = response.data;
                setTokens({ access, refresh: tokens.refresh });
                Axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
                onRefreshed(access);
                isRefreshing = false;

                return Axios(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                clearTokens();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default Axios;
