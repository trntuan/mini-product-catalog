/**
 * Custom hook for managing favorite products
 */

import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import type { Product } from '../types/products';
import { RootState } from '../store/store';

export function useFavoriteProducts() {
  const favoriteIds = useSelector(
    (state: RootState) => state.favorites.favoriteIds,
  );
  const allProducts = useSelector(
    (state: RootState) => state.products.products.products || [],
  );

  // Get favorite products by matching IDs
  const favoriteProducts = useMemo(() => {
    return allProducts.filter((product: Product) =>
      favoriteIds.includes(product.id),
    );
  }, [allProducts, favoriteIds]);

  return {
    favoriteProducts,
    favoriteIds,
  };
}
