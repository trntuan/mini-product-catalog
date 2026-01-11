/**
 * Services Module
 * Business Logic Layer - Services that use the API infrastructure
 */

// Business Logic Services
export {default as authService} from './auth.service';
export {default as productsService} from './products.service';

// Re-export types from services
export type {LoginRequest, LoginResponse} from '../types/auth';
export type {Product, ProductsResponse, SearchProductsParams, Category} from '../types/products';
