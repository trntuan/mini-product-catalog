/**
 * Product Description Component
 * Displays product description in a card
 */

import React from 'react';
import { StyleSheet } from 'react-native';

import Card from './Card';
import Text from './Text';
import { CONTENT_KEYS } from '../types/content';

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({description}: ProductDescriptionProps) {
  return (
    <Card style={styles.card}>
      <Text variant="titleSmall" style={styles.sectionTitle}>
        {CONTENT_KEYS.LABELS.DESCRIPTION}
      </Text>
      <Text variant="bodyMedium" style={styles.description}>
        {description}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  sectionTitle: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  description: {
    lineHeight: 22,
    opacity: 0.8,
  },
});
