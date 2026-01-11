/**
 * Application Constants
 * Centralized constants and their types for storage keys, keychain services, and other app-wide constants
 */

// ============================================================================
// Storage Keys (AsyncStorage)
// ============================================================================

export const STORAGE_KEYS = {
  // Redux Persist
  REDUX_ROOT: 'root',
  
  // Products Cache
  PRODUCTS_CACHE: 'products_cache',
  PRODUCTS_CACHE_TIMESTAMP: 'products_cache_timestamp',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// ============================================================================
// Keychain Service Keys (Secure Storage)
// ============================================================================

export const KEYCHAIN_KEYS = {
  TOKEN: 'token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export type KeychainKey = typeof KEYCHAIN_KEYS[keyof typeof KEYCHAIN_KEYS];

// ============================================================================
// Cache Configuration
// ============================================================================

export const CACHE_CONFIG = {
  // Cache expiration time in milliseconds (24 hours)
  PRODUCTS_CACHE_EXPIRY: 24 * 60 * 60 * 1000,
} as const;

export type CacheConfig = typeof CACHE_CONFIG;

// ============================================================================
// Navigation Route Names
// ============================================================================

export const ROUTE_NAMES = {
  PRODUCT_DETAIL: 'ProductDetail',
  PRODUCTS_LIST: 'ProductsList',
  FAVORITES_LIST: 'FavoritesList',
  LOGIN: 'Login',
} as const;

export type RouteName = typeof ROUTE_NAMES[keyof typeof ROUTE_NAMES];

// ============================================================================
// Navigation Route Parameters
// ============================================================================

export const ROUTE_PARAMS = {
  PRODUCT_ID: 'productId',
} as const;

export type RouteParam = typeof ROUTE_PARAMS[keyof typeof ROUTE_PARAMS];

// ============================================================================
// App Constants
// ============================================================================

export const APP_CONSTANTS = {
  // Redux Persist Configuration
  REDUX_PERSIST_KEY: 'root',
  
  // Default values
  DEFAULT_TIMEOUT: 30000, // 30 seconds
} as const;

export type AppConstants = typeof APP_CONSTANTS;

// ============================================================================
// Type Guards
// ============================================================================

/**
 * Type guard to check if a string is a valid storage key
 */
export const isStorageKey = (key: string): key is StorageKey => {
  return Object.values(STORAGE_KEYS).includes(key as StorageKey);
};

/**
 * Type guard to check if a string is a valid keychain key
 */
export const isKeychainKey = (key: string): key is KeychainKey => {
  return Object.values(KEYCHAIN_KEYS).includes(key as KeychainKey);
};

// ============================================================================
// Constants Object (for easy import)
// ============================================================================

export const CONSTANTS = {
  STORAGE_KEYS,
  KEYCHAIN_KEYS,
  CACHE_CONFIG,
  ROUTE_NAMES,
  ROUTE_PARAMS,
  APP_CONSTANTS,
} as const;

export default CONSTANTS;
