import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { CONTENT_KEYS } from '@/constants/content';
import NotFound from '../feedback/NotFound';
import { Button } from '../ui/Button/Button';
import Text from '../ui/Text';

interface ProductsEmptyStateProps {
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

export default function ProductsEmptyState({
  hasActiveFilters,
  onClearFilters,
}: ProductsEmptyStateProps) {
  const {theme} = useTheme();

  if (!hasActiveFilters) {
    return (
      <NotFound
        title={CONTENT_KEYS.PRODUCTS.TITLES.NO_PRODUCTS}
        message={CONTENT_KEYS.PRODUCTS.MESSAGES.NO_PRODUCTS_AVAILABLE}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={[styles.title, {color: theme.color}]}> 
        {CONTENT_KEYS.PRODUCTS.TITLES.NO_RESULTS_FOUND}
      </Text>
      <Text variant="bodyMedium" style={[styles.message, {color: theme.color}]}> 
        {CONTENT_KEYS.PRODUCTS.MESSAGES.NO_RESULTS_MESSAGE}
      </Text>
      <Button
        onPress={onClearFilters}
        text={CONTENT_KEYS.BUTTONS.CLEAR_FILTERS}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    lineHeight: 20,
  },
  button: {
    minWidth: 120,
  },
});
