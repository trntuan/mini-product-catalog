/**
 * Product Image Carousel Component
 * Displays product images in a horizontal scrollable carousel
 */

import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';

import Text from '../ui/Text';
import { getImageWidth, getScreenWidth } from '../../utils/dimensions';
import { useTheme } from '../../hooks/useTheme';

interface ProductImageCarouselProps {
  images: string[];
  currentImageIndex: number;
  onImageScroll: (event: any) => void;
}

const SCREEN_WIDTH = getScreenWidth();
const IMAGE_WIDTH = getImageWidth();

export default function ProductImageCarousel({
  images,
  currentImageIndex,
  onImageScroll,
}: ProductImageCarouselProps) {
  const {theme} = useTheme();
  return (
    <View style={styles.imageContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onImageScroll}
        style={styles.imageScrollView}>
        {images.map((imageUri: string, index: number) => (
          <View
            key={index}
            style={[styles.imageFrame, {backgroundColor: theme.cardBg, borderColor: theme.cardBorderColor}]}>
            <Image
              source={{uri: imageUri}}
              style={styles.productImage}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
      {images.length > 1 && (
        <View style={[styles.imageIndicator, {backgroundColor: theme.color + 'B3'}]}>
          <Text variant="bodySmall" style={styles.imageIndicatorText}>
            {currentImageIndex + 1} / {images.length}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  imageScrollView: {
    width: SCREEN_WIDTH,
  },
  imageFrame: {
    width: IMAGE_WIDTH,
    height: IMAGE_WIDTH,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
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
});
