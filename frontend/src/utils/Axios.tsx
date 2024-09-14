import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

// Utility functions to manage tokens
interface Tokens {
  access?: string;
  refresh?: string;
}

const getTokens = (): Tokens =>
  JSON.parse(localStorage.getItem("tokens") || "{}");
const setTokens = (tokens: Tokens): void =>
  localStorage.setItem("tokens", JSON.stringify(tokens));
const clearTokens = (): void => localStorage.removeItem("tokens");

// Base URL from environment variable
const baseURL: string = import.meta.env.VITE_API_URL as string;

// Create Axios instances
const Axios: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});
const AxiosRefresh: AxiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Token refresh handling
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (callback: (token: string) => void): void => {
  refreshSubscribers.push(callback);
};

const onRefreshed = (token: string): void => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Request interceptor to add JWT token
Axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const tokens = getTokens();
    if (tokens.access) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${tokens.access}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle token refresh and errors
Axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(Axios(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const tokens = getTokens();

      try {
        const response = await AxiosRefresh.post<{ access: string }>(
          "token/refresh/",
          {
            refresh: tokens.refresh,
          }
        );

        const { access } = response.data;
        setTokens({ access, refresh: tokens.refresh });
        Axios.defaults.headers.common["Authorization"] = `Bearer ${access}`;
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
