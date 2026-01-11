import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect } from 'react';
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

import { Button } from '../../components/Button/Button';
import Layout from '../../components/Layout';
import NotFound from '../../components/NotFound';
import OfflineBanner from '../../components/OfflineBanner';
import ProductItem from '../../components/ProductItem';
import Text from '../../components/Text';
import { useProducts } from '../../hooks';
import { useTheme } from '../../hooks/useTheme';
import { ROUTE_NAMES, ROUTE_PARAMS } from '../../types/constants';
import { CONTENT_KEYS } from '../../types/content';
import type { ProductsNavigationProp } from '../../types/navigation';

import { Product } from '../../store/productsSlice';

// Helper function to get category display name
const getCategoryDisplayName = (categoryName: string | null): string => {
  if (!categoryName) return CONTENT_KEYS.LABELS.CATEGORY;
  return categoryName;
};

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
    selectedCategoryName,
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
        <View
          style={[
            styles.headerSearchWrapper,
            {borderColor: theme.cardBorderColor},
          ]}>
          <Ionicons
            name="search"
            size={18}
            color={theme.textMuted}
            style={styles.headerSearchIcon}
          />
          <TextInput
            style={[styles.headerSearchInput, {color: theme.color}]}
            placeholder={CONTENT_KEYS.PRODUCTS.PLACEHOLDERS.SEARCH_PRODUCTS}
            placeholderTextColor={theme.textMuted}
            value={localSearchQuery}
            onChangeText={setLocalSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {localSearchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setLocalSearchQuery('')}
              style={styles.headerClearButton}
              accessibilityLabel={CONTENT_KEYS.BUTTONS.CLEAR}>
              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      ),
      headerRight: () => (
        <View style={styles.headerFilters}>
          <TouchableOpacity
            style={[
              styles.headerIconButton,
              {
                backgroundColor:
                  selectedCategory !== null ? theme.primarySoft : theme.cardBg,
                borderColor: theme.cardBorderColor,
              },
            ]}
            onPress={() => setShowCategoryModal(true)}
            accessibilityLabel={CONTENT_KEYS.LABELS.CATEGORY}>
            <Ionicons
              name="funnel-outline"
              size={18}
              color={selectedCategory !== null ? theme.primary : theme.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.headerIconButton,
              {
                backgroundColor:
                  sortOption !== 'none' ? theme.primarySoft : theme.cardBg,
                borderColor: theme.cardBorderColor,
              },
            ]}
            onPress={() => setShowSortModal(true)}
            accessibilityLabel={CONTENT_KEYS.LABELS.SORT}>
            <Ionicons
              name="swap-vertical-outline"
              size={18}
              color={sortOption !== 'none' ? theme.primary : theme.textMuted}
            />
          </TouchableOpacity>
          {hasActiveFilters && (
            <TouchableOpacity
              style={[styles.headerIconButton, {borderColor: theme.error}]}
              onPress={handleClearFilters}
              accessibilityLabel={CONTENT_KEYS.BUTTONS.CLEAR}>
              <Ionicons name="close" size={18} color={theme.error} />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [
    handleClearFilters,
    hasActiveFilters,
    localSearchQuery,
    navigation,
    selectedCategory,
    selectedCategoryName,
    setLocalSearchQuery,
    setShowCategoryModal,
    setShowSortModal,
    sortOption,
    theme.cardBg,
    theme.cardBorderColor,
    theme.color,
    theme.error,
    theme.primary,
    theme.textMuted,
  ]);

  const renderProduct = useCallback(
    ({item}: {item: Product}) => (
      <ProductItem product={item} onPress={handleProductPress} layout="grid" />
    ),
    [handleProductPress],
  );

  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[styles.loadingText, {color: theme.color}]}>
        {CONTENT_KEYS.PRODUCTS.MESSAGES.LOADING_PRODUCTS}
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text variant="titleLarge" style={[styles.errorTitle, {color: theme.error}]}>
        {CONTENT_KEYS.PRODUCTS.TITLES.UNABLE_TO_LOAD}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.errorMessage, {color: theme.color}]}>
        {error || CONTENT_KEYS.PRODUCTS.MESSAGES.FAILED_TO_LOAD}
      </Text>
      <Button onPress={handleRetry} text={CONTENT_KEYS.BUTTONS.RETRY} style={styles.retryButton} />
    </View>
  );

  const renderEmpty = () => (
    <NotFound
      title={CONTENT_KEYS.PRODUCTS.TITLES.NO_PRODUCTS}
      message={CONTENT_KEYS.PRODUCTS.MESSAGES.NO_PRODUCTS_AVAILABLE}
    />
  );

  // Show loading screen only on initial load when no products exist
  if (status === 'loading' && (!displayProducts || displayProducts.length === 0)) {
    return <Layout>{renderLoading()}</Layout>;
  }

  // Show error screen only on initial load failure when no products exist
  if (status === 'failed' && (!displayProducts || displayProducts.length === 0)) {
    return <Layout>{renderError()}</Layout>;
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
        {hasActiveFilters ? (
          <View style={styles.centerContainer}>
            <Text variant="titleLarge" style={[styles.errorTitle, {color: theme.color}]}>
              {CONTENT_KEYS.PRODUCTS.TITLES.NO_RESULTS_FOUND}
            </Text>
            <Text
              variant="bodyMedium"
              style={[styles.errorMessage, {color: theme.color}]}>
              {CONTENT_KEYS.PRODUCTS.MESSAGES.NO_RESULTS_MESSAGE}
            </Text>
            <Button onPress={handleClearFilters} text={CONTENT_KEYS.BUTTONS.CLEAR_FILTERS} style={styles.retryButton} />
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
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="small" color={theme.primary} />
              <Text
                variant="bodySmall"
                style={[styles.loadingMoreText, {color: theme.color}]}>
                {CONTENT_KEYS.MESSAGES.LOADING_MORE}
              </Text>
            </View>
          ) : error && displayProducts && displayProducts.length > 0 && !loadingMore ? (
            <View style={styles.footerLoader}>
              <Text
                variant="bodySmall"
                style={[styles.errorText, {color: theme.error}]}>
                {error}
              </Text>
              <Button
                onPress={handleRetryLoadMore}
                text={CONTENT_KEYS.BUTTONS.RETRY}
                style={styles.retryMoreButton}
              />
            </View>
          ) : !hasMore && displayProducts && displayProducts.length > 0 ? (
            <View style={styles.footerLoader}>
              <Text
                variant="bodySmall"
                style={[styles.endOfListText, {color: theme.color}]}>
                {CONTENT_KEYS.MESSAGES.NO_MORE_PRODUCTS}
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
                {CONTENT_KEYS.PRODUCTS.TITLES.SELECT_CATEGORY}
              </Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Text style={{color: theme.primary, fontSize: 16}}>{CONTENT_KEYS.BUTTONS.CLOSE}</Text>
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
                  {CONTENT_KEYS.PRODUCTS.LABELS.ALL_CATEGORIES}
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
                {CONTENT_KEYS.PRODUCTS.TITLES.SORT_BY}
              </Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <Text style={{color: theme.primary, fontSize: 16}}>{CONTENT_KEYS.BUTTONS.CLOSE}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              {[
                {value: 'none', label: CONTENT_KEYS.PRODUCTS.LABELS.SORT_NONE},
                {value: 'price-asc', label: CONTENT_KEYS.PRODUCTS.LABELS.SORT_PRICE_LOW_TO_HIGH},
                {value: 'price-desc', label: CONTENT_KEYS.PRODUCTS.LABELS.SORT_PRICE_HIGH_TO_LOW},
                {value: 'rating-desc', label: CONTENT_KEYS.PRODUCTS.LABELS.SORT_RATING_HIGH_TO_LOW},
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
    paddingHorizontal: 6,
    paddingVertical: 6,
    gap: 12,
  },
  listRow: {
    gap: 12,
    paddingBottom: 12,
    justifyContent: 'space-between',
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
  headerSearchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
  },
  headerSearchIcon: {
    opacity: 0.8,
  },
  headerSearchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    paddingHorizontal: 8,
  },
  headerClearButton: {
    padding: 2,
  },
  headerFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 8,
  },
  headerIconButton: {
    height: 36,
    width: 36,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
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
