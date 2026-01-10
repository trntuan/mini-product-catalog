/**
 * API Client
 * Axios instance with interceptors for request/response handling
 */

import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import API_CONFIG from './config';
import { handleApiError } from './errors';

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

    // Log API request (after auth token is added)
    const method = config.method?.toUpperCase() || 'UNKNOWN';
    const url = `${config.baseURL || ''}${config.url || ''}`;
    const params = config.params ? JSON.stringify(config.params) : '';
    const hasAuth = !!config.headers.Authorization;
    
    console.log(`[API Request] ${method} ${url}`, {
      params: params || undefined,
      hasAuth,
      timestamp: new Date().toISOString(),
    });

    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  },
);

// Response interceptor - Handle responses and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log API response
    const method = response.config.method?.toUpperCase() || 'UNKNOWN';
    const url = `${response.config.baseURL || ''}${response.config.url || ''}`;
    const status = response.status;
    const dataSize = JSON.stringify(response.data || {}).length;
    
    console.log(`[API Response] ${method} ${url}`, {
      status,
      dataSize: `${dataSize} bytes`,
      timestamp: new Date().toISOString(),
    });

    // Return response data directly for convenience
    return response;
  },
  async (error) => {
    // Log API error
    if (error.config) {
      const method = error.config.method?.toUpperCase() || 'UNKNOWN';
      const url = `${error.config.baseURL || ''}${error.config.url || ''}`;
      const status = error.response?.status || 'NO_RESPONSE';
      
      console.error(`[API Error] ${method} ${url}`, {
        status,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.error('[API Error]', error);
    }

    // Handle API errors centrally
    return handleApiError(error);
  },
);

export default apiClient;
