import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import apiClient from '../services/api-client';

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
  searchQuery: string;
  selectedCategory: string | null;
  sortOption: 'none' | 'price-asc' | 'price-desc' | 'rating-desc';
  categories: string[];
  categoriesLoading: boolean;
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
    searchQuery: '',
    selectedCategory: null,
    sortOption: 'none',
    categories: [],
    categoriesLoading: false,
  },
  productDetail: {
    status: 'idle',
    product: null,
    error: null,
  },
};

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params: {limit?: number; skip?: number; append?: boolean} = {}) => {
    const {limit = 10, skip = 0, append = false} = params;
    const response = await apiClient.get<ProductsResponse>(
      `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
    );
    return {...response.data, append};
  },
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query: string) => {
    const response = await apiClient.get<ProductsResponse>(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`,
    );
    return response.data;
  },
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    // Use category-list endpoint which returns array of category slugs (strings)
    const response = await apiClient.get<string[]>(
      'https://dummyjson.com/products/category-list',
    );
    return response.data;
  },
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number) => {
    const response = await apiClient.get<Product>(
      `https://dummyjson.com/products/${id}`,
    );
    return response.data;
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
    setSearchQuery: (state, action) => {
      state.products.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.products.selectedCategory = action.payload;
      // Apply filters and sorting when category changes
      state.products.filteredProducts = applyFiltersAndSort(
        state.products.products || [],
        action.payload,
        state.products.sortOption,
      );
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
      state.products.searchQuery = '';
      state.products.selectedCategory = null;
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

        // Clear any previous errors on successful fetch
        state.products.error = null;

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
        if (isAppend) {
          state.products.loadingMore = false;
        } else {
          state.products.status = 'failed';
        }
        state.products.error = action.error.message || 'Failed to fetch products';
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
        // Filter out any invalid categories (null, undefined, non-strings)
        const validCategories =
          Array.isArray(action.payload)
            ? action.payload.filter(
                cat => cat && typeof cat === 'string' && cat.length > 0,
              )
            : [];
        state.products.categories = validCategories;
        state.products.categoriesLoading = false;
      })
      .addCase(fetchCategories.rejected, state => {
        state.products.categoriesLoading = false;
        state.products.categories = state.products.categories || [];
      });
  },
});

export const {
  clearProductDetail,
  setSearchQuery,
  setSelectedCategory,
  setSortOption,
  clearFilters,
} = productsSlice.actions;

export default productsSlice.reducer;
