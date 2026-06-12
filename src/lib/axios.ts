// src/lib/axios.ts
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/config';

/**
 * The response interceptor below unwraps `response.data`, so callers receive
 * the API payload directly. This interface reflects that at the type level.
 */
export interface ApiClient {
  get<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  put<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T>;
}

const instance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Inject Authorization Token
instance.interceptors.request.use(
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
instance.interceptors.response.use(
  (response) => {
    // Return payload directly so callers receive the decoded data structure
    return response.data;
  },
  (error: AxiosError | Error) => {
    let errorMessage = 'An unexpected error occurred';
    // Only surface toasts for user-initiated writes; background reads
    // (React Query fetches) report errors through their own UI states.
    const method = (axios.isAxiosError(error) && error.config?.method) || 'get';
    const shouldToast = method.toLowerCase() !== 'get';

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
        toast.error(errorMessage);
      } else if (status === 403) {
        errorMessage = 'Permission denied.';
        if (shouldToast) toast.error(errorMessage);
      } else if (shouldToast) {
        toast.error(errorMessage);
      }

      const enhancedError = error;
      enhancedError.message = errorMessage;
      return Promise.reject(enhancedError);
    }

    if (axios.isAxiosError(error) && error.request) {
      console.error('API No Response Error:', error.request);
      errorMessage = 'Network error or server unavailable.';
      if (shouldToast) toast.error(errorMessage);
      const enhancedError = error;
      enhancedError.message = errorMessage;
      return Promise.reject(enhancedError);
    }

    console.error('API Request Setup Error:', error.message);
    errorMessage = `Request setup failed: ${error.message}`;
    if (shouldToast) toast.error(errorMessage);
    const genericError = new Error(errorMessage);
    return Promise.reject(genericError);
  }
);

export const apiClient = instance as unknown as ApiClient;
