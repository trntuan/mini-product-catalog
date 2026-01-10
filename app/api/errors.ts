/**
 * API Error Handling
 * Centralized error handling and custom error classes
 */

import {AxiosError} from 'axios';
import {ApiError} from './types';

export class ApiException extends Error {
  status?: number;
  errors?: Record<string, string[]>;
  originalError?: AxiosError;

  constructor(message: string, status?: number, errors?: Record<string, string[]>, originalError?: AxiosError) {
    super(message);
    this.name = 'ApiException';
    this.status = status;
    this.errors = errors;
    this.originalError = originalError;
    Object.setPrototypeOf(this, ApiException.prototype);
  }
}

export class NetworkException extends Error {
  originalError?: AxiosError;

  constructor(message: string = 'Network error. Please check your connection.', originalError?: AxiosError) {
    super(message);
    this.name = 'NetworkException';
    this.originalError = originalError;
    Object.setPrototypeOf(this, NetworkException.prototype);
  }
}

export class UnauthorizedException extends ApiException {
  constructor(message: string = 'Unauthorized. Please login again.', originalError?: AxiosError) {
    super(message, 401, undefined, originalError);
    this.name = 'UnauthorizedException';
  }
}

/**
 * Parse error from Axios error response
 */
export const parseApiError = (error: AxiosError): ApiError => {
  if (!error.response) {
    // Network error or no response
    return {
      message: error.message || 'Network error. Please check your connection.',
    };
  }

  const {status, data} = error.response;
  const message = (data as any)?.message || error.message || 'An error occurred';

  return {
    message,
    status,
    errors: (data as any)?.errors,
  };
};

/**
 * Handle API errors based on status code
 */
export const handleApiError = async (error: AxiosError): Promise<never> => {
  if (!error.response) {
    // Network error
    throw new NetworkException(error.message, error);
  }

  const {status} = error.response;

  switch (status) {
    case 401:
      // Handle token refresh or redirect to login
      await handleUnauthorized();
      throw new UnauthorizedException('Unauthorized. Please login again.', error);
    case 403:
      throw new ApiException('Forbidden. You do not have permission.', 403, undefined, error);
    case 404:
      throw new ApiException('Resource not found.', 404, undefined, error);
    case 422:
      const errors = (error.response.data as any)?.errors;
      throw new ApiException('Validation error.', 422, errors, error);
    case 500:
      throw new ApiException('Server error. Please try again later.', 500, undefined, error);
    default:
      const apiError = parseApiError(error);
      throw new ApiException(apiError.message, status, apiError.errors, error);
  }
};

/**
 * Handle 401 Unauthorized - Request new token
 */
const handleUnauthorized = async () => {
  try {
    // Use lazy import to avoid circular dependency
    const {requestNewToken} = await import('../utils/token');
    await requestNewToken();
  } catch (err) {
    console.error('Failed to refresh token:', err);
    // Optionally clear user data and redirect to login
    // const {store} = await import('../store/store');
    // const {clearUser} = await import('../store/userSlice');
    // store.dispatch(clearUser());
  }
};
