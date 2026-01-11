import { useRoute } from '@react-navigation/native';
import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';

import { CONTENT_KEYS } from '@/constants/content';
import ProductDescription from '../../components/products/ProductDescription';
import ProductHeader from '../../components/products/ProductHeader';
import ProductImageCarousel from '../../components/products/ProductImageCarousel';
import ProductInfoCard from '../../components/products/ProductInfoCard';
import { Button } from '../../components/ui/Button/Button';
import Layout from '../../components/ui/Layout';
import Text from '../../components/ui/Text';
import { useImageCarousel, useProductDetail, useStarRating } from '../../hooks';
import { useTheme } from '../../hooks/useTheme';
import type { ProductDetailRouteProp } from '../../types/navigation';
import { getImageWidth } from '../../utils/dimensions';

// Screen dimension constants
const IMAGE_WIDTH = getImageWidth();

export default function ProductDetail() {
  const {theme} = useTheme();
  const route = useRoute<ProductDetailRouteProp>();
  const {productId} = route.params;

  const {
    product,
    status,
    error,
    handleRetry,
  } = useProductDetail(productId);

  const {currentImageIndex, handleImageScroll} = useImageCarousel(IMAGE_WIDTH);
  const {renderStars} = useStarRating();

  if (status === 'loading') {
    return (
      <Layout>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, {color: theme.color}]}>
            {CONTENT_KEYS.PRODUCTS.MESSAGES.LOADING_PRODUCT_DETAILS}
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
            {CONTENT_KEYS.PRODUCTS.TITLES.ERROR}
          </Text>
          <Text style={[styles.errorMessage, {color: theme.color}]}>
            {error || CONTENT_KEYS.PRODUCTS.MESSAGES.FAILED_TO_LOAD_DETAILS}
          </Text>
          <Button onPress={handleRetry} text={CONTENT_KEYS.BUTTONS.RETRY} style={styles.retryButton} />
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
        <ProductImageCarousel
          images={product.images}
          currentImageIndex={currentImageIndex}
          onImageScroll={handleImageScroll}
        />

        {/* Product Details */}
        <View style={styles.detailsContainer}>
          <ProductHeader
            title={product.title}
            price={product.price}
            rating={product.rating}
            renderStars={renderStars}
          />

          <ProductDescription description={product.description} />

          <ProductInfoCard
            brand={product.brand}
            category={product.category}
            stock={product.stock}
          />
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
  detailsContainer: {
    paddingHorizontal: 16,
  },
});
