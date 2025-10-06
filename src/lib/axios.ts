// src/lib/axios.ts
import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

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
    // Return payload directly so callers receive the decoded data structure
    return response.data;
  },
  (error: AxiosError | Error) => {
    let errorMessage = 'An unexpected error occurred';

    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const responseData = (data ?? {}) as Record<string, unknown>;
      console.error(`API Error Response (Status ${status}):`, data);
      const apiErrorMessage =
        (typeof responseData.error === 'string' && responseData.error) ||
        (typeof responseData.message === 'string' && responseData.message) ||
        undefined;
      errorMessage = apiErrorMessage || `Request failed with status ${status}`;

      if (status === 401) {
        errorMessage = 'Session expired or invalid. Please log in again.';
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 1500);
      } else if (status === 403) {
        errorMessage = 'Permission denied.';
      }

      toast.error(errorMessage);

      const enhancedError = error;
      enhancedError.message = errorMessage;
      return Promise.reject(enhancedError);
    }

    if (axios.isAxiosError(error) && error.request) {
      console.error('API No Response Error:', error.request);
      errorMessage = 'Network error or server unavailable.';
      toast.error(errorMessage);
      const enhancedError = error;
      enhancedError.message = errorMessage;
      return Promise.reject(enhancedError);
    }

    console.error('API Request Setup Error:', error.message);
    errorMessage = `Request setup failed: ${error.message}`;
    toast.error(errorMessage);
    const genericError = new Error(errorMessage);
    return Promise.reject(genericError);
  }
);
