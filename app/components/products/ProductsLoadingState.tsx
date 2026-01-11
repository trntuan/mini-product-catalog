import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { CONTENT_KEYS } from '@/constants/content';
import Text from '../ui/Text';

export default function ProductsLoadingState() {
  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.primary} />
      <Text style={[styles.text, {color: theme.color}]}> 
        {CONTENT_KEYS.PRODUCTS.MESSAGES.LOADING_PRODUCTS}
      </Text>
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
  text: {
    marginTop: 16,
  },
});
