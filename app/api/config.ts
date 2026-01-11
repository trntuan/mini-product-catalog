/**
 * API Configuration
 * Centralized configuration for API client
 */

import Constants from 'expo-constants';

const baseUrl =
  (Constants.expoConfig?.extra?.baseUrl as string | undefined) ??
  '';
const timeout =
  Number(Constants.expoConfig?.extra?.timeout ?? 30000) || 30000;

export const API_CONFIG = {
  BASE_URL: baseUrl,
  TIMEOUT: timeout, // 30 seconds
  CONTENT_TYPES: {
    JSON: 'application/json',
    FORM_DATA: 'multipart/form-data',
    FORM_URLENCODED: 'application/x-www-form-urlencoded',
  },
} as const;

export default API_CONFIG;
