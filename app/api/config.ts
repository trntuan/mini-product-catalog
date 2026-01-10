/**
 * API Configuration
 * Centralized configuration for API client
 */

export const API_CONFIG = {
  BASE_URL: 'https://dummyjson.com',
  TIMEOUT: 30000, // 30 seconds
  CONTENT_TYPES: {
    JSON: 'application/json',
    FORM_DATA: 'multipart/form-data',
    FORM_URLENCODED: 'application/x-www-form-urlencoded',
  },
} as const;

export default API_CONFIG;
