import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';

import Layout from '../../components/Layout';
import NotFound from '../../components/NotFound';
import ProductItem from '../../components/ProductItem';
import Text from '../../components/Text';
import { useTheme } from '../../theme/useTheme';

import { Product } from '../../store/productsSlice';
import { RootState } from '../../store/store';

type FavoritesStackParamList = {
  FavoritesList: undefined;
  ProductDetail: {productId: number};
};

type FavoritesNavigationProp = NativeStackNavigationProp<FavoritesStackParamList>;

export default function Favorites() {
  const {theme} = useTheme();
  const navigation = useNavigation<FavoritesNavigationProp>();

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

  const renderEmpty = () => (
    <NotFound
      title="No Favorites"
      message="You haven't favorited any products yet. Start exploring and add some favorites!"
    />
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
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});
