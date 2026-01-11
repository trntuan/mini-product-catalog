import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';

import Layout from '../../components/Layout';
import NotFound from '../../components/NotFound';
import ProductItem from '../../components/ProductItem';
import { useFavoriteProducts } from '../../hooks';
import { useTheme } from '../../hooks/useTheme';
import { ROUTE_NAMES, ROUTE_PARAMS } from '../../types/constants';
import { CONTENT_KEYS } from '../../types/content';
import type { FavoritesNavigationProp } from '../../types/navigation';

import { Product } from '../../store/productsSlice';

export default function Favorites() {
  const {theme} = useTheme();
  const navigation = useNavigation<FavoritesNavigationProp>();

  const {favoriteProducts} = useFavoriteProducts();

  const handleProductPress = useCallback(
    (productId: number) => {
      navigation.navigate(ROUTE_NAMES.PRODUCT_DETAIL, {
        [ROUTE_PARAMS.PRODUCT_ID]: productId,
      });
    },
    [navigation],
  );

  const renderProduct = useCallback(
    ({item}: {item: Product}) => (
      <ProductItem product={item} onPress={handleProductPress} />
    ),
    [handleProductPress],
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <NotFound 
        title={CONTENT_KEYS.FAVORITES.TITLES.NO_FAVORITES}
        message={CONTENT_KEYS.FAVORITES.MESSAGES.NO_FAVORITES_MESSAGE}
      />
    </View>
  );

  if (favoriteProducts.length === 0) {
    return (
      <Layout>
        <View style={styles.container}>
          {renderEmpty()}
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <FlatList
        data={favoriteProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={false}
            tintColor={theme.primary}
            colors={[theme.primary]}
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
    </Layout>
  );
}

const styles = StyleSheet.create({
  layout: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 16,
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
