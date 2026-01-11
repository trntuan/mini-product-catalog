import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { CONTENT_KEYS } from '@/constants/content';
import { Button } from '../ui/Button/Button';
import Text from '../ui/Text';

interface ProductsListFooterProps {
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  hasItems: boolean;
  onRetryLoadMore: () => void;
}

export default function ProductsListFooter({
  loadingMore,
  error,
  hasMore,
  hasItems,
  onRetryLoadMore,
}: ProductsListFooterProps) {
  const {theme} = useTheme();

  if (loadingMore) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color={theme.primary} />
        <Text variant="bodySmall" style={[styles.loadingText, {color: theme.color}]}> 
          {CONTENT_KEYS.MESSAGES.LOADING_MORE}
        </Text>
      </View>
    );
  }

  if (error && hasItems) {
    return (
      <View style={styles.container}>
        <Text variant="bodySmall" style={[styles.errorText, {color: theme.error}]}> 
          {error}
        </Text>
        <Button
          onPress={onRetryLoadMore}
          text={CONTENT_KEYS.BUTTONS.RETRY}
          style={styles.retryButton}
        />
      </View>
    );
  }

  if (!hasMore && hasItems) {
    return (
      <View style={styles.container}>
        <Text variant="bodySmall" style={[styles.endText, {color: theme.color}]}> 
          {CONTENT_KEYS.MESSAGES.NO_MORE_PRODUCTS}
        </Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    opacity: 0.7,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    minWidth: 100,
    marginTop: 8,
  },
  endText: {
    marginTop: 8,
    opacity: 0.5,
    fontStyle: 'italic',
  },
});
