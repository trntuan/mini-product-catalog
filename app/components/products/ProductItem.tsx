import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { Product } from '../../store/productsSlice';
import Card from '../ui/Card';
import Text from '../ui/Text';

interface ProductItemProps {
  product: Product;
  onPress: (productId: number) => void;
  layout?: 'grid' | 'list';
}

const ProductItem = ({product, onPress, layout = 'grid'}: ProductItemProps) => {
  const {theme} = useTheme();

  const isGrid = layout === 'grid';

  return (
    <Card
      style={[
        styles.card,
        isGrid ? styles.cardGrid : styles.cardList,
        styles.cardShadow,
      ]}>
      <Pressable
        onPress={() => onPress(product.id)}
        style={({pressed}) => [
          styles.container,
          isGrid ? styles.containerGrid : styles.containerList,
          pressed && styles.pressedContainer,
        ]}
        accessibilityLabel={`Product: ${product.title}`}
        accessibilityRole="button">
        <View
          style={[
            styles.imageContainer,
            isGrid ? styles.imageGrid : styles.imageList,
          ]}>
          <Image
            source={{uri: product.thumbnail}}
            style={[styles.thumbnail, isGrid ? styles.thumbnailGrid : styles.thumbnailList]}
            resizeMode={isGrid ? 'cover' : 'contain'}
          />
        </View>
        <View style={[styles.content, isGrid ? styles.contentGrid : styles.contentList]}>
          <Text
            variant="bodySmall"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.categoryTag, {color: theme.textMuted}]}>
            {product.category}
          </Text>
          <Text
            variant="titleSmall"
            numberOfLines={2}
            ellipsizeMode="tail"
            style={[styles.title, {color: theme.color}]}>
            {product.title}
          </Text>
          <View style={styles.metaRow}>
            <Text variant="titleLarge" style={[styles.price, {color: theme.color}]}>
              ${product.price.toFixed(2)}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={14} color={theme.primary} style={styles.star} />
              <Text variant="bodySmall" style={[styles.ratingText, {color: theme.textMuted}]}>
                {product.rating.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Card>
  );
};

export default ProductItem;

const styles = StyleSheet.create({
  card: {
    borderWidth: 0,
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
  cardShadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  container: {
    gap: 8,
    padding: 6,
  },
  containerGrid: {
    flexDirection: 'column',
  },
  containerList: {
    flexDirection: 'row',
  },
  pressedContainer: {
    opacity: 0.7,
  },
  imageContainer: {
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
  },
  imageGrid: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
  },
  imageList: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailGrid: {
    borderRadius: 12,
  },
  thumbnailList: {
    borderRadius: 12,
  },
  content: {
    flex: 1,
  },
  contentGrid: {
    paddingTop: 8,
    paddingBottom: 2,
    minHeight: 86,
  },
  contentList: {
    paddingTop: 2,
    paddingBottom: 2,
    justifyContent: 'space-between',
  },
  categoryTag: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
  },
  title: {
    marginBottom: 4,
    lineHeight: 17,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontWeight: '700',
    fontSize: 15,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
  ratingText: {
    opacity: 0.7,
  },
  cardGrid: {
    alignSelf: 'flex-start',
    width: '48%',
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: 260,
  },
  cardList: {
    width: '100%',
    alignSelf: 'stretch',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
