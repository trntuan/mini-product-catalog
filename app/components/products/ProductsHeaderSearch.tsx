import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { colors } from '../../theme';
import { CONTENT_KEYS } from '@/constants/content';

interface ProductsHeaderSearchProps {
  query: string;
  onChangeQuery: (value: string) => void;
  onClearQuery: () => void;
}

export default function ProductsHeaderSearch({
  query,
  onChangeQuery,
  onClearQuery,
}: ProductsHeaderSearchProps) {
  const {theme} = useTheme();

  return (
    <View style={[styles.wrapper, {borderColor: theme.cardBorderColor}]}>
      <Ionicons
        name="search"
        size={18}
        color={theme.textMuted}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, {color: theme.color}]}
        placeholder={CONTENT_KEYS.PRODUCTS.PLACEHOLDERS.SEARCH_PRODUCTS}
        placeholderTextColor={theme.textMuted}
        value={query}
        onChangeText={onChangeQuery}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {query.length > 0 && (
        <TouchableOpacity
          onPress={onClearQuery}
          style={styles.clearButton}
          accessibilityLabel={CONTENT_KEYS.BUTTONS.CLEAR}>
          <Ionicons name="close-circle" size={18} color={theme.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
  },
  icon: {
    opacity: 0.8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    paddingHorizontal: 8,
  },
  clearButton: {
    padding: 2,
  },
});
