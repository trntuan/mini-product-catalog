import React from 'react';
import {StyleSheet, Pressable, View, Image} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {useTheme} from '../theme/useTheme';
import Card from './Card';
import Text from './Text';
import {Product} from '../store/productsSlice';

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
    <Card style={styles.card}>
      <Pressable
        onPress={() => onPress(product.id)}
        style={styles.container}
        accessibilityLabel={`Product: ${product.title}`}
        accessibilityRole="button">
        <Image
          source={{uri: product.thumbnail}}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        <View style={styles.content}>
          <Text variant="titleSmall" style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <Text variant="bodyMedium" style={[styles.price, {color: theme.primary}]}>
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
  },
  container: {
    flexDirection: 'row',
    gap: 12,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: 8,
  },
  price: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
