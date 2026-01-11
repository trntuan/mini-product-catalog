import React from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { colors } from '../../theme';
import { CONTENT_KEYS } from '@/constants/content';
import Text from '../ui/Text';

type SortOption = 'none' | 'price-asc' | 'price-desc' | 'rating-desc';

interface ProductsSortModalProps {
  visible: boolean;
  sortOption: SortOption;
  onClose: () => void;
  onSelectSort: (option: SortOption) => void;
}

const SORT_OPTIONS: {value: SortOption; label: string}[] = [
  {value: 'none', label: CONTENT_KEYS.PRODUCTS.LABELS.SORT_NONE},
  {value: 'price-asc', label: CONTENT_KEYS.PRODUCTS.LABELS.SORT_PRICE_LOW_TO_HIGH},
  {value: 'price-desc', label: CONTENT_KEYS.PRODUCTS.LABELS.SORT_PRICE_HIGH_TO_LOW},
  {value: 'rating-desc', label: CONTENT_KEYS.PRODUCTS.LABELS.SORT_RATING_HIGH_TO_LOW},
];

export default function ProductsSortModal({
  visible,
  sortOption,
  onClose,
  onSelectSort,
}: ProductsSortModalProps) {
  const {theme} = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.content, {backgroundColor: theme.cardBg}]}> 
          <View style={styles.header}>
            <Text variant="titleLarge" style={{color: theme.color}}>
              {CONTENT_KEYS.PRODUCTS.TITLES.SORT_BY}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{color: theme.primary, fontSize: 16}}>
                {CONTENT_KEYS.BUTTONS.CLOSE}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView}>
            {SORT_OPTIONS.map(option => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.item,
                  {
                    backgroundColor:
                      sortOption === option.value
                        ? theme.primary + '20'
                        : 'transparent',
                  },
                ]}
                onPress={() => onSelectSort(option.value)}>
                <Text
                  style={[
                    styles.itemText,
                    {
                      color: sortOption === option.value ? theme.primary : theme.color,
                      fontWeight: sortOption === option.value ? '600' : '400',
                    },
                  ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  scrollView: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  itemText: {
    fontSize: 16,
  },
});
