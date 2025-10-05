// src/lib/axios.ts
import axios from 'axios';
import { toast } from 'react-toastify';
import { getEnvValue } from '@/config/runtimeEnv';

const API_URL = getEnvValue('VITE_BACKEND_URL', 'http://localhost:8080');

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Inject Authorization Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Axios Request Error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle common errors and return data directly
apiClient.interceptors.response.use(
  (response) => {
    // *** IMPORTANT: Explicitly return response.data here ***
    return response.data;
  },
  (error) => {
    let errorMessage = 'An unexpected error occurred';
    let errorCode = null;

    if (error.response) {
      // Server responded with a status code outside 2xx range
      errorCode = error.response.status;
      console.error(`API Error Response (Status ${errorCode}):`, error.response.data);
      errorMessage =
        error.response.data?.error ||
        error.response.data?.message ||
        `Request failed with status ${errorCode}`;

      if (errorCode === 401) {
        errorMessage = 'Session expired or invalid. Please log in again.';
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 1500);
      } else if (errorCode === 403) {
        errorMessage = 'Permission denied.';
      }
      toast.error(errorMessage);
    } else if (error.request) {
      console.error('API No Response Error:', error.request);
      errorMessage = 'Network error or server unavailable.';
      toast.error(errorMessage);
    } else {
      console.error('API Request Setup Error:', error.message);
      errorMessage = `Request setup failed: ${error.message}`;
      toast.error(errorMessage);
    }
    // Reject with an Error object containing the message
    return Promise.reject(new Error(errorMessage));
  }
);
