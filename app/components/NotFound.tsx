import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useTheme } from '../hooks/useTheme';
import { CONTENT_KEYS } from '../types/content';
import Text from './Text';

interface NotFoundProps {
  title?: string;
  message?: string;
}

const NotFound = ({
  title = CONTENT_KEYS.NOT_FOUND.DEFAULT_TITLE,
  message = CONTENT_KEYS.NOT_FOUND.DEFAULT_MESSAGE,
}: NotFoundProps) => {
  const {theme} = useTheme();
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={64} color={theme.color} style={styles.icon} />
      <Text variant="titleLarge" style={[styles.title, {color: theme.color}]}>
        {title}
      </Text>
      <Text variant="bodyMedium" style={[styles.message, {color: theme.color}]}>
        {message}
      </Text>
    </View>
  );
};

export default NotFound;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  icon: {
    opacity: 0.3,
    marginBottom: 16,
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
  },
});
