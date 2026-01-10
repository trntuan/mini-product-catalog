/**
 * Products Service
 * Product-related API calls (Business Logic Layer)
 */

import {httpService, ENDPOINTS, PaginationParams} from '../api';

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

export interface SearchProductsParams extends PaginationParams {
  q: string;
}

class ProductsService {
  /**
   * Get all products with pagination
   */
  async getProducts(params?: PaginationParams): Promise<ProductsResponse> {
    const response = await httpService.get<ProductsResponse>(ENDPOINTS.PRODUCTS.BASE, {
      params: {
        limit: params?.limit || 10,
        skip: params?.skip || 0,
      },
    });
    return response.data;
  }

  /**
   * Get product by ID
   */
  async getProductById(id: number | string): Promise<Product> {
    const response = await httpService.get<Product>(ENDPOINTS.PRODUCTS.BY_ID(id));
    return response.data;
  }

  /**
   * Search products
   */
  async searchProducts(params: SearchProductsParams): Promise<ProductsResponse> {
    const response = await httpService.get<ProductsResponse>(ENDPOINTS.PRODUCTS.SEARCH, {
      params: {
        q: params.q,
        limit: params.limit,
        skip: params.skip,
      },
    });
    return response.data;
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<string[]> {
    const response = await httpService.get<string[]>(ENDPOINTS.PRODUCTS.CATEGORY_LIST);
    return response.data;
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(
    category: string,
    params?: PaginationParams,
  ): Promise<ProductsResponse> {
    const response = await httpService.get<ProductsResponse>(
      ENDPOINTS.PRODUCTS.BY_CATEGORY(category),
      {
        params: {
          limit: params?.limit || 10,
          skip: params?.skip || 0,
        },
      },
    );
    return response.data;
  }
}

export default new ProductsService();
