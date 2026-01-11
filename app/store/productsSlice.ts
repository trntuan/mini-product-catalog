import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Category, productsService } from '../services';
import {
  loadProductsFromCache,
  saveProductsToCache
} from '../utils/productsCache';

// Types
export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

type ProductsState = {
  status: 'idle' | 'loading' | 'success' | 'failed';
  loadingMore: boolean;
  hasMore: boolean;
  products: Product[];
  filteredProducts: Product[];
  total: number;
  skip: number;
  limit: number;
  error: string | null;
  selectedCategory: string | null; // Store category slug
  selectedCategoryName: string | null; // Store category name for display
  sortOption: 'none' | 'price-asc' | 'price-desc' | 'rating-desc';
  categories: Category[];
  categoriesLoading: boolean;
  isOffline: boolean; // Flag to indicate if showing cached data
};

type ProductDetailState = {
  status: 'idle' | 'loading' | 'success' | 'failed';
  product: Product | null;
  error: string | null;
};

type InitialState = {
  products: ProductsState;
  productDetail: ProductDetailState;
};

// Initial State
const initialState: InitialState = {
  products: {
    status: 'idle',
    loadingMore: false,
    hasMore: true,
    products: [],
    filteredProducts: [],
    total: 0,
    skip: 0,
    limit: 10,
    error: null,
    selectedCategory: null,
    selectedCategoryName: null,
    sortOption: 'none',
    categories: [],
    categoriesLoading: false,
    isOffline: false,
  },
  productDetail: {
    status: 'idle',
    product: null,
    error: null,
  },
};

// Async Thunks
export const loadCachedProducts = createAsyncThunk(
  'products/loadCachedProducts',
  async () => {
    const cachedData = await loadProductsFromCache();
    if (cachedData) {
      return cachedData.data;
    }
    throw new Error('No cached data available');
  },
);

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (
    params: {limit?: number; skip?: number; append?: boolean; useCache?: boolean} = {},
    {rejectWithValue},
  ) => {
    const {limit = 10, skip = 0, append = false, useCache = true} = params;
    try {
      // Use the new productsService
      const productsData = await productsService.getProducts({ limit, skip });
      
      // Save to cache on successful fetch (only for initial load, not pagination)
      if (!append && useCache) {
        await saveProductsToCache(productsData);
      }
      
      return {...productsData, append};
    } catch (error: any) {
      // If fetch fails and we have cache, try to load from cache
      if (useCache && !append) {
        const cachedData = await loadProductsFromCache();
        if (cachedData) {
          // Return cached data but mark it as an error so we can show offline banner
          return rejectWithValue({
            cachedData: cachedData.data,
            error: error.message || 'Failed to fetch products',
          });
        }
      }
      return rejectWithValue({
        error: error.message || 'Failed to fetch products',
      });
    }
  },
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query: string) => {
    // Use the new productsService
    return await productsService.searchProducts({ q: query });
  },
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    // Use the new productsService
    return await productsService.getCategories();
  },
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number) => {
    // Use the new productsService
    return await productsService.getProductById(id);
  },
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (
    params: {category: string; limit?: number; skip?: number; append?: boolean} = {} as {category: string},
    {rejectWithValue},
  ) => {
    const {category, limit = 10, skip = 0, append = false} = params;
    if (!category) {
      return rejectWithValue({
        error: 'Category is required',
      });
    }
    try {
      const productsData = await productsService.getProductsByCategory(category, { limit, skip });
      return {...productsData, append};
    } catch (error: any) {
      return rejectWithValue({
        error: error.message || 'Failed to fetch products by category',
      });
    }
  },
);

// Helper function to apply filters and sorting
const applyFiltersAndSort = (
  products: Product[],
  category: string | null,
  sortOption: 'none' | 'price-asc' | 'price-desc' | 'rating-desc',
): Product[] => {
  let filtered = [...products];

  // Apply category filter
  if (category) {
    filtered = filtered.filter(p => p.category === category);
  }

  // Apply sorting
  switch (sortOption) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating-desc':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    default:
      // No sorting
      break;
  }

  return filtered;
};

// Slice
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductDetail: state => {
      state.productDetail = {
        status: 'idle',
        product: null,
        error: null,
      };
    },

    setSelectedCategory: (state, action) => {
      const categoryData = action.payload; // Can be {slug: string, name: string} or null
      if (categoryData) {
        state.products.selectedCategory = categoryData.slug || categoryData;
        state.products.selectedCategoryName = categoryData.name || null;
      } else {
        state.products.selectedCategory = null;
        state.products.selectedCategoryName = null;
      }
      // Note: We don't apply filters here anymore - we'll fetch from API instead
    },
    setSortOption: (state, action) => {
      state.products.sortOption = action.payload;
      // Apply filters and sorting when sort option changes
      state.products.filteredProducts = applyFiltersAndSort(
        state.products.products || [],
        state.products.selectedCategory,
        action.payload,
      );
    },
    clearFilters: state => {
      state.products.selectedCategory = null;
      state.products.selectedCategoryName = null;
      state.products.sortOption = 'none';
      // Reset filteredProducts to match products (no filters applied)
      state.products.filteredProducts = [...(state.products.products || [])];
    },
  },
  extraReducers(builder) {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state, action) => {
        const isAppend = action.meta.arg?.append || false;
        if (isAppend) {
          state.products.loadingMore = true;
        } else {
          state.products.status = 'loading';
          state.products.error = null;
        }
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const isAppend = action.payload.append;
        const newProducts = action.payload.products;
        const total = action.payload.total;
        const currentSkip = action.payload.skip;
        const limit = action.payload.limit;

        // Clear any previous errors and offline flag on successful fetch
        state.products.error = null;
        state.products.isOffline = false;

        if (isAppend) {
          // Append new products to existing list
          state.products.products = [
            ...(state.products.products || []),
            ...(newProducts || []),
          ];
          state.products.loadingMore = false;
        } else {
          // Replace products (initial load or refresh)
          state.products.products = newProducts || [];
          state.products.status = 'success';
        }

        state.products.total = total;
        state.products.skip = currentSkip;
        state.products.limit = limit;
        // Check if there are more products to load
        state.products.hasMore =
          state.products.products.length < total &&
          currentSkip + newProducts.length < total;

        // Apply filters and sorting to the updated products
        state.products.filteredProducts = applyFiltersAndSort(
          state.products.products || [],
          state.products.selectedCategory,
          state.products.sortOption,
        );
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        const isAppend = action.meta.arg?.append || false;
        const payload = action.payload as any;
        
        // Check if we have cached data to show
        if (payload?.cachedData && !isAppend) {
          const cachedData = payload.cachedData as ProductsResponse;
          state.products.products = cachedData.products || [];
          state.products.total = cachedData.total || 0;
          state.products.skip = cachedData.skip || 0;
          state.products.limit = cachedData.limit || 10;
          state.products.status = 'success';
          state.products.isOffline = true;
          state.products.error = payload.error || 'Failed to fetch products';
          
          // Apply filters and sorting to cached products
          state.products.filteredProducts = applyFiltersAndSort(
            state.products.products || [],
            state.products.selectedCategory,
            state.products.sortOption,
          );
        } else {
          if (isAppend) {
            state.products.loadingMore = false;
          } else {
            state.products.status = 'failed';
          }
          state.products.error = payload?.error || action.error.message || 'Failed to fetch products';
          state.products.isOffline = false;
        }
      })
      // Load Cached Products
      .addCase(loadCachedProducts.fulfilled, (state, action) => {
        const cachedData = action.payload;
        state.products.products = cachedData.products || [];
        state.products.total = cachedData.total || 0;
        state.products.skip = cachedData.skip || 0;
        state.products.limit = cachedData.limit || 10;
        state.products.status = 'success';
        state.products.isOffline = true; // Mark as offline since we're showing cached data
        
        // Apply filters and sorting to cached products
        state.products.filteredProducts = applyFiltersAndSort(
          state.products.products || [],
          state.products.selectedCategory,
          state.products.sortOption,
        );
      })
      .addCase(loadCachedProducts.rejected, state => {
        // If no cache available, just keep the current state
        state.products.isOffline = false;
      })
      // Fetch Product Detail
      .addCase(fetchProductById.pending, state => {
        state.productDetail.status = 'loading';
        state.productDetail.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.productDetail.status = 'success';
        state.productDetail.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.productDetail.status = 'failed';
        state.productDetail.error =
          action.error.message || 'Failed to fetch product details';
      })
      // Search Products
      .addCase(searchProducts.pending, state => {
        state.products.status = 'loading';
        state.products.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.products.status = 'success';
        state.products.products = action.payload.products || [];
        state.products.total = action.payload.total || 0;
        state.products.hasMore = false; // Search results don't support pagination
        // Apply filters and sorting to search results
        state.products.filteredProducts = applyFiltersAndSort(
          action.payload.products || [],
          state.products.selectedCategory,
          state.products.sortOption,
        );
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.products.status = 'failed';
        state.products.error =
          action.error.message || 'Failed to search products';
      })
      // Fetch Categories
      .addCase(fetchCategories.pending, state => {
        state.products.categoriesLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        // Filter out any invalid categories
        const validCategories =
          Array.isArray(action.payload)
            ? action.payload.filter(
                cat => cat && typeof cat === 'object' && cat.slug && cat.name,
              )
            : [];
        state.products.categories = validCategories;
        state.products.categoriesLoading = false;
      })
      .addCase(fetchCategories.rejected, state => {
        state.products.categoriesLoading = false;
        state.products.categories = state.products.categories || [];
      })
      // Fetch Products By Category
      .addCase(fetchProductsByCategory.pending, (state, action) => {
        const isAppend = action.meta.arg?.append || false;
        if (isAppend) {
          state.products.loadingMore = true;
        } else {
          state.products.status = 'loading';
          state.products.error = null;
        }
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        const isAppend = action.payload.append;
        const newProducts = action.payload.products;
        const total = action.payload.total;
        const currentSkip = action.payload.skip;
        const limit = action.payload.limit;

        state.products.error = null;
        state.products.isOffline = false;

        if (isAppend) {
          state.products.products = [
            ...(state.products.products || []),
            ...(newProducts || []),
          ];
          state.products.loadingMore = false;
        } else {
          state.products.products = newProducts || [];
          state.products.status = 'success';
        }

        state.products.total = total;
        state.products.skip = currentSkip;
        state.products.limit = limit;
        state.products.hasMore =
          state.products.products.length < total &&
          currentSkip + newProducts.length < total;

        // Apply sorting to the category products
        state.products.filteredProducts = applyFiltersAndSort(
          state.products.products || [],
          null, // No category filter needed since we already filtered by API
          state.products.sortOption,
        );
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        const isAppend = action.meta.arg?.append || false;
        const payload = action.payload as any;
        
        if (isAppend) {
          state.products.loadingMore = false;
        } else {
          state.products.status = 'failed';
        }
        state.products.error = payload?.error || action.error.message || 'Failed to fetch products by category';
        state.products.isOffline = false;
      });
  },
});

export const {
  clearProductDetail,
  setSelectedCategory,
  setSortOption,
  clearFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
