import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '../hooks/useTheme';
import { Product } from '../store/productsSlice';
import Card from './Card';
import Text from './Text';

interface ProductItemProps {
  product: Product;
  onPress: (productId: number) => void;
}

const ProductItem = ({product, onPress}: ProductItemProps) => {
  const {theme} = useTheme();

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
            size={14}
            color="#FFD700"
            style={styles.star}
          />,
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Ionicons
            key={i}
            name="star-half"
            size={14}
            color="#FFD700"
            style={styles.star}
          />,
        );
      } else {
        stars.push(
          <Ionicons
            key={i}
            name="star-outline"
            size={14}
            color="#CCCCCC"
            style={styles.star}
          />,
        );
      }
    }
    return stars;
  };

  return (
    <Card style={[styles.card, {shadowColor: '#000'}]}>
      <Pressable
        onPress={() => onPress(product.id)}
        style={({pressed}) => [
          styles.container,
          pressed && styles.pressedContainer,
        ]}
        accessibilityLabel={`Product: ${product.title}`}
        accessibilityRole="button">
        <Image
          source={{uri: product.thumbnail}}
          style={styles.thumbnail}
          resizeMode="contain"
        />
        <View style={styles.content}>
          <Text variant="titleSmall" style={[styles.title, {color: theme.color}]} >
            {product.title}
          </Text>
          <Text variant="titleLarge" style={[styles.price, {color: theme.primary}]}>
            ${product.price.toFixed(2)}
          </Text>
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>{renderStars(product.rating)}</View>
            <Text variant="bodySmall" style={styles.ratingText}>
              {product.rating.toFixed(1)}
            </Text>
          </View>
        </View>
      </Pressable>
    </Card>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  container: {
    flexDirection: 'row',
    gap: 12,
    padding: 4,
  },
  pressedContainer: {
    opacity: 0.7,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  title: {
    marginBottom: 8,
    lineHeight: 20,
  },
  price: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
});
