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
  transformRequest: [
    (data, headers) => {
      // For JSON requests, ensure data is stringified
      // Handle objects, arrays, and other non-string data
      if (data !== null && data !== undefined) {
        // Get Content-Type header (case-insensitive)
        const contentType = headers['Content-Type'] || headers['content-type'] || 
                           (headers as any)?.['Content-Type'] || (headers as any)?.['content-type'];
        
        if (contentType === API_CONFIG.CONTENT_TYPES.JSON || 
            contentType?.includes('application/json')) {
          // If it's already a string, return as is
          if (typeof data === 'string') {
            return data;
          }
          // Otherwise stringify objects/arrays
          if (typeof data === 'object') {
            return JSON.stringify(data);
          }
        }
        // For form-urlencoded, return as is (handled by postFormUrlEncoded)
        if (contentType === API_CONFIG.CONTENT_TYPES.FORM_URLENCODED ||
            contentType?.includes('application/x-www-form-urlencoded')) {
          return data;
        }
        // For form-data, return as is
        if (contentType?.includes('multipart/form-data')) {
          return data;
        }
      }
      return data;
    },
  ],
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
    const data = config.data ? (typeof config.data === 'string' ? config.data : JSON.stringify(config.data)) : '';
    const hasAuth = !!config.headers.Authorization;
    
    // For GET/DELETE requests, log params (query string)
    // For POST/PUT/PATCH requests, log data (request body)
    const isBodyRequest = ['POST', 'PUT', 'PATCH'].includes(method);
    const requestData = isBodyRequest ? (data || undefined) : (params || undefined);
    
    console.log(`[API Request] ${method} ${url}`, {
      [isBodyRequest ? 'data' : 'params']: requestData,
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
      const responseData = error.response?.data;
      
      console.error(`[API Error] ${method} ${url}`, {
        status,
        message: error.message,
        responseData: responseData ? (typeof responseData === 'string' ? responseData : JSON.stringify(responseData)) : undefined,
        requestData: error.config.data ? (typeof error.config.data === 'string' ? error.config.data : JSON.stringify(error.config.data)) : undefined,
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
