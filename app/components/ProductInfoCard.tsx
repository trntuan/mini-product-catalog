/**
 * Product Info Card Component
 * Displays product information (brand, category, stock) in a card
 */

import React from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '../hooks/useTheme';
import { CONTENT_KEYS, getStockStatusText } from '../types/content';
import Card from './Card';
import ProductInfoRow from './ProductInfoRow';

interface ProductInfoCardProps {
  brand: string;
  category: string;
  stock: number;
}

export default function ProductInfoCard({
  brand,
  category,
  stock,
}: ProductInfoCardProps) {
  const {theme} = useTheme();

  return (
    <Card style={styles.card}>
      <ProductInfoRow
        label={CONTENT_KEYS.PRODUCTS.LABELS.BRAND}
        value={brand}
      />
      <ProductInfoRow
        label={CONTENT_KEYS.PRODUCTS.LABELS.CATEGORY}
        value={category}
      />
      <ProductInfoRow
        label={CONTENT_KEYS.PRODUCTS.LABELS.STOCK}
        value={getStockStatusText(
          stock,
          CONTENT_KEYS.PRODUCTS.MESSAGES.IN_STOCK,
          CONTENT_KEYS.PRODUCTS.MESSAGES.OUT_OF_STOCK
        )}
        valueColor={stock > 0 ? theme.primary : theme.error}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
});
