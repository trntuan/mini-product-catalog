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
  total: number;
  skip: number;
  limit: number;
  error: string | null;
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
    total: 0,
    skip: 0,
    limit: 10,
    error: null,
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

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id: number) => {
    const response = await apiClient.get<Product>(
      `https://dummyjson.com/products/${id}`,
    );
    return response.data;
  },
);

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
          state.products.products = [...state.products.products, ...newProducts];
          state.products.loadingMore = false;
        } else {
          // Replace products (initial load or refresh)
          state.products.products = newProducts;
          state.products.status = 'success';
        }

        state.products.total = total;
        state.products.skip = currentSkip;
        state.products.limit = limit;
        // Check if there are more products to load
        state.products.hasMore =
          state.products.products.length < total &&
          currentSkip + newProducts.length < total;
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
      });
  },
});

export const {clearProductDetail} = productsSlice.actions;

export default productsSlice.reducer;
