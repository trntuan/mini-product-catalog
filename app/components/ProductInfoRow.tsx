/**
 * Product Info Row Component
 * Reusable component for displaying label-value pairs
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import Text from './Text';

interface ProductInfoRowProps {
  label: string;
  value: string;
  valueColor?: string;
}

export default function ProductInfoRow({
  label,
  value,
  valueColor,
}: ProductInfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text variant="titleSmall" style={styles.infoLabel}>
        {label}
      </Text>
      <Text
        variant="bodyMedium"
        style={[styles.infoValue, valueColor ? {color: valueColor} : undefined]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
