import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '../../components/Button/Button';
import Layout from '../../components/Layout';
import NotFound from '../../components/NotFound';
import OfflineBanner from '../../components/OfflineBanner';
import ProductItem from '../../components/ProductItem';
import Text from '../../components/Text';
import { useTheme } from '../../theme/useTheme';
import { useDebounce } from '../../utils/useDebounce';

import {
  clearFilters,
  fetchCategories,
  fetchProducts,
  fetchProductsByCategory,
  loadCachedProducts,
  Product,
  searchProducts,
  setSearchQuery,
  setSelectedCategory,
  setSortOption,
} from '../../store/productsSlice';
import { AppDispatch, RootState } from '../../store/store';

type ProductsStackParamList = {
  ProductsList: undefined;
  ProductDetail: {productId: number};
};

type ProductsNavigationProp = NativeStackNavigationProp<ProductsStackParamList>;

// Helper function to get category display name
const getCategoryDisplayName = (categoryName: string | null): string => {
  if (!categoryName) return 'Category';
  return categoryName;
};

export default function Products() {
  const {theme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<ProductsNavigationProp>();

  const productsState = useSelector((state: RootState) => state.products.products);
  const {
    products = [],
    filteredProducts = [],
    hasMore = false,
    loadingMore = false,
    error = null,
    searchQuery = '',
    selectedCategory = null,
    selectedCategoryName = null,
    sortOption = 'none',
    categories = [],
    categoriesLoading = false,
    isOffline = false,
  } = productsState || {};
  const status = useSelector(
    (state: RootState) => state.products.products?.status || 'idle',
  );

  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);

  const debouncedSearchQuery = useDebounce(localSearchQuery, 400);

  // Load cached products on mount, then fetch fresh data
  useEffect(() => {
    if (status === 'idle') {
      // First, try to load cached data for immediate display
      dispatch(loadCachedProducts())
        .then(() => {
          // Then fetch fresh data in the background
          dispatch(fetchProducts({limit: 10, skip: 0, append: false}));
        })
        .catch(() => {
          // If no cache available, just fetch fresh data
          dispatch(fetchProducts({limit: 10, skip: 0, append: false}));
        });
    }
    if ((!categories || categories.length === 0) && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, status, categories, categoriesLoading]);

  // Handle search with debounce
  useEffect(() => {
    const trimmedQuery = debouncedSearchQuery.trim();
    dispatch(setSearchQuery(trimmedQuery));
    
    if (trimmedQuery.length > 0) {
      dispatch(searchProducts(trimmedQuery));
    } else {
      // If search is cleared and we were searching, reload original products
      if (searchQuery && searchQuery.length > 0) {
        dispatch(fetchProducts({limit: 10, skip: 0, append: false}));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchQuery, dispatch]);

  const handleRefresh = useCallback(() => {
    // Reset pagination and errors, reload products
    dispatch(fetchProducts({ limit: 10, skip: 0, append: false }));
  }, [dispatch]);

  const handleRetryLoadMore = useCallback(() => {
    // Retry loading more products after pagination error
    if (!loadingMore && hasMore && products) {
      const nextSkip = products.length || 0;
      dispatch(fetchProducts({limit: 10, skip: nextSkip, append: true}));
    }
  }, [dispatch, loadingMore, hasMore, products]);

  const handleLoadMore = useCallback(() => {
    // Don't load more if we're searching (search results don't support pagination)
    if (
      !loadingMore &&
      hasMore &&
      status === 'success' &&
      !error &&
      (!searchQuery || searchQuery.length === 0) &&
      products
    ) {
      const nextSkip = products.length || 0;
      // If a category is selected, load more products from that category
      if (selectedCategory) {
        dispatch(fetchProductsByCategory({
          category: selectedCategory,
          limit: 10,
          skip: nextSkip,
          append: true
        }));
      } else {
        dispatch(fetchProducts({limit: 10, skip: nextSkip, append: true}));
      }
    }
  }, [dispatch, loadingMore, hasMore, status, error, products, searchQuery, selectedCategory]);

  const handleRetry = useCallback(() => {
    dispatch(fetchProducts({limit: 10, skip: 0, append: false}));
  }, [dispatch]);

  const handleProductPress = useCallback(
    (productId: number) => {
      navigation.navigate('ProductDetail', {productId});
    },
    [navigation],
  );

  const handleCategorySelect = useCallback(
    (category: {slug: string; name: string} | null) => {
      dispatch(setSelectedCategory(category));
      setShowCategoryModal(false);
      
      // Fetch products by category when a category is selected
      if (category) {
        dispatch(fetchProductsByCategory({category: category.slug, limit: 10, skip: 0, append: false}));
      } else {
        // If "All Categories" is selected, fetch all products
        dispatch(fetchProducts({limit: 10, skip: 0, append: false}));
      }
    },
    [dispatch],
  );

  const handleSortSelect = useCallback(
    (sort: 'none' | 'price-asc' | 'price-desc' | 'rating-desc') => {
      dispatch(setSortOption(sort));
      setShowSortModal(false);
    },
    [dispatch],
  );

  const handleClearFilters = useCallback(() => {
    setLocalSearchQuery('');
    dispatch(clearFilters());
    // Reload all products when filters are cleared
    dispatch(fetchProducts({limit: 10, skip: 0, append: false}));
  }, [dispatch]);

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
  if (status === 'loading' && (!products || products.length === 0)) {
    return <Layout>{renderLoading()}</Layout>;
  }

  // Show error screen only on initial load failure when no products exist
  if (status === 'failed' && (!products || products.length === 0)) {
    return <Layout>{renderError()}</Layout>;
  }

  const hasActiveFilters =
    (searchQuery && searchQuery.length > 0) ||
    selectedCategory !== null ||
    sortOption !== 'none';

  // Use filteredProducts when available (after filters/sort/search are applied)
  // Otherwise fall back to products (initial load or when no filters)
  const displayProducts =
    (filteredProducts && filteredProducts.length > 0) || hasActiveFilters
      ? filteredProducts || []
      : products || [];

  // Show empty state only when successfully loaded but no products to display
  if (
    status === 'success' &&
    displayProducts &&
    displayProducts.length === 0 &&
    !loadingMore
  ) {
    return (
      <Layout>
        {hasActiveFilters ? (
          <View style={styles.centerContainer}>
            <Text variant="titleLarge" style={[styles.errorTitle, {color: theme.color}]}>
              No Results Found
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.errorMessage, {color: theme.color}]}>
              Try adjusting your search, filter, or sort options
            </Text>
            <Button onPress={handleClearFilters} text="Clear Filters" style={styles.retryButton} />
          </View>
        ) : (
          renderEmpty()
        )}
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Offline Banner */}
      {isOffline && <OfflineBanner />}
      
      {/* Search, Filter, and Sort Controls */}
      <View style={[styles.controlsContainer, {backgroundColor: theme.cardBg}]}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={[
              styles.searchInput,
              {
                color: theme.color,
                borderColor: theme.cardBorderColor,
                backgroundColor: theme.layoutBg,
              },
            ]}
            placeholder="Search products..."
            placeholderTextColor={theme.color + '80'}
            value={localSearchQuery}
            onChangeText={setLocalSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Filter and Sort Buttons */}
        <View style={styles.filterRow}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  selectedCategory !== null ? theme.primary : theme.layoutBg,
                borderColor: theme.cardBorderColor,
              },
            ]}
            onPress={() => setShowCategoryModal(true)}>
            <Text
              style={[
                styles.filterButtonText,
                {
                  color:
                    selectedCategory !== null
                      ? '#ffffff'
                      : theme.color,
                },
              ]}>
              {getCategoryDisplayName(selectedCategoryName)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  sortOption !== 'none' ? theme.primary : theme.layoutBg,
                borderColor: theme.cardBorderColor,
              },
            ]}
            onPress={() => setShowSortModal(true)}>
            <Text
              style={[
                styles.filterButtonText,
                {
                  color: sortOption !== 'none' ? '#ffffff' : theme.color,
                },
              ]}>
              {sortOption === 'none'
                ? 'Sort'
                : sortOption === 'price-asc'
                ? 'Price ↑'
                : sortOption === 'price-desc'
                ? 'Price ↓'
                : 'Rating ↓'}
            </Text>
          </TouchableOpacity>

          {hasActiveFilters && (
            <TouchableOpacity
              style={[styles.clearButton, {borderColor: theme.error}]}
              onPress={handleClearFilters}>
              <Text style={[styles.clearButtonText, {color: theme.error}]}>
                Clear
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={displayProducts}
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
          ) : error && products && products.length > 0 && !loadingMore ? (
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
          ) : !hasMore && products && products.length > 0 ? (
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

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {backgroundColor: theme.cardBg}]}>
            <View style={styles.modalHeader}>
              <Text variant="titleLarge" style={{color: theme.color}}>
                Select Category
              </Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Text style={{color: theme.primary, fontSize: 16}}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  {
                    backgroundColor:
                      selectedCategory === null
                        ? theme.primary + '20'
                        : 'transparent',
                  },
                ]}
                onPress={() => handleCategorySelect(null)}>
                <Text
                  style={[
                    styles.modalItemText,
                    {
                      color:
                        selectedCategory === null ? theme.primary : theme.color,
                      fontWeight:
                        selectedCategory === null ? '600' : '400',
                    },
                  ]}>
                  All Categories
                </Text>
              </TouchableOpacity>
              {categories &&
                categories.map(category => {
                  // Safety check - ensure category is a valid object
                  if (!category || typeof category !== 'object' || !category.slug || !category.name) {
                    return null;
                  }
                  return (
                    <TouchableOpacity
                      key={category.slug}
                      style={[
                        styles.modalItem,
                        {
                          backgroundColor:
                            selectedCategory === category.slug
                              ? theme.primary + '20'
                              : 'transparent',
                        },
                      ]}
                      onPress={() => handleCategorySelect(category)}>
                      <Text
                        style={[
                          styles.modalItemText,
                          {
                            color:
                              selectedCategory === category.slug
                                ? theme.primary
                                : theme.color,
                            fontWeight:
                              selectedCategory === category.slug ? '600' : '400',
                          },
                        ]}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {backgroundColor: theme.cardBg}]}>
            <View style={styles.modalHeader}>
              <Text variant="titleLarge" style={{color: theme.color}}>
                Sort By
              </Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Text style={{color: theme.primary, fontSize: 16}}>Close</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              {[
                {value: 'none', label: 'None'},
                {value: 'price-asc', label: 'Price: Low to High'},
                {value: 'price-desc', label: 'Price: High to Low'},
                {value: 'rating-desc', label: 'Rating: High to Low'},
              ].map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.modalItem,
                    {
                      backgroundColor:
                        sortOption === option.value
                          ? theme.primary + '20'
                          : 'transparent',
                    },
                  ]}
                  onPress={() =>
                    handleSortSelect(
                      option.value as
                        | 'none'
                        | 'price-asc'
                        | 'price-desc'
                        | 'rating-desc',
                    )
                  }>
                  <Text
                    style={[
                      styles.modalItemText,
                      {
                        color:
                          sortOption === option.value
                            ? theme.primary
                            : theme.color,
                        fontWeight:
                          sortOption === option.value ? '600' : '400',
                      },
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  controlsContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  filterButton: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  clearButton: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  modalScrollView: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  modalItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  modalItemText: {
    fontSize: 16,
  },
});