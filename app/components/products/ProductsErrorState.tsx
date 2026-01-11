import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { CONTENT_KEYS } from '../../types/content';
import { Button } from '../ui/Button/Button';
import Text from '../ui/Text';

interface ProductsErrorStateProps {
  error: string | null;
  onRetry: () => void;
}

export default function ProductsErrorState({
  error,
  onRetry,
}: ProductsErrorStateProps) {
  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={[styles.title, {color: theme.error}]}> 
        {CONTENT_KEYS.PRODUCTS.TITLES.UNABLE_TO_LOAD}
      </Text>
      <Text variant="bodyMedium" style={[styles.message, {color: theme.color}]}> 
        {error || CONTENT_KEYS.PRODUCTS.MESSAGES.FAILED_TO_LOAD}
      </Text>
      <Button
        onPress={onRetry}
        text={CONTENT_KEYS.BUTTONS.RETRY}
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
