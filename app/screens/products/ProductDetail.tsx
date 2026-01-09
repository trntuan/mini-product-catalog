import { Ionicons } from '@expo/vector-icons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '../../components/Button/Button';
import Card from '../../components/Card';
import Layout from '../../components/Layout';
import Text from '../../components/Text';
import { useTheme } from '../../theme/useTheme';

import { toggleFavorite } from '../../store/favoritesSlice';
import { clearProductDetail, fetchProductById } from '../../store/productsSlice';
import { AppDispatch, RootState } from '../../store/store';

type ProductsStackParamList = {
  ProductsList: undefined;
  ProductDetail: {productId: number};
};

type ProductDetailRouteProp = RouteProp<ProductsStackParamList, 'ProductDetail'>;

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH - 32;

export default function ProductDetail() {
  const {theme} = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const route = useRoute<ProductDetailRouteProp>();
  const {productId} = route.params;

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

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchProductById(productId));

    return () => {
      dispatch(clearProductDetail());
    };
  }, [dispatch, productId]);

  const handleToggleFavorite = useCallback(() => {
    if (product) {
      dispatch(toggleFavorite(product.id));
    }
  }, [dispatch, product]);

  useEffect(() => {
    navigation.setOptions({
      title: product?.title || 'Product Details',
      headerRight: () => (
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={styles.favoriteButton}
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
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

  const handleRetry = useCallback(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  const handleImageScroll = useCallback((event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / IMAGE_WIDTH);
    setCurrentImageIndex(index);
  }, []);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Ionicons
            key={i}
            name="star"
            size={18}
            color="#FFD700"
            style={styles.star}
          />,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons
            key={i}
            name="star-half"
            size={18}
            color="#FFD700"
            style={styles.star}
          />,
        );
      } else {
        stars.push(
          <Ionicons
            key={i}
            name="star-outline"
            size={18}
            color="#CCCCCC"
            style={styles.star}
          />,
        );
      }
    }
    return stars;
  };

  if (status === 'loading') {
    return (
      <Layout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, {color: theme.color}]}>
            Loading product details...
          </Text>
        </View>
      </Layout>
    );
  }

  if (status === 'failed') {
    return (
      <Layout>
        <View style={styles.centerContainer}>
          <Text variant="titleLarge" style={[styles.errorTitle, {color: theme.error}]}>
            Error
          </Text>
          <Text style={[styles.errorMessage, {color: theme.color}]}>
            {error || 'Failed to load product details'}
          </Text>
          <Button onPress={handleRetry} text="Retry" style={styles.retryButton} />
        </View>
      </Layout>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <Layout>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleImageScroll}
            style={styles.imageScrollView}>
            {product.images.map((imageUri, index) => (
              <Image
                key={index}
                source={{uri: imageUri}}
                style={styles.productImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          {product.images.length > 1 && (
            <View style={styles.imageIndicator}>
              <Text variant="bodySmall" style={styles.imageIndicatorText}>
                {currentImageIndex + 1} / {product.images.length}
              </Text>
            </View>
          )}
        </View>

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <Card style={styles.card}>
            <Text variant="titleLarge" style={styles.title}>
              {product.title}
            </Text>
            <View style={styles.priceRow}>
              <Text variant="titleLarge" style={[styles.price, {color: theme.primary}]}>
                ${product.price.toFixed(2)}
              </Text>
              {product.discountPercentage > 0 && (
                <View style={styles.discountBadge}>
                  <Text variant="bodySmall" style={styles.discountText}>
                    {product.discountPercentage.toFixed(0)}% OFF
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.ratingContainer}>
              <View style={styles.stars}>{renderStars(product.rating)}</View>
              <Text variant="bodyMedium" style={styles.ratingText}>
                {product.rating.toFixed(1)}
              </Text>
            </View>
          </Card>

          <Card style={styles.card}>
            <Text variant="titleSmall" style={styles.sectionTitle}>
              Description
            </Text>
            <Text variant="bodyMedium" style={styles.description}>
              {product.description}
            </Text>
          </Card>

          <Card style={styles.card}>
            <View style={styles.infoRow}>
              <Text variant="titleSmall" style={styles.infoLabel}>
                Brand:
              </Text>
              <Text variant="bodyMedium" style={styles.infoValue}>
                {product.brand}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="titleSmall" style={styles.infoLabel}>
                Category:
              </Text>
              <Text variant="bodyMedium" style={styles.infoValue}>
                {product.category}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text variant="titleSmall" style={styles.infoLabel}>
                Stock:
              </Text>
              <Text
                variant="bodyMedium"
                style={[
                  styles.infoValue,
                  {color: product.stock > 0 ? theme.primary : theme.error},
                ]}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
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
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  imageScrollView: {
    width: SCREEN_WIDTH,
  },
  productImage: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 16,
    right: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  imageIndicatorText: {
    color: '#ffffff',
  },
  detailsContainer: {
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  price: {
    fontWeight: 'bold',
  },
  discountBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    opacity: 0.7,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  description: {
    lineHeight: 22,
    opacity: 0.8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontWeight: 'bold',
    opacity: 0.7,
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
  },
  favoriteButton: {
    marginRight: 16,
    padding: 4,
  },
});
