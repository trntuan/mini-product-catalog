/**
 * Product Info Row Component
 * Reusable component for displaying label-value pairs
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import Text from '../ui/Text';
import { useTheme } from '../../hooks/useTheme';

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
  const {theme} = useTheme();
  return (
    <View style={styles.infoRow}>
      <Text variant="titleSmall" style={[styles.infoLabel, {color: theme.textMuted}]}>
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
