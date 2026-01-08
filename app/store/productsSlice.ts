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
  async (params: {limit?: number; skip?: number} = {}) => {
    const {limit = 10, skip = 0} = params;
    const response = await apiClient.get<ProductsResponse>(
      `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
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
      .addCase(fetchProducts.pending, state => {
        state.products.status = 'loading';
        state.products.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products.status = 'success';
        state.products.products = action.payload.products;
        state.products.total = action.payload.total;
        state.products.skip = action.payload.skip;
        state.products.limit = action.payload.limit;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.products.status = 'failed';
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
