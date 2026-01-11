import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';

import Layout from '../../components/ui/Layout';
import OfflineBanner from '../../components/feedback/OfflineBanner';
import ProductItem from '../../components/products/ProductItem';
import ProductsCategoryModal from '../../components/products/ProductsCategoryModal';
import ProductsEmptyState from '../../components/products/ProductsEmptyState';
import ProductsErrorState from '../../components/products/ProductsErrorState';
import ProductsHeaderFilters from '../../components/products/ProductsHeaderFilters';
import ProductsHeaderSearch from '../../components/products/ProductsHeaderSearch';
import ProductsListFooter from '../../components/products/ProductsListFooter';
import ProductsLoadingState from '../../components/products/ProductsLoadingState';
import ProductsSortModal from '../../components/products/ProductsSortModal';
import { useProducts } from '../../hooks';
import { useTheme } from '../../hooks/useTheme';
import { ROUTE_NAMES, ROUTE_PARAMS } from '../../types/constants';
import type { ProductsNavigationProp } from '../../types/navigation';

import { Product } from '../../store/productsSlice';

export default function Products() {
  const {theme} = useTheme();
  const navigation = useNavigation<ProductsNavigationProp>();

  const {
    displayProducts,
    categories,
    status,
    error,
    hasMore,
    loadingMore,
    localSearchQuery,
    selectedCategory,
    sortOption,
    isOffline,
    hasActiveFilters,
    showCategoryModal,
    showSortModal,
    setLocalSearchQuery,
    setShowCategoryModal,
    setShowSortModal,
    handleRefresh,
    handleRetryLoadMore,
    handleLoadMore,
    handleRetry,
    handleCategorySelect,
    handleSortSelect,
    handleClearFilters,
  } = useProducts();

  const handleProductPress = useCallback(
    (productId: number) => {
      navigation.navigate(ROUTE_NAMES.PRODUCT_DETAIL, {
        [ROUTE_PARAMS.PRODUCT_ID]: productId,
      });
    },
    [navigation],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <ProductsHeaderSearch
          query={localSearchQuery}
          onChangeQuery={setLocalSearchQuery}
          onClearQuery={() => setLocalSearchQuery('')}
        />
      ),
      headerRight: () => (
        <ProductsHeaderFilters
          selectedCategory={selectedCategory}
          sortOption={sortOption}
          hasActiveFilters={hasActiveFilters}
          onOpenCategory={() => setShowCategoryModal(true)}
          onOpenSort={() => setShowSortModal(true)}
          onClearFilters={handleClearFilters}
        />
      ),
    });
  }, [
    handleClearFilters,
    hasActiveFilters,
    localSearchQuery,
    navigation,
    selectedCategory,
    setLocalSearchQuery,
    setShowCategoryModal,
    setShowSortModal,
    sortOption,
  ]);

  const renderProduct = useCallback(
    ({item}: {item: Product}) => (
      <ProductItem product={item} onPress={handleProductPress} layout="grid" />
    ),
    [handleProductPress],
  );

  // Show loading screen only on initial load when no products exist
  if (status === 'loading' && (!displayProducts || displayProducts.length === 0)) {
    return (
      <Layout>
        <ProductsLoadingState />
      </Layout>
    );
  }

  // Show error screen only on initial load failure when no products exist
  if (status === 'failed' && (!displayProducts || displayProducts.length === 0)) {
    return (
      <Layout>
        <ProductsErrorState error={error} onRetry={handleRetry} />
      </Layout>
    );
  }

  // Show empty state only when successfully loaded but no products to display
  if (
    status === 'success' &&
    displayProducts &&
    displayProducts.length === 0 &&
    !loadingMore
  ) {
    return (
      <Layout>
        <ProductsEmptyState
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Offline Banner */}
      {isOffline && <OfflineBanner />}
      
      <FlatList
        key="products-grid-2"
        data={displayProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.listRow}
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
        ListEmptyComponent={
          <ProductsEmptyState
            hasActiveFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
          />
        }
        ListFooterComponent={
          <ProductsListFooter
            loadingMore={loadingMore}
            error={error}
            hasMore={hasMore}
            hasItems={!!displayProducts && displayProducts.length > 0}
            onRetryLoadMore={handleRetryLoadMore}
          />
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

      {/* Category Modal */}
      <ProductsCategoryModal
        visible={showCategoryModal}
        categories={categories}
        selectedCategory={selectedCategory}
        onClose={() => setShowCategoryModal(false)}
        onSelectCategory={handleCategorySelect}
      />

      {/* Sort Modal */}
      <ProductsSortModal
        visible={showSortModal}
        sortOption={sortOption}
        onClose={() => setShowSortModal(false)}
        onSelectSort={handleSortSelect}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 12,
  },
  listRow: {
    gap: 12,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
});
