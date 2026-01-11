/**
 * Content Constants
 * Centralized text content keys for titles, messages, buttons, placeholders, and labels
 */

// ============================================================================
// Common / Shared Content
// ============================================================================

export const CONTENT_KEYS = {
  // Buttons
  BUTTONS: {
    RETRY: 'Retry',
    CLEAR: 'Clear',
    CLEAR_FILTERS: 'Clear Filters',
    CLOSE: 'Close',
    SIGN_IN: 'Sign In',
    CONTINUE_WITH_GOOGLE: 'Continue with Google',
    LOGOUT: 'Logout',
  },

  // Common Labels
  LABELS: {
    OR: 'OR',
    CATEGORY: 'Category',
    SORT: 'Sort',
    DESCRIPTION: 'Description',
    BRAND: 'Brand:',
    STOCK: 'Stock:',
    USER: 'User',
    NO_USERNAME: 'No username',
  },

  // Common Messages
  MESSAGES: {
    REQUIRED: 'Required',
    TOO_SHORT: 'Too Short!',
    LOADING_MORE: 'Loading more products...',
    NO_MORE_PRODUCTS: 'No more products to load',
    VIEWING_OFFLINE_DATA: "You're viewing offline data",
  },

  // ============================================================================
  // Authentication
  // ============================================================================

  AUTH: {
    TITLES: {
      WELCOME_BACK: 'Welcome Back',
    },
    MESSAGES: {
      SIGN_IN_TO_CONTINUE: 'Sign in to continue shopping',
    },
    PLACEHOLDERS: {
      USERNAME_OR_EMAIL: 'Username or Email',
      PASSWORD: 'Password',
    },
    VALIDATION: {
      USERNAME_MIN_LENGTH: 'Username must contain atleast 5 characters',
      REQUIRED: 'Required',
      TOO_SHORT: 'Too Short!',
    },
  },

  // ============================================================================
  // Products
  // ============================================================================

  PRODUCTS: {
    TITLES: {
      PRODUCT_DETAILS: 'Product Details',
      NO_PRODUCTS: 'No Products',
      NO_RESULTS_FOUND: 'No Results Found',
      UNABLE_TO_LOAD: 'Unable to Load Products',
      SELECT_CATEGORY: 'Select Category',
      SORT_BY: 'Sort By',
      ERROR: 'Error',
    },
    MESSAGES: {
      LOADING_PRODUCTS: 'Loading products...',
      LOADING_PRODUCT_DETAILS: 'Loading product details...',
      NO_PRODUCTS_AVAILABLE: 'There are no products available at the moment',
      NO_RESULTS_MESSAGE: 'Try adjusting your search, filter, or sort options',
      FAILED_TO_LOAD: 'Failed to load products. Please check your connection and try again.',
      FAILED_TO_LOAD_DETAILS: 'Failed to load product details',
      IN_STOCK: 'In Stock',
      OUT_OF_STOCK: 'Out of Stock',
    },
    PLACEHOLDERS: {
      SEARCH_PRODUCTS: 'Search products...',
    },
    LABELS: {
      ALL_CATEGORIES: 'All Categories',
      SORT_NONE: 'None',
      SORT_PRICE_LOW_TO_HIGH: 'Price: Low to High',
      SORT_PRICE_HIGH_TO_LOW: 'Price: High to Low',
      SORT_RATING_HIGH_TO_LOW: 'Rating: High to Low',
      SORT_PRICE_ASC: 'Price ↑',
      SORT_PRICE_DESC: 'Price ↓',
      SORT_RATING_DESC: 'Rating ↓',
      BRAND: 'Brand:',
      CATEGORY: 'Category:',
      STOCK: 'Stock:',
    },
    ACCESSIBILITY: {
      ADD_TO_FAVORITES: 'Add to favorites',
      REMOVE_FROM_FAVORITES: 'Remove from favorites',
    },
  },

  // ============================================================================
  // Favorites
  // ============================================================================

  FAVORITES: {
    TITLES: {
      NO_FAVORITES: 'No Favorites',
    },
    MESSAGES: {
      NO_FAVORITES_MESSAGE: "You haven't favorited any products yet. Start exploring and add some favorites!",
    },
  },

  // ============================================================================
  // NotFound Component
  // ============================================================================

  NOT_FOUND: {
    DEFAULT_TITLE: 'Not Found',
    DEFAULT_MESSAGE: 'There is nothing to show',
  },
} as const;

// ============================================================================
// Type Definitions
// ============================================================================

export type ContentKey = typeof CONTENT_KEYS;

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get stock status text
 */
export const getStockStatusText = (stock: number, inStockText: string, outOfStockText: string): string => {
  return stock > 0 ? `${inStockText} (${stock})` : outOfStockText;
};

// ============================================================================
// Export Default
// ============================================================================

export default CONTENT_KEYS;
