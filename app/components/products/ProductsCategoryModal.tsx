import React from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { useTheme } from '../../hooks/useTheme';
import { CONTENT_KEYS } from '../../types/content';
import Text from '../ui/Text';

interface CategoryOption {
  slug: string;
  name: string;
}

interface ProductsCategoryModalProps {
  visible: boolean;
  categories: CategoryOption[] | null | undefined;
  selectedCategory: string | null;
  onClose: () => void;
  onSelectCategory: (category: CategoryOption | null) => void;
}

export default function ProductsCategoryModal({
  visible,
  categories,
  selectedCategory,
  onClose,
  onSelectCategory,
}: ProductsCategoryModalProps) {
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
              {CONTENT_KEYS.PRODUCTS.TITLES.SELECT_CATEGORY}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{color: theme.primary, fontSize: 16}}>
                {CONTENT_KEYS.BUTTONS.CLOSE}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.scrollView}>
            <TouchableOpacity
              style={[
                styles.item,
                {
                  backgroundColor:
                    selectedCategory === null
                      ? theme.primary + '20'
                      : 'transparent',
                },
              ]}
              onPress={() => onSelectCategory(null)}>
              <Text
                style={[
                  styles.itemText,
                  {
                    color: selectedCategory === null ? theme.primary : theme.color,
                    fontWeight: selectedCategory === null ? '600' : '400',
                  },
                ]}>
                {CONTENT_KEYS.PRODUCTS.LABELS.ALL_CATEGORIES}
              </Text>
            </TouchableOpacity>
            {categories &&
              categories.map(category => {
                if (!category || typeof category !== 'object' || !category.slug || !category.name) {
                  return null;
                }
                return (
                  <TouchableOpacity
                    key={category.slug}
                    style={[
                      styles.item,
                      {
                        backgroundColor:
                          selectedCategory === category.slug
                            ? theme.primary + '20'
                            : 'transparent',
                      },
                    ]}
                    onPress={() => onSelectCategory(category)}>
                    <Text
                      style={[
                        styles.itemText,
                        {
                          color:
                            selectedCategory === category.slug
                              ? theme.primary
                              : theme.color,
                          fontWeight:
                            selectedCategory === category.slug ? '600' : '400',
                        },
                      ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
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
    borderBottomColor: '#E0E0E0',
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
