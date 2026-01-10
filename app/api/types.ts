/**
 * API Types
 * Type definitions for API requests and responses
 */

import {AxiosError, AxiosResponse} from 'axios';

// Generic API Response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status?: number;
}

// Generic API Error
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

// Request configuration
export interface RequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  skipAuth?: boolean; // Skip adding auth token
}

// Pagination params
export interface PaginationParams {
  limit?: number;
  skip?: number;
  page?: number;
}

// Typed Axios Response
export type TypedAxiosResponse<T = any> = AxiosResponse<T>;

// Typed Axios Error
export type TypedAxiosError<T = any> = AxiosError<T>;
