/**
 * API Client
 * Axios instance with interceptors for request/response handling
 */

import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import API_CONFIG from './config';
import {handleApiError} from './errors';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': API_CONFIG.CONTENT_TYPES.JSON,
    Accept: 'application/json',
  },
});

// Request interceptor - Add auth token, modify requests
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip auth token if explicitly requested
    if ((config as any).skipAuth !== true) {
      // Get token from Redux store (lazy import to avoid circular dependency)
      try {
        const {store} = await import('../store/store');
        const state = store.getState();
        const token = (state as any).user?.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        // Store not available, continue without token
        console.warn('Could not get token from store:', error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - Handle responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return response data directly for convenience
    return response;
  },
  async (error) => {
    // Handle API errors centrally
    return handleApiError(error);
  },
);

export default apiClient;
