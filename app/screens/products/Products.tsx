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

  const products = useSelector((state: RootState) => state.products.products);
  const status = useSelector(
    (state: RootState) => state.products.products.status,
  );
  const error = useSelector((state: RootState) => state.products.products.error);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts({limit: 10, skip: 0}));
    }
  }, [dispatch, status]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchProducts({limit: 10, skip: 0}));
  }, [dispatch]);

  const handleRetry = useCallback(() => {
    dispatch(fetchProducts({limit: 10, skip: 0}));
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
        Error
      </Text>
      <Text style={[styles.errorMessage, {color: theme.color}]}>
        {error || 'Failed to load products'}
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

  if (status === 'loading' && products.products.length === 0) {
    return <Layout>{renderLoading()}</Layout>;
  }

  if (status === 'failed' && products.products.length === 0) {
    return <Layout>{renderError()}</Layout>;
  }

  if (status === 'success' && products.products.length === 0) {
    return <Layout>{renderEmpty()}</Layout>;
  }

  return (
    <Layout>
      <FlatList
        data={products.products}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={status === 'loading'}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          status === 'loading' && products.products.length > 0 ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={theme.primary} />
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
    marginBottom: 8,
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    minWidth: 120,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
