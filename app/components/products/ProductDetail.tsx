/**
 * Custom hook for managing product detail state and operations
 */

import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { useTheme } from '../../hooks/useTheme';
import { toggleFavorite } from '../../store/favoritesSlice';
import { clearProductDetail, fetchProductById } from '../../store/productsSlice';
import { AppDispatch, RootState } from '../../store/store';
import { CONTENT_KEYS } from '../../types/content';

export function useProductDetail(productId: number) {
  const {theme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const product = useSelector(
    (state: RootState) => state.products.productDetail.product,
  );
  const status = useSelector(
    (state: RootState) => state.products.productDetail.status,
  );
  const error = useSelector(
    (state: RootState) => state.products.productDetail.error,
  );
  const favoriteIds = useSelector(
    (state: RootState) => state.favorites.favoriteIds,
  );

  const isFavorite = product ? favoriteIds.includes(product.id) : false;

  // Fetch product on mount and cleanup on unmount
  useEffect(() => {
    dispatch(fetchProductById(productId));

    return () => {
      dispatch(clearProductDetail());
    };
  }, [dispatch, productId]);

  // Toggle favorite handler
  const handleToggleFavorite = useCallback(() => {
    if (product) {
      dispatch(toggleFavorite(product.id));
    }
  }, [dispatch, product]);

  // Retry handler
  const handleRetry = useCallback(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  // Set navigation header with favorite button
  useEffect(() => {
    navigation.setOptions({
      title: product?.title || CONTENT_KEYS.PRODUCTS.TITLES.PRODUCT_DETAILS,
      headerRight: () => (
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={{marginRight: 16, padding: 4}}
          accessibilityLabel={isFavorite ? CONTENT_KEYS.PRODUCTS.ACCESSIBILITY.REMOVE_FROM_FAVORITES : CONTENT_KEYS.PRODUCTS.ACCESSIBILITY.ADD_TO_FAVORITES}
          accessibilityRole="button">
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#FF6B6B' : theme.color}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, product, isFavorite, handleToggleFavorite, theme.color]);

  return {
    product,
    status,
    error,
    isFavorite,
    handleToggleFavorite,
    handleRetry,
  };
}
