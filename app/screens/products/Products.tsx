import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '../../components/Button/Button';
import Layout from '../../components/Layout';
import NotFound from '../../components/NotFound';
import ProductItem from '../../components/ProductItem';
import Text from '../../components/Text';
import { useTheme } from '../../theme/useTheme';

import { fetchProducts, Product } from '../../store/productsSlice';
import { AppDispatch, RootState } from '../../store/store';

type ProductsStackParamList = {
  ProductsList: undefined;
  ProductDetail: {productId: number};
};

type ProductsNavigationProp = NativeStackNavigationProp<ProductsStackParamList>;

export default function Products() {
  const {theme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<ProductsNavigationProp>();

  const productsState = useSelector((state: RootState) => state.products.products);
  const { products, hasMore, loadingMore, error } = productsState;
  const status = useSelector(
    (state: RootState) => state.products.products.status,
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts({limit: 10, skip: 0, append: false}));
    }
  }, [dispatch, status]);

  const handleRefresh = useCallback(() => {
    // Reset pagination and errors, reload products
    dispatch(fetchProducts({ limit: 10, skip: 0, append: false }));
  }, [dispatch]);

  const handleRetryLoadMore = useCallback(() => {
    // Retry loading more products after pagination error
    if (!loadingMore && hasMore) {
      const nextSkip = products.length;
      dispatch(fetchProducts({limit: 10, skip: nextSkip, append: true}));
    }
  }, [dispatch, loadingMore, hasMore, products.length]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore && status === 'success' && !error) {
      const nextSkip = products.length;
      dispatch(fetchProducts({limit: 10, skip: nextSkip, append: true}));
    }
  }, [dispatch, loadingMore, hasMore, status, error, products.length]);

  const handleRetry = useCallback(() => {
    dispatch(fetchProducts({limit: 10, skip: 0, append: false}));
  }, [dispatch]);

  const handleProductPress = useCallback(
    (productId: number) => {
      navigation.navigate('ProductDetail', {productId});
    },
    [navigation],
  );

  const renderProduct = useCallback(
    ({item}: {item: Product}) => (
      <ProductItem product={item} onPress={handleProductPress} />
    ),
    [handleProductPress],
  );

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[styles.loadingText, {color: theme.color}]}>
        Loading products...
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text variant="titleLarge" style={[styles.errorTitle, {color: theme.error}]}>
        Unable to Load Products
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.errorMessage, {color: theme.color}]}>
        {error || 'Failed to load products. Please check your connection and try again.'}
      </Text>
      <Button onPress={handleRetry} text="Retry" style={styles.retryButton} />
    </View>
  );

  const renderEmpty = () => (
    <NotFound
      title="No Products"
      message="There are no products available at the moment"
    />
  );

  // Show loading screen only on initial load when no products exist
  if (status === 'loading' && products.length === 0) {
    return <Layout>{renderLoading()}</Layout>;
  }

  // Show error screen only on initial load failure when no products exist
  if (status === 'failed' && products.length === 0) {
    return <Layout>{renderError()}</Layout>;
  }

  // Show empty state only when successfully loaded but no products
  if (status === 'success' && products.length === 0) {
    return <Layout>{renderEmpty()}</Layout>;
  }

  return (
    <Layout>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading' && !loadingMore}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text
                variant="bodySmall"
                style={[styles.loadingMoreText, {color: theme.color}]}>
                Loading more products...
              </Text>
            </View>
          ) : error && products.length > 0 && !loadingMore ? (
            <View style={styles.footerLoader}>
              <Text
                variant="bodySmall"
                style={[styles.errorText, {color: theme.error}]}>
                {error}
              </Text>
              <Button
                onPress={handleRetryLoadMore}
                text="Retry"
                style={styles.retryMoreButton}
              />
            </View>
          ) : !hasMore && products.length > 0 ? (
            <View style={styles.footerLoader}>
              <Text
                variant="bodySmall"
                style={[styles.endOfListText, {color: theme.color}]}>
                No more products to load
              </Text>
            </View>
          ) : null
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={10}
        getItemLayout={(data, index) => ({
          length: 124, // Approximate item height (100 thumbnail + 24 padding)
          offset: 124 * index,
          index,
        })}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
  },
  errorTitle: {
    marginBottom: 12,
    textAlign: 'center',
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  retryButton: {
    minWidth: 120,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadingMoreText: {
    marginTop: 8,
    opacity: 0.7,
  },
  endOfListText: {
    marginTop: 8,
    opacity: 0.5,
    fontStyle: 'italic',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 12,
  },
  retryMoreButton: {
    minWidth: 100,
    marginTop: 8,
  },
});