import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { CONTENT_KEYS } from '../../types/content';

interface ProductsHeaderFiltersProps {
  selectedCategory: string | null;
  sortOption: 'none' | 'price-asc' | 'price-desc' | 'rating-desc';
  hasActiveFilters: boolean;
  onOpenCategory: () => void;
  onOpenSort: () => void;
  onClearFilters: () => void;
}

export default function ProductsHeaderFilters({
  selectedCategory,
  sortOption,
  hasActiveFilters,
  onOpenCategory,
  onOpenSort,
  onClearFilters,
}: ProductsHeaderFiltersProps) {
  const {theme} = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.iconButton,
          {
            backgroundColor:
              selectedCategory !== null ? theme.primarySoft : theme.cardBg,
            borderColor: theme.cardBorderColor,
          },
        ]}
        onPress={onOpenCategory}
        accessibilityLabel={CONTENT_KEYS.LABELS.CATEGORY}>
        <Ionicons
          name="funnel-outline"
          size={18}
          color={selectedCategory !== null ? theme.primary : theme.textMuted}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.iconButton,
          {
            backgroundColor:
              sortOption !== 'none' ? theme.primarySoft : theme.cardBg,
            borderColor: theme.cardBorderColor,
          },
        ]}
        onPress={onOpenSort}
        accessibilityLabel={CONTENT_KEYS.LABELS.SORT}>
        <Ionicons
          name="swap-vertical-outline"
          size={18}
          color={sortOption !== 'none' ? theme.primary : theme.textMuted}
        />
      </TouchableOpacity>
      {hasActiveFilters && (
        <TouchableOpacity
          style={[styles.iconButton, {borderColor: theme.error}]}
          onPress={onClearFilters}
          accessibilityLabel={CONTENT_KEYS.BUTTONS.CLEAR}>
          <Ionicons name="close" size={18} color={theme.error} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginRight: 8,
  },
  iconButton: {
    height: 36,
    width: 36,
    borderWidth: 1,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
