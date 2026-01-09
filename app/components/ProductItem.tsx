import React from 'react';
import {StyleSheet, Pressable, TouchableOpacity, View, Image} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useDispatch, useSelector} from 'react-redux';

import {useTheme} from '../theme/useTheme';
import Card from './Card';
import Text from './Text';
import {Product} from '../store/productsSlice';
import {toggleFavorite} from '../store/favoritesSlice';
import {RootState} from '../store/store';

interface ProductItemProps {
  product: Product;
  onPress: (productId: number) => void;
}

const ProductItem = ({product, onPress}: ProductItemProps) => {
  const {theme} = useTheme();
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state: RootState) => state.favorites.favoriteIds);
  const isFavorite = favoriteIds.includes(product.id);

  const handleToggleFavorite = (e: any) => {
    e.stopPropagation();
    dispatch(toggleFavorite(product.id));
  };

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
          <View style={styles.titleRow}>
            <Text variant="titleSmall" style={styles.title} numberOfLines={2}>
              {product.title}
            </Text>
            <TouchableOpacity
              onPress={handleToggleFavorite}
              style={styles.favoriteButton}
              accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              accessibilityRole="button">
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? '#FF6B6B' : theme.color}
              />
            </TouchableOpacity>
          </View>
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  title: {
    flex: 1,
  },
  favoriteButton: {
    padding: 4,
    marginTop: -4,
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
