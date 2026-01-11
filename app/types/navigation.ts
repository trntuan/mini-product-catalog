/**
 * Navigation Types
 * Centralized type definitions for React Navigation
 */

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

// ============================================================================
// Stack Param Lists
// ============================================================================

export type ProductsStackParamList = {
  ProductsList: undefined;
  ProductDetail: {productId: number};
};

export type FavoritesStackParamList = {
  FavoritesList: undefined;
  ProductDetail: {productId: number};
};

// ============================================================================
// Navigation Props
// ============================================================================

export type ProductsNavigationProp = NativeStackNavigationProp<ProductsStackParamList>;

export type FavoritesNavigationProp = NativeStackNavigationProp<FavoritesStackParamList>;

// ============================================================================
// Route Props
// ============================================================================

export type ProductDetailRouteProp = RouteProp<ProductsStackParamList, 'ProductDetail'>;
