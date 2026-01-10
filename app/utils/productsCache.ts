import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProductsResponse } from '../store/productsSlice';
import { STORAGE_KEYS } from '../types/constants';

const CACHE_KEY = STORAGE_KEYS.PRODUCTS_CACHE;
const CACHE_TIMESTAMP_KEY = STORAGE_KEYS.PRODUCTS_CACHE_TIMESTAMP;

export interface CachedProductsData {
  data: ProductsResponse;
  timestamp: number;
}

/**
 * Save products data to cache
 */
export const saveProductsToCache = async (
  productsData: ProductsResponse,
): Promise<void> => {
  try {
    const cacheData: CachedProductsData = {
      data: productsData,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Failed to save products to cache:', error);
  }
};

/**
 * Load products data from cache
 */
export const loadProductsFromCache = async (): Promise<CachedProductsData | null> => {
  try {
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedData) {
      return JSON.parse(cachedData) as CachedProductsData;
    }
    return null;
  } catch (error) {
    console.error('Failed to load products from cache:', error);
    return null;
  }
};

/**
 * Clear products cache
 */
export const clearProductsCache = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
    await AsyncStorage.removeItem(CACHE_TIMESTAMP_KEY);
  } catch (error) {
    console.error('Failed to clear products cache:', error);
  }
};
