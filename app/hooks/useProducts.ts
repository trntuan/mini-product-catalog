/**
 * Custom hook for managing products list, search, filter, and pagination
 */

import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  clearFilters,
  fetchCategories,
  fetchProducts,
  fetchProductsByCategory,
  loadCachedProducts,
  searchProducts,
  setSelectedCategory,
  setSortOption
} from '../store/productsSlice';
import { AppDispatch, RootState } from '../store/store';
import { useDebounce } from '../utils/useDebounce';

export function useProducts() {
  const dispatch = useDispatch<AppDispatch>();

  const productsState = useSelector((state: RootState) => state.products.products);
  const {
    products = [],
    filteredProducts = [],
    hasMore = false,
    loadingMore = false,
    error = null,
    selectedCategory = null,
    selectedCategoryName = null,
    sortOption = 'none',
    categories = [],
    categoriesLoading = false,
    isOffline = false,
  } = productsState || {};
  const status = useSelector(
    (state: RootState) => state.products.products?.status || 'idle',
  );

  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const debouncedSearchQuery = useDebounce(localSearchQuery, 400);

  // Load cached products on mount, then fetch fresh data
  useEffect(() => {
    if (status === 'idle') {
      // First, try to load cached data for immediate display
      dispatch(loadCachedProducts())
        .then(() => {
          // Then fetch fresh data in the background
          dispatch(fetchProducts({limit: 10, skip: 0, append: false}));
        })
        .catch(() => {
          // If no cache available, just fetch fresh data
          dispatch(fetchProducts({limit: 10, skip: 0, append: false}));
        });
    }
    if ((!categories || categories.length === 0) && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, status, categories, categoriesLoading]);

  // Handle search with debounce
  useEffect(() => {
    const trimmedQuery = debouncedSearchQuery.trim();
    
    if (trimmedQuery.length > 0) {
      dispatch(searchProducts(trimmedQuery));
    } else {
      // If search is cleared and we were searching, reload original products
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, dispatch]);

  const handleRefresh = useCallback(() => {
    // Reset pagination and errors, reload products
    dispatch(fetchProducts({ limit: 10, skip: 0, append: false }));
  }, [dispatch]);

  const handleRetryLoadMore = useCallback(() => {
    // Retry loading more products after pagination error
    if (!loadingMore && hasMore && products) {
      const nextSkip = products.length || 0;
      dispatch(fetchProducts({limit: 10, skip: nextSkip, append: true}));
    }
  }, [dispatch, loadingMore, hasMore, products]);

  const handleLoadMore = useCallback(() => {
    // Don't load more if we're searching (search results don't support pagination)
    if (
      !loadingMore &&
      hasMore &&
      status === 'success' &&
      !error &&
      products
    ) {
      const nextSkip = products.length || 0;
      // If a category is selected, load more products from that category
      if (selectedCategory) {
        dispatch(fetchProductsByCategory({
          category: selectedCategory,
          limit: 10,
          skip: nextSkip,
          append: true
        }));
      } else {
        dispatch(fetchProducts({limit: 10, skip: nextSkip, append: true}));
      }
    }
  }, [dispatch, loadingMore, hasMore, status, error, products, selectedCategory]);

  const handleRetry = useCallback(() => {
    dispatch(fetchProducts({limit: 10, skip: 0, append: false}));
  }, [dispatch]);

  const handleCategorySelect = useCallback(
    (category: {slug: string; name: string} | null) => {
      dispatch(setSelectedCategory(category));
      setShowCategoryModal(false);
      
      // Fetch products by category when a category is selected
      if (category) {
        dispatch(fetchProductsByCategory({category: category.slug, limit: 10, skip: 0, append: false}));
      } else {
        // If "All Categories" is selected, fetch all products
        dispatch(fetchProducts({limit: 10, skip: 0, append: false}));
      }
    },
    [dispatch],
  );

  const handleSortSelect = useCallback(
    (sort: 'none' | 'price-asc' | 'price-desc' | 'rating-desc') => {
      dispatch(setSortOption(sort));
      setShowSortModal(false);
    },
    [dispatch],
  );

  const handleClearFilters = useCallback(() => {
    setLocalSearchQuery('');
    dispatch(clearFilters());
    // Reload all products when filters are cleared
    dispatch(fetchProducts({limit: 10, skip: 0, append: false}));
  }, [dispatch]);

  const hasActiveFilters =
    selectedCategory !== null ||
    sortOption !== 'none';

  // Use filteredProducts when available (after filters/sort/search are applied)
  // Otherwise fall back to products (initial load or when no filters)
  const displayProducts =
    (filteredProducts && filteredProducts.length > 0) || hasActiveFilters
      ? filteredProducts || []
      : products || [];

  return {
    // State
    products,
    displayProducts,
    filteredProducts,
    categories,
    status,
    error,
    hasMore,
    loadingMore,
    localSearchQuery,
    selectedCategory,
    selectedCategoryName,
    sortOption,
    categoriesLoading,
    isOffline,
    hasActiveFilters,
    showCategoryModal,
    showSortModal,
    
    // Actions
    setLocalSearchQuery,
    setShowCategoryModal,
    setShowSortModal,
    handleRefresh,
    handleRetryLoadMore,
    handleLoadMore,
    handleRetry,
    handleCategorySelect,
    handleSortSelect,
    handleClearFilters,
  };
}
