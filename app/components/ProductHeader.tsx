/**
 * Product Header Component
 * Displays product title, price, and rating
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import Card from './Card';
import Text from './Text';
import { useTheme } from '../hooks/useTheme';

interface ProductHeaderProps {
  title: string;
  price: number;
  rating: number;
  renderStars: (rating: number) => React.ReactNode;
}

export default function ProductHeader({
  title,
  price,
  rating,
  renderStars,
}: ProductHeaderProps) {
  const {theme} = useTheme();

  return (
    <Card style={styles.card}>
      <Text variant="titleLarge" style={styles.title}>
        {title}
      </Text>
      <View style={styles.priceRow}>
        <View style={[styles.pricePill, {backgroundColor: theme.primarySoft}]}>
          <Text variant="titleLarge" style={[styles.price, {color: theme.primary}]}>
            ${price.toFixed(2)}
          </Text>
        </View>
      </View>
      <View style={styles.ratingContainer}>
        <View style={styles.stars}>{renderStars(rating)}</View>
        <Text variant="bodyMedium" style={[styles.ratingText, {color: theme.textMuted}]}>
          {rating.toFixed(1)}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
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
  pricePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  price: {
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
  ratingText: {
    opacity: 0.7,
  },
});
