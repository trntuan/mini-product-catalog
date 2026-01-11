import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useLayoutEffect } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';

import { CONTENT_KEYS } from '@/constants/content';
import { ROUTE_NAMES, ROUTE_PARAMS } from '../../../constants/app';
import NotFound from '../../components/feedback/NotFound';
import ProductItem from '../../components/products/ProductItem';
import Layout from '../../components/ui/Layout';
import Text from '../../components/ui/Text';
import { useFavoriteProducts } from '../../hooks';
import { useTheme } from '../../hooks/useTheme';
import type { FavoritesNavigationProp } from '../../types/navigation';

import type { Product } from '../../types/products';

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
      <ProductItem product={item} onPress={handleProductPress} layout="list" />
    ),
    [handleProductPress],
  );

  const favoritesCountText = `${favoriteProducts.length} saved`;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <Text variant="titleLarge" style={{color: theme.color}}>
            Favorites
          </Text>
          <Text variant="bodySmall" style={{color: theme.textMuted}}>
            {favoritesCountText}
          </Text>
        </View>
      ),
    });
  }, [favoritesCountText, navigation, theme.color, theme.textMuted]);

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
        key="favorites-list"
        data={favoriteProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        style={styles.list}
        ListEmptyComponent={renderEmpty}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerTitle: {
    gap: 2,
  },
  separator: {
    height: 10,
  },
});
