/**
 * API Endpoints
 * Centralized endpoint definitions
 */

const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  
  // User endpoints (for dummyjson.com which uses /auth/login)
  USER: {
    LOGIN: '/auth/login', // DummyJSON uses /auth/login
  },

  // Product endpoints
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id: number | string) => `/products/${id}`,
    SEARCH: '/products/search',
    CATEGORIES: '/products/categories',
    CATEGORY_LIST: '/products/category-list',
    BY_CATEGORY: (category: string) => `/products/category/${category}`,
  },

  // User endpoints
  USERS: {
    BASE: '/users',
    BY_ID: (id: number | string) => `/users/${id}`,
    ME: '/users/me',
  },
} as const;

export default ENDPOINTS;
